/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(['N/file','N/redirect',"N/runtime","N/ui/serverWidget", "N/record", "N/search", "N/file", "N/error",'N/log', "/SuiteScripts/Modules/LoDash.js"],
	/**
	 *
	 * @param serverWidget
	 * @param search
	 * @param file
	 * @param error
	 * @param base
	 * @param _
	 */
	function (file, redirect, runtime,serverWidget,record, search, file, error,log,  _) {
		/**
		 *
		 * @param context
		 */
        function onRequest(context) {

            if (context.request.method === 'GET') {
        
                let form = serverWidget.createForm({
                    title: `Picking Dashboard`
                });
                form.clientScriptModulePath = '/SuiteScripts/purchase order/DashboardClient_pl.js';

                form.addButton({
                    id: 'custpage_process',
                    label: 'Submit',
                    functionName: "process()"
                });

               

                let datepos = form.addField({
                    id: "custpage_date",
                    label: "PO Date",
                    type: serverWidget.FieldType.DATE,
                });
                
    
                let htmlField = form.addField({
                    id: "custpage_html",
                    label: "html",
                    type: serverWidget.FieldType.INLINEHTML,
                });
                htmlField.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.ENDROW
                });
                htmlField.defaultValue = '<div> testing  </div>';
    
    
                var sublistpm = form.addSublist({
                    id: 'custpage_records',
                    type : serverWidget.SublistType.LIST,
                    label: 'Componets',
        
                });
				

                sublistpm.addField({
                    id: "custrecordml_preferredvendor",
                    type: serverWidget.FieldType.TEXT,
                    label:'Proferrred Vendor'
                });

                sublistpm.addField({
                    id: "custrecordml_preferredvendorid",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Proferrred Vendor ID'
                });
    
                sublistpm.addField({
                    id: "custrecordml_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'Item'
                });
                sublistpm.addField({
                    id: "custrecordml_itemid",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Item ID'
                });
                sublistpm.addField({
                    id: "custrecordml_qty",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Quantity'
                });
                sublistpm.addField({
                    id: "custrecordml_price",
                    type: serverWidget.FieldType.FLOAT,
                    label:'Price Vendor'
                });
                sublistpm.addField({
                    id: "custrecordml_memo",
                    type: serverWidget.FieldType.TEXT,
                    label:'Project'
                });
                sublistpm.addField({
                    id: 'custrecordml_omit',
                    label: 'Omit',
                    type: serverWidget.FieldType.CHECKBOX
                });
    
                // loop through each line, skipping the header
                var resultspt= findCases1();
                var counter = 0;
                resultspt.forEach(function(result1) {


                    sublistpm.setSublistValue({
                        id: 'custrecordml_preferredvendor',
                        line: counter,
                        value: result1.preferredvendor
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_preferredvendorid',
                        line: counter,
                        value: result1.preferredvendorid
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_item',
                        line: counter,
                        value: result1.item
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_itemid',
                        line: counter,
                        value: result1.itemid
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_price',
                        line: counter,
                        value: result1.price
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_qty',
                        line: counter,
                        value: result1.qty
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_memo',
                        line: counter,
                        value: result1.memo
                    });
                   
                    counter++;
                
				})

                
                context.response.writePage(form);
            } else {
              
            
            }
    }
	function findCases1() {
		var pagedatas=[];

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
            workOrderLines += `<td>${result.getValue({name: "purchasedescription", join: "item"})}</td>`;
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

            pagedatas[i] = {
                "lineNumber": result.lineNumber,
                "item": result.item,
                "binlocation": result.binnumber,
                "qty": result.qty,
                "onhand": result.onhand,
                "qty": qtytot,
                "memo": memo
                }



        }

	

		return pagedatas;
	}
    return {
        onRequest: onRequest
    };
});