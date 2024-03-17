/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(["N/runtime",'N/redirect',"N/runtime","N/ui/serverWidget", "N/record", "N/search", "N/file", "N/error",'N/log', "/SuiteScripts/Modules/LoDash.js", "/SuiteScripts/Modules/generaltoolsv1.js"],
	/**
	 *
	 * @param serverWidget
	 * @param search
	 * @param file
	 * @param error
	 * @param base
	 * @param _
	 */
    
	function (runtime, redirect, runtime,serverWidget,record, search, file, error,log,  _, GENERALTOOLS) {
		/**
		 *
		 * @param context
		 */
        var pagedatasbo=[];
        function onRequest(context) {
            var userObj = runtime.getCurrentUser();
            var userID = userObj.id;
            var userPermission = userObj.getPermission({	name : 'TRAN_BUILD'	});
            autAB= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;

            WOID = context.request.parameters.idwo;
            paramWO = GENERALTOOLS.get_WO_value(WOID);
            
            entityname= paramWO.data.getValue({fieldId: "entityname"});
            finishedgoodsso= paramWO.data.getText({fieldId: "assemblyitem"});
            WONo= paramWO.data.getValue({fieldId: "tranid"});
            

            finishedqtyso= paramWO.data.getValue({fieldId: "quantity"});

            var SOID= paramWO.data.getValue({fieldId: "createdfrom"});

            paramSO = GENERALTOOLS.get_SO_value(SOID);
            customerso = paramSO.data.getText({fieldId: "entity"});
            SONo = paramSO.data.getValue({fieldId: "tranid"});
            departmentso = paramWO.data.getText({fieldId: "department"});
            departmentid = paramWO.data.getValue({fieldId: "department"});
            locationso = paramWO.data.getText({fieldId: "location"});
            customerPOso = paramSO.data.getValue({fieldId: "otherrefnum"});
            paramdpt = GENERALTOOLS.get_department_value(departmentid);
            wipbinso = paramdpt.data.getText({fieldId: "custrecord_wipbin"});



            if (context.request.method === 'GET') {
        
                let form = serverWidget.createForm({
                    title: `Picking Dashboard`
                });
                form.clientScriptModulePath = '/SuiteScripts/picking/DashboardClient_pl.js';

                form.addButton({
                    id: 'custpage_process',
                    label: 'Submit',
                    functionName: "process()"
                });

                form.addButton({
                    id: 'custpage_buttonhelp', //always prefix with 'custpage_'
                    label: 'HELP', //label of the button
                    functionName: 'gohelp'
                });
        
                var fieldgroup1 = form.addFieldGroup({
                    id : 'fieldgroupid1',
                    label : 'Main'
                });
                var fieldgroup2 = form.addFieldGroup({
                    id : 'fieldgroupid2',
                    label : 'BOM'
                });

                // Sales Contract Field

                let saleorderno = form.addField({
                    id: "custpage_saleorderno",
                    type: serverWidget.FieldType.TEXT,
                    label: "sale Order",
                    container : 'fieldgroupid1'
                });
                saleorderno.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.STARTROW
                });
                saleorderno.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                saleorderno.defaultValue = SONo;

                 // Work Order Field
                
                 let workorderno = form.addField({
                    id: "custpage_workorderno",
                    type: serverWidget.FieldType.TEXT,
                    label: "Work Order",
                    container : 'fieldgroupid1'
                });
                workorderno.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.STARTROW
                });
                workorderno.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                workorderno.defaultValue = WONo;

                // Customer Field
                
                let customer = form.addField({
                    id: "custpage_customer",
                    type: serverWidget.FieldType.TEXT,
                    label: "Customer",
                    container : 'fieldgroupid1'
                });
                customer.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.STARTROW
                });
                customer.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                customer.defaultValue = customerso;

                // CustomerPO Field
                
                let customerPO = form.addField({
                    id: "custpage_customerpo",
                    type: serverWidget.FieldType.TEXT,
                    label: "Customer PO",
                    container : 'fieldgroupid1'
                });
                
                customerPO.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                customerPO.defaultValue = customerPOso;

                // department Field
                
                let department = form.addField({
                    id: "custpage_department",
                    type: serverWidget.FieldType.TEXT,
                    label: "Department",
                    container : 'fieldgroupid1'
                });
                
                department.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                department.defaultValue = departmentso;

                // wipbin Field
                
                let wipbin = form.addField({
                    id: "custpage_wipbin",
                    type: serverWidget.FieldType.TEXT,
                    label: "wip binlocation",
                    container : 'fieldgroupid1'
                });
                
                wipbin.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                wipbin.defaultValue = wipbinso;

                // location Field
                
                let location = form.addField({
                    id: "custpage_location",
                    type: serverWidget.FieldType.TEXT,
                    label: "location",
                    container : 'fieldgroupid1'
                });
                
                location.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                location.defaultValue = locationso;

                // Ship Date Field
                /*
                let shipdate = form.addField({
                    id: "custpage_shipdate",
                    type: serverWidget.FieldType.TEXT,
                    label: "shipdate",
                    container : 'fieldgroupid1'
                });
                
                shipdate.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                shipdate.defaultValue = shipdateso;

                */
                // Finished Goods Field
                
                let finishedgoods = form.addField({
                    id: "custpage_finishedgoods",
                    type: serverWidget.FieldType.TEXT,
                    label: "Finished Goods",
                    container : 'fieldgroupid2'
                });
                
                finishedgoods.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                finishedgoods.defaultValue = finishedgoodsso;

                // Finished Goods Field
                
                let finishedqty = form.addField({
                    id: "custpage_finishedqty",
                    type: serverWidget.FieldType.TEXT,
                    label: "Finished Quantity",
                    container : 'fieldgroupid2'
                });
                
                finishedqty.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                finishedqty.defaultValue = finishedqtyso;
    
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
                    id: "custrecordml_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'item'
                });
                sublistpm.addField({
                    id: "custrecordml_itemdesc",
                    type: serverWidget.FieldType.TEXT,
                    label:'Description'
                });

                sublistpm.addField({
                    id: "custrecordml_binlocation",
                    type: serverWidget.FieldType.TEXT,
                    label:'Bin Location'
                });

                sublistpm.addField({
                    id: "custrecordml_qty",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Qty'
                });
                sublistpm.addField({
                    id: "custrecordml_binlocationqty",
                    type: serverWidget.FieldType.TEXT,
                    label: wipbinso
                });
                sublistpm.addField({
                    id: "custrecordml_qtyneede",
                    type: serverWidget.FieldType.TEXT,
                    label: "Qty Needed"
                });

               
    
             
                sublistpm.addField({
                    id: 'custrecordml_selected',
                    label: 'Selected',
                    type: serverWidget.FieldType.CHECKBOX
                });
    
                // loop through each line, skipping the header
                var resultspt= findCases1(WOID,locationso);
                var counter = 0;
                resultspt.forEach(function(result1) {


                    sublistpm.setSublistValue({
                        id: 'custrecordml_item',
                        line: counter,
                        value: result1.item
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_itemdesc',
                        line: counter,
                        value: result1.itemdesc
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_binlocation',
                        line: counter,
                        value: result1.binlocation
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_qtyneede',
                        line: counter,
                        value: result1.qtyneeded
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_binlocationqty',
                        line: counter,
                        value: result1.binlocationqty
                    });

                    sublistpm.setSublistValue({
                        id: 'custrecordml_qty',
                        line: counter,
                        value: result1.qty 
                    });

                    sublistpm.setSublistValue({
                        id: 'custrecordml_selected',
                        line: counter,
                        value: "T" 
                        
                    });
                    
                   
                    counter++;
                
				})

                
                // New Subtag or SubList

                var sublistbo = form.addSublist({
                    id: 'custpage_recordsbo',
                    type : serverWidget.SublistType.LIST,
                    label: 'Back Order',
        
                });
				

                sublistbo.addField({
                    id: "custrecordbo_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'item'
                });
                sublistbo.addField({
                    id: "custrecordbo_itemdesc",
                    type: serverWidget.FieldType.TEXT,
                    label:'Description'
                });


                sublistbo.addField({
                    id: "custrecordbo_qty",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Qty'
                });
               
               
    
                // loop through each line, skipping the header
                
                var counter = 0;
                pagedatasbo.forEach(function(result1) {


                    sublistbo.setSublistValue({
                        id: 'custrecordbo_item',
                        line: counter,
                        value: result1.item
                        
                    });
                    sublistbo.setSublistValue({
                        id: 'custrecordbo_itemdesc',
                        line: counter,
                        value: result1.itemdesc
                        
                    });
                   
                    sublistbo.setSublistValue({
                        id: 'custrecordbo_qty',
                        line: counter,
                        value: result1.qty 
                    });

                   
                    
                   
                    counter++;
                
				})


                context.response.writePage(form);
            } else {
              
            
            }
    }
	function findCases1(WO_INTERNAL_ID,workOrderLocation) {
		var pagedatas=[];

        let workOrderLines = "";
        let line = 1;
        let lineItemIds = [];
        let lineNumbers = {};
        var j=0;
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
                },
                search.createColumn({
                   name: "formulanumeric",
                   formula: "CASE WHEN ({item.quantityavailable} is null AND {quantitycommitted} is null) THEN {quantity} ELSE CASE WHEN {item.quantityavailable}<{quantity}-{quantitycommitted} THEN {item.quantityavailable}-{quantity}+{quantitycommitted}  ELSE 0 END END",
                   label: "BackOrder"
                })
            ]
        }).run().each(function (result) {
            lineItemIds.push(result.getValue({
                name: "internalid",
                join: "item"
            }));

            lineNumbers[result.getText({name: "item"})] = {
                "line":line,
                "qty":result.getValue({name: "quantity"}),
                "qtyc":result.getValue({name: "quantitycommitted"}),
                "qtybo":result.getValue({name: "formulanumeric"}),
                "itemdesc":result.getValue({name: "purchasedescription", join: "item"})
            };
            if (result.getValue({name: "formulanumeric"})>0) 
            {
            pagedatasbo[j] = {
                "lineNumber": line,
                "item": result.getText({name: "item"}),
                "itemdesc": result.getValue({name: "purchasedescription", join: "item"}),
                "binlocation": " ",
                "qty": result.getValue({name: "quantity"}),
                "binlocationqty": 0,
                "qtyneeded": 0,
                "onhand": 0,
                "memo": "memo"
                }
                j++;
            }

            i++;

            line += 1;

            return true;
        })

        lineItemIds = _.uniq(lineItemIds);
        log.audit("lineItemIds " , lineItemIds);
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
            result.binlocationqty=0;

            if (result.binlocationqty>result.qty) {result.qtyneeded=0;}
            else {result.qtyneeded=result.qty-result.binlocationqty;}

            pagedatas[i] = {
                "lineNumber": result.lineNumber,
                "item": result.item,
                "itemdesc": lineNumbers[result.item].itemdesc,
                "binlocation": result.binnumber,
                "qty": result.qty,
                "binlocationqty": result.binlocationqty,
                "qtyneeded": result.qtyneeded,
                "onhand": result.onhand,
                "memo": "memo"
                }

            i++;

        }

	

		return pagedatas;
	}
    return {
        onRequest: onRequest
    };
});