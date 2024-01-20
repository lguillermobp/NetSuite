/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(['N/file','N/redirect',"N/runtime","N/ui/serverWidget", "N/record", "N/search", "N/file", "N/error",'N/log'],
	/**
	 *
	 * @param serverWidget
	 * @param search
	 * @param file
	 * @param error
	 * @param base
	 * @param _
	 */
	function (file, redirect, runtime,serverWidget,record, search, file, error,log) {
		/**
		 *
		 * @param context
		 */
        function onRequest(context) {

            if (context.request.method === 'GET') {
        
                let form = serverWidget.createForm({
                    title: `Purchase Order Generating Tool`
                });
                form.clientScriptModulePath = '/SuiteScripts/purchase order/DashboardClient_po.js';

                form.addButton({
                    id: 'custpage_process',
                    label: 'Generate POs',
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
                    label: 'Demand Records',
        
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
                    label:'memo'
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

		var fsearch = search.create({
			type: "workorder",
        filters:
        [
            ["formulatext: CASE WHEN ({item.quantityavailable} is null AND {quantitycommitted} is null) THEN 'YES' ELSE CASE WHEN {item.quantityavailable}<{quantity}-{quantitycommitted} THEN 'YES'  ELSE 'NO' END END","contains","YES"], 
            "AND", 
            ["type","anyof","WorkOrd"], 
            "AND", 
            ["mainline","is","F"], 
            "AND", 
            ["status","noneof","WorkOrd:H","WorkOrd:C","WorkOrd:G"], 
            "AND", 
            ["item.vendor","noneof","@NONE@"]
        ],
        columns:
        [
            search.createColumn({
                name: "vendor",
                join: "item",
                summary: "GROUP",
                sort: search.Sort.ASC
            }),
            search.createColumn({
                name: "item",
                summary: "GROUP",
                sort: search.Sort.ASC
            }),
            search.createColumn({
                name: "formulanumeric",
                summary: "SUM",
                formula: "CASE WHEN {item.vendor}= {item.othervendor}THEN {quantity} ELSE 0 END"
            }),
            search.createColumn({
                name: "formulacurrency",
                summary: "MAX",
                formula: "CASE WHEN {item.vendor}= {item.othervendor}THEN {item.vendorcost} ELSE 0 END"
            }),
            search.createColumn({
                name: "quantityavailable",
                join: "item",
                summary: "MAX"
            }),
            search.createColumn({
                name: "quantityonhand",
                join: "item",
                summary: "MAX"
            }),
            search.createColumn({
                name: "altname",
                join: "customerMain",
                summary: "GROUP"
             })
        ]
                });

		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});



		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});
            var prod="";
            var isfirsttime=true;
            var qtytot=0;
            var memo="";

			page.data.forEach(function (fresult) {

                if (isfirsttime) {prod=fresult.getText({name: "item",summary: "GROUP"});isfirsttime=false}
                
                if (prod!=fresult.getText({name: "item",summary: "GROUP"}))
                {  
                    prod=fresult.getText({name: "item",summary: "GROUP"});

				    pagedatas[i] = {
					"preferredvendor": preferredvendor,
                    "preferredvendorid": preferredvendorid,
					"item": item,
                    "itemid": itemid,
					"price": price,
					"qty": qtytot,
                    "memo": memo
				    }
                    qtytot=0;
                    memo="";
                    
    				i++;
                }
            preferredvendor=fresult.getText({name: "vendor",join: "item",summary: "GROUP"});
            preferredvendorid=fresult.getValue({name: "vendor",join: "item",summary: "GROUP"});
            item=fresult.getText({name: "item",summary: "GROUP"});
            itemid=fresult.getValue({name: "item",summary: "GROUP"});
            price=fresult.getValue({name: "formulacurrency",summary: "MAX"});
            qtytot+=Number(fresult.getValue({name: "formulanumeric",summary: "SUM"}));
            memo+=fresult.getValue({name: "altname",join: "customerMain",summary: "GROUP"})+"; ";
			})
		});

		return pagedatas;
	}
    return {
        onRequest: onRequest
    };
});