/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(["N/search", "N/file", "N/render", "N/runtime", "N/format", "N/xml", "N/log", "/SuiteScripts/Modules/LoDash.js"],
    /**
     *
     * @param {search} search
     * @param {file} file
     * @param {render} render
     * @param {runtime} runtime
     * @param {format} format
     * @param {xml} xml
     * @param {LoDash} _
     * @returns {{onRequest: onRequest}}
     */
    function (search, file, render, runtime, format, xml,log,  _) {
        var workOrderLocation;
        var workOrderLocationID;
        function onRequest(context) {
            const WO_INTERNAL_ID = String(context.request.parameters.id);

            let pdf = file.load({id: "/SuiteScripts/bomPDF.xml"}).getContents();

            pdf = pdf.replace("[PRINTED_BY]", runtime.getCurrentUser().name);
            pdf = pdf.replace("[DATE_TIME]", format.format({
                value: new Date(),
                type: format.Type.DATETIME,
                timezone: format.Timezone.AMERICA_NEW_YORK
            }));

            const searchWorkOrderHeader = search.create({
                "type": "transaction",
                "filters": 
                [
                    ["type","anyof","WorkOrd"], 
                    "AND", 
                    ["internalid","anyof",[WO_INTERNAL_ID]], 
                    "AND", 
                    ["mainline","is","T"]
                 ],
                
                "columns": [
                    {
                        "name": "tranid",
                        "label": "Document Number",
                        "type": "text",
                        "sortdir": "NONE"
                    }, {
                        "name": "entity",
                        "label": "Neighbor",
                        "type": "select",
                        "sortdir": "NONE"
                    }, {
                        "name": "location",
                        "label": "Location",
                        "type": "select",
                        "sortdir": "NONE"
                    }, {
                        "name": "location",
                        "label": "Location",
                        "type": "select",
                        "sortdir": "NONE"
                    }, {
                        "name": "item",
                        "label": "Item",
                        "type": "select",
                        "sortdir": "NONE"
                    }, {
                        "name": "quantity",
                        "label": "Quantity",
                        "type": "float",
                        "sortdir": "NONE"
                    }, {
                        "name": "memo",
                        "label": "Memo",
                        "type": "text",
                        "sortdir": "NONE"
                    }, {
                        "name": "type",
                        "join": "createdFrom",
                        "label": "Type",
                        "type": "select",
                        "sortdir": "NONE"
                    }, {
                        "name": "tranid",
                        "join": "createdFrom",
                        "label": "Document Number",
                        "type": "text",
                        "sortdir": "NONE"
                    }, {
                        "name": "otherrefnum",
                        "join": "createdFrom",
                        "label": "Customer PO Number",
                        "type": "text",
                        "sortdir": "NONE"
                    }, {
                        "name": "enddate",
                        "label": "Sales Order Requested Ship Date",
                        "type": "date",
                        "sortdir": "NONE"
                    }
                ]
            }).run().each(function (result) {
                workOrderLocation = result.getText({name: "location"});
                workOrderLocationID = result.getValue({name: "location"});

                pdf = pdf.replace("[WORK_ORDER]", result.getValue({name: "tranid"}));
                pdf = pdf.replace("[LOCATION]", workOrderLocation);
                pdf = pdf.replace("[NEIGHBOR]", result.getText({name: "entity"}));
                pdf = pdf.replace("[SALES_ORDER]", result.getValue({name: "tranid", join: "createdFrom"}));
                pdf = pdf.replace("[NEIGHBOR_PO]", result.getValue({name: "otherrefnum", join: "createdFrom"}));
                pdf = pdf.replace("[SALES_ORDER_REQ_SHIP_DATE]", result.getValue({name: "enddate",}));
                pdf = pdf.replace("[FINISHED_GOOD]", result.getText({name: "item"}));
                pdf = pdf.replace("[FINISHED_QUANTITY]", result.getValue({name: "quantity"}));
            });



            let workOrderLines = "";
            let line = 1;
            let lineItemIds = [];
            let lineNumbers = {};
            const searchWorkOrderLines = search.create({
                "type": "transaction",
                "filters": [
                    ["type","anyof","WorkOrd"], 
                    "AND", 
                    ["internalid","anyof",[WO_INTERNAL_ID]], 
                    "AND", 
                    ["mainline","is","F"]
                 ],
                
                "columns": [
                    {
                        "name": "internalid",
                        "join": "item",
                        "label": "Internal ID",
                        "type": "select",
                        "sortdir": "NONE"
                    },
                    {
                        "name": "item",
                        "label": "Item",
                        "type": "select",
                        "sortdir": "NONE"
                    },
                    {
                        "name": "purchasedescription",
                        "join": "item",
                        "label": "Description",
                        "type": "text",
                        "sortdir": "NONE"
                    },
                    {
                        "name": "quantity",
                        "label": "Quantity",
                        "type": "float",
                        "sortdir": "NONE"
                    },
                    {
                        "name": "quantitycommitted",
                        "label": "quantitycommitted",
                        "type": "float",
                        "sortdir": "NONE"
                    }
                ]
            }).run().each(function (result) {
                lineItemIds.push(result.getValue({
                    name: "internalid",
                    join: "item"
                }));

                lineNumbers[result.getText({name: "item"})] = {
                    "line":line,
                    "qty":result.getValue({name: "quantity"}),
                    "qtyc":result.getValue({name: "quantitycommitted"})
                };


                workOrderLines += "<tr>";
                workOrderLines += `<td>${line}</td>`;
                workOrderLines += `<td> ${result.getText({name: "item"})}</td>`;
                workOrderLines += `<td>${result.getValue({name: "purchasedescription", join: "item"})}<br/><img src="https://barcode.tec-it.com/barcode.ashx?data=${result.getText({name: "item"})}&code=&multiplebarcodes=false&translate-esc=true&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&codepage=Default&qunit=Mm&quiet=0&hidehrt=True" height="30pt" /></td>`;
                workOrderLines += `<td>${result.getValue({name: "quantity"})}</td>`;
                workOrderLines += `<td>${result.getValue({name: "quantitycommitted"})}</td>`;
                workOrderLines += "</tr>";
                workOrderLines += "<tr>";
                workOrderLines += `<td colspan="2"> </td>`;
                workOrderLines += `<td colspan="3"><table style="width: 95%; margin-top: 10px;" id="detallbin${line}"><thead><tr><th>Bin Location</th><th>Quantity</th><th>Available</th></tr></thead> </table></td>`;
                workOrderLines += "</tr>";

                line += 1;

                return true;
            })

            lineItemIds = _.uniq(lineItemIds);
            log.audit("lineItemIds " , lineItemIds);
            pdf = pdf.replace("[WORK_ORDER_LINES]", workOrderLines);
            let balanceitem=0;
            let itembef;
            let inventoryBalanceLines = "";
            let inventoryBalanceData = [];
            const searchInventoryBalance = search.create({
                "type": "InventoryBalance",
                "filters": [{
                    "name": "internalid",
                    "join": "item",
                    "operator": "anyof",
                    "values": lineItemIds,
                    "isor": false,
                    "isnot": false,
                    "leftparens": 0,
                    "rightparens": 0
                }, {
                    "name": "location",
                    "operator": "noneof",
                    "values": [
                        workOrderLocationID
                    ],
                    "isor": false,
                    "isnot": false,
                    "leftparens": 0,
                    "rightparens": 0
                },
                {
                    "name": "binnumber",
                    "operator": "noneof",
                    "values": [
                        "10892","15207","10462"
                    ],
                    "isor": false,
                    "isnot": false,
                    "leftparens": 0,
                    "rightparens": 0
                }

                ],
                "columns": [
                    search.createColumn({
                        name: "item",
                        sort: search.Sort.ASC
                    }),
                    search.createColumn({
                        name: "datecreated",
                        join: "inventoryNumber",
                        sort: search.Sort.ASC
                    }),
                    "binnumber",
                    "location",
                    "inventorynumber",
                    "status",
                    search.createColumn({
                        name: "onhand",
                        sort: search.Sort.ASC
                    }),
                    "available",
                    search.createColumn({
                        name: "expirationdate",
                        join: "inventoryNumber"
                    })
                ]
            }).run().each(function (result) {
                log.debug({title: "workOrderLocationID", details: workOrderLocationID});
                let inventoryBalanceLocation = result.getText({name: "location"})
                const inventoryBalanceLocationPriority = inventoryBalanceLocation === workOrderLocation ? 1 : 2;
                inventoryBalanceLocation = inventoryBalanceLocation === "Kissimmee-WIP" ? "WIP" : "Warehouse";

                if (itembef!=result.getText({name: "item"})) {
                    itembef=result.getText({name: "item"});
                    balanceitem=parseInt(lineNumbers[result.getText({name: "item"})].qty);
                }
                var qtyr=0;
                if (balanceitem>result.getValue({name: "available"})) {
                    qtyr=parseInt(result.getValue({name: "available"}));
                }
                else {
                    qtyr=balanceitem;
                }
                if (balanceitem>0) {
                    inventoryBalanceData.push({
                        "lineNumber": lineNumbers[result.getText({name: "item"})].line,
                        "qty": qtyr,
                        "item": result.getText({name: "item"}),
                        "locationPriority": inventoryBalanceLocationPriority,
                        "location": inventoryBalanceLocation,
                        "binnumber": result.getText({name: "binnumber"}),
                        "inventorynumber": result.getText({name: "inventorynumber"}),
                        "expirationdate": result.getValue({name: "expirationDate", join: "inventoryNumber"}),
                        //"expirationdate": balanceitem + "-" + Number(result.getValue({name: "available"})),
                        "datecreated": result.getValue({name: "datecreated", join: "inventoryNumber"}),
                        "onhand": Number(result.getValue({name: "onhand"})),
                        "available": Number(result.getValue({name: "available"}))
                    });
                    log.audit("available " , result.getValue({name: "available"}));
                }
                balanceitem=balanceitem-Number(result.getValue({name: "available"}));


                return true;
            });

            inventoryBalanceData = _.orderBy(inventoryBalanceData, ["lineNumber", "available","locationPriority"], ["asc", "asc", "asc"]);
            var scripjs="";
            for (const result of inventoryBalanceData) {

                scripjs += `
                  var table = document.getElementById("detallbin${result.lineNumber}");
                  var row = table.insertRow(-1);
                  var cell1 = row.insertCell(0);
                  var cell2 = row.insertCell(1);
                  var cell3 = row.insertCell(2);
                  cell1.innerHTML = "${result.binnumber}";
                  cell2.innerHTML = "<strong>${result.qty}</strong>";
                  cell3.innerHTML = "${result.onhand}";
                `

                inventoryBalanceLines += "<tr style='border: 1px solid black;  padding: 4px 6px;'>";
                inventoryBalanceLines += `<td>${result.lineNumber}</td>`
                inventoryBalanceLines += `<td  align="left"><barcode codetype="code128" value="${result.item}"/></td>`
               // inventoryBalanceLines += `<td>${result.location}</td>`
                inventoryBalanceLines += `<td>${result.binnumber}</td>`
                inventoryBalanceLines += `<td><strong>${result.qty}</strong></td>`
                inventoryBalanceLines += `<td>${result.onhand}</td>`
                
                inventoryBalanceLines += "</tr>";
            }

            pdf = pdf.replace("[INVENTORY_BALANCE]", inventoryBalanceLines);
            pdf = pdf.replace("[SCRIPT_JS]", scripjs);

            // XML Escape Characters
            pdf = pdf.replace(/&/g, "&amp;")

            // context.response.write(String(pdf));
            context.response.write({ output: pdf });
            //context.response.renderPdf({xmlString: pdf})
        }

        return {
            onRequest: onRequest
        }
    }
)
;