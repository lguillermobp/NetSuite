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
        var transferred=[];
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
                    }, {
                    "name": "custrecord_wipbin",
                        "join": "department"
                    },
                    "department"
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
                pdf = pdf.replace("[DEPARTMENT]", result.getText({name: "department"}));
                pdf = pdf.replace("[WIP_BIN]", result.getText({name: "custrecord_wipbin", join: "department"}));
            });


            var resultstr= findCases5(WO_INTERNAL_ID,workOrderLocationID);
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
                
                "columns":   [
                
                    search.createColumn({
                       name: "internalid",
                       summary: "GROUP"
                    }),
                    search.createColumn({
                       name: "item",
                       summary: "GROUP"
                    }),
                    search.createColumn({
                       name: "purchasedescription",
                       join: "item",
                       summary: "GROUP"
                    }),
                    search.createColumn({
                       name: "quantity",
                       summary: "SUM"
                    }),
                    search.createColumn({
                       name: "quantitycommitted",
                       summary: "SUM"
                    }),
                    search.createColumn({
                       name: "formulanumeric",
                       summary: "SUM",
                       formula: "CASE WHEN NVL({item.quantityavailable}, 0)<{quantity}- NVL({quantitycommitted}, 0) THEN ABS(NVL({item.quantityavailable}, 0)-{quantity}+ NVL({quantitycommitted}, 0))  ELSE 0 END"
                    }),
                    search.createColumn({
                       name: "formulatext",
                       summary: "GROUP",
                       formula: "SUBSTR({item.purchasedescription}, 0, 290)"
                    }),
                    search.createColumn({
                       name: "binnumber",
                       join: "item",
                       summary: "GROUP"
                    }),
                    search.createColumn({
                       name: "internalid",
                       join: "item",
                       summary: "GROUP"
                    })
                 ]
            }).run().each(function (result) {
                lineItemIds.push(result.getValue({
                    name: "internalid",
                    join: "item",
                    summary: "GROUP"
                }));

                
                if (!transferred[result.getText({name: "item",summary: "GROUP"})]) {qtytrn="0"}
                else {qtytrn=transferred[result.getText({name: "item",summary: "GROUP"})].qty}
                log.audit("item " , result.getText({name: "item",summary: "GROUP"}));
                log.audit("backo " , result.getValue({name: "formulanumeric",summary: "SUM"}));
                log.audit("qtytrn " , qtytrn);
                log.audit("qty " , result.getValue({name: "quantity",summary: "SUM"}));

                lineNumbers[result.getText({name: "item",summary: "GROUP"})] = {
                "line":line,
                "qty":result.getValue({name: "quantity",summary: "SUM"}),
                //"qtyc":result.getValue({name: "quantitycommitted"}),
                "qtyc":qtytrn,
                "qtybo":result.getValue({name: "formulanumeric",summary: "SUM"}),
                "itemdesc":result.getValue({name: "formulatext",summary: "GROUP"}),
                };

                if (result.getValue({name: "formulanumeric",summary: "SUM"})>0) {
                workOrderLines += "<tr>";
                workOrderLines += `<td>${line}</td>`;
                workOrderLines += `<td>${result.getText({name: "item",summary: "GROUP"})}</td>`;
                workOrderLines += `<td>${result.getValue({name: "purchasedescription", join: "item",summary: "GROUP"})}</td>`;
                workOrderLines += `<td>${result.getValue({name: "quantity",summary: "SUM"})}</td>`;
                workOrderLines += `<td>${result.getValue({name: "binnumber", join: "item",summary: "GROUP"})}</td>`;
                workOrderLines += `<td>${result.getValue({name: "formulanumeric",summary: "SUM"})}</td>`;
                workOrderLines += "</tr>";
                }
                line += 1;

                return true;
            })

            lineItemIds = _.uniq(lineItemIds);
            log.audit("lineItemIds " , lineItemIds);
            pdf = pdf.replace("WORK_ORDER_LINES", workOrderLines);
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
                    search.createColumn({
                        name: "binnumber",
                        sort: search.Sort.ASC
                    }),
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
                
                let inventoryBalanceLocation = result.getText({name: "location"})
                const inventoryBalanceLocationPriority = inventoryBalanceLocation === workOrderLocation ? 1 : 2;
                inventoryBalanceLocation = inventoryBalanceLocation === "Orlando warehouse" ? "WHS" : "P1";

                if (itembef!=result.getText({name: "item"})) {
                    itembef=result.getText({name: "item"});
                    balanceitem=parseInt(lineNumbers[result.getText({name: "item"})].qty) - parseInt(lineNumbers[result.getText({name: "item"})].qtyc);
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
                        "itemdesc": lineNumbers[result.getText({name: "item"})].itemdesc,
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
                        "available": lineNumbers[result.getText({name: "item"})].qtyc,
                        "qtyneeded": lineNumbers[result.getText({name: "item"})].qty - lineNumbers[result.getText({name: "item"})].qtyc,
                    });
                   
                }
                balanceitem=balanceitem-Number(result.getValue({name: "available"}));
                //balanceitem=balanceitem-0;



                return true;
            });

            inventoryBalanceData = _.orderBy(inventoryBalanceData, ["binnumber", "available","locationPriority"], ["asc", "asc", "asc"]);

            for (const result of inventoryBalanceData) {
                inventoryBalanceLines += "<tr>";
                inventoryBalanceLines += `<td>${result.lineNumber}</td>`
                inventoryBalanceLines += `<td>${result.item}</td>`
                inventoryBalanceLines += `<td>${result.itemdesc}</td>`
                inventoryBalanceLines += `<td>${result.binnumber}</td>`
                inventoryBalanceLines += `<td>${result.qtyneeded}</td>`
                inventoryBalanceLines += `<td>${result.onhand}</td>`
                inventoryBalanceLines += "<td></td>";
                inventoryBalanceLines += "</tr>";
            }

            pdf = pdf.replace("[INVENTORY_BALANCE]", inventoryBalanceLines)

            // XML Escape Characters
            pdf = pdf.replace(/&/g, "&amp;")

            // context.response.write(String(pdf));
            context.response.renderPdf({xmlString: pdf})
        }
        var pagedatastr=[];
        function findCases5(WO,workOrderLocation) {
          
                
            var j=0;
            const searchWorkOrderLines = search.create({
                type: "inventorytransfer",
                settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                filters:
                [
                    ["type","anyof","InvTrnfr"], 
                    "AND", 
                    ["custbody_mo","anyof",WO], 
                    "AND", 
                    ["location","anyof",workOrderLocation]
                ],
                columns:
                [
                    "trandate",
                    "type",
                    "tranid",
                    "entity",
                    "memo",
                    "amount",
                    "item",
                    "quantity",
                    "location",
                    search.createColumn({
                        name: "binnumber",
                        join: "inventoryDetail"
                    }),
                    "createdby",
                    search.createColumn({
                       name: "purchasedescription",
                       join: "item"
                    })
                ]
            });
            var pagedData = searchWorkOrderLines.runPaged({
                "pageSize" : 1000
            });
    
    
    
            pagedData.pageRanges.forEach(function (pageRange) {
    
                var page = pagedData.fetch({index: pageRange.index});
    
                page.data.forEach(function (result) {
               
                
                pagedatastr[j] = {
                    "item": result.getText({name: "item"}),
                    "itemdesc": result.getValue({name: "purchasedescription", join: "item"}),
                    "bin": result.getText({name: "binnumber", join: "inventoryDetail"}),
                    "qty": result.getValue({name: "quantity"}),
                    "type": result.getValue({name: "type"}),
                    "date": result.getValue({name: "trandate"}),
                    "dco": result.getValue({name: "tranid"}),
                    "user": result.getText({name: "createdby"})
                    }
                    j++;
    
                if (!transferred[result.getText({name: "item"})]) {qtytrn=0}
                else {qtytrn=Number(transferred[result.getText({name: "item"})]).qty}
                transferred[result.getText({name: "item"})] = {
                "qty":Number(result.getValue({name: "quantity"}))+qtytrn
                };
                
            })
        })
            
            return pagedatastr;
        }
        return {
            onRequest: onRequest
        }
    }
)
;