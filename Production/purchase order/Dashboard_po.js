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
                let memo = form.addField({
                    id: "custpage_memo",
                    label: "MEMO",
                    type: serverWidget.FieldType.TEXT,
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
                    id: "custrecordml_productionline",
                    type: serverWidget.FieldType.TEXT,
                    label:'Production Line'
                });
                var sectionidc =sublistpm.addField({
                    id: "custrecordml_sectionid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Sectionid'
                });
                sectionidc.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                sublistpm.addField({
                    id: "custrecordml_section",
                    type: serverWidget.FieldType.TEXT,
                    label:'Section'
                });
                sublistpm.addField({
                    id: "custrecordml_preferredvendor",
                    type: serverWidget.FieldType.TEXT,
                    label:'Preferred Vendor'
                });

                var vendorid = sublistpm.addField({
                    id: "custrecordml_preferredvendorid",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Preferred Vendor ID'
                });
                vendorid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
    
                sublistpm.addField({
                    id: "custrecordml_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'Item'
                });
                var itemid = sublistpm.addField({
                    id: "custrecordml_itemid",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Item ID'
                });

                itemid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
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
                    id: "custrecordml_currency",
                    type: serverWidget.FieldType.TEXT,
                    label:'Currency Vendor'
                });
                sublistpm.addField({
                    id: "custrecordml_total",
                    type: serverWidget.FieldType.FLOAT,
                    label:'Total'
                });
                sublistpm.addField({
                    id: "custrecordml_currencyrate",
                    type: serverWidget.FieldType.FLOAT,
                    label:'Exchange Rate'
                });
                sublistpm.addField({
                    id: "custrecordml_totalusd",
                    type: serverWidget.FieldType.FLOAT,
                    label:'Total USD'
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

                var resultscurr= currencies();
                log.debug("resultscurr",resultscurr);
                
               
    
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
                        id: 'custrecordml_sectionid',
                        line: counter,
                        value: 0
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_section',
                        line: counter,
                        value: result1.section
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_productionline',
                        line: counter,
                        value: result1.productionline
                        
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
                        id: 'custrecordml_total',
                        line: counter,
                        value: result1.total.toFixed(2)
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_currency',
                        line: counter,
                        value: result1.currency
                    });
                    
                    sublistpm.setSublistValue({
                        id: 'custrecordml_currencyrate',
                        line: counter,
                        value: resultscurr[result1.currency].exchangerate
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_totalusd',
                        line: counter,
                        value: (result1.total/resultscurr[result1.currency].exchangerate).toFixed(2)
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_memo',
                        line: counter,
                        value: result1.memo
                    });
                   
                    counter++;
                
				})

                
                var sublister = form.addSublist({
                    id: 'custpagee_records',
                    type : serverWidget.SublistType.LIST,
                    label: 'Vendor Error Records',
        
                });
				
                sublister.addField({
                    id: "custrecordml_productionline",
                    type: serverWidget.FieldType.TEXT,
                    label:'Production Line'
                });

                sublister.addField({
                    id: "custrecordml_section",
                    type: serverWidget.FieldType.TEXT,
                    label:'Section'
                });
                sublister.addField({
                    id: "custrecordml_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'Item'
                });
                var itemiderr = sublister.addField({
                    id: "custrecordml_itemid",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Item ID'
                });
                itemiderr.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                sublister.addField({
                    id: "custrecordml_qty",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Quantity'
                });
                
                sublister.addField({
                    id: "custrecordml_memo",
                    type: serverWidget.FieldType.TEXT,
                    label:'Project'
                });
               
    
                // loop through each line, skipping the header
                var resultspt= findCases2();
                var counter = 0;
                resultspt.forEach(function(result1) {

    
                    sublister.setSublistValue({
                        id: 'custrecordml_section',
                        line: counter,
                        value: result1.section
                        
                    });
                    sublister.setSublistValue({
                        id: 'custrecordml_productionline',
                        line: counter,
                        value: result1.productionline
                        
                    });
                    sublister.setSublistValue({
                        id: 'custrecordml_item',
                        line: counter,
                        value: result1.item
                    });
                    sublister.setSublistValue({
                        id: 'custrecordml_itemid',
                        line: counter,
                        value: result1.itemid
                    });
                   
                    sublister.setSublistValue({
                        id: 'custrecordml_qty',
                        line: counter,
                        value: result1.qty
                    });
                    sublister.setSublistValue({
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
            ["status","anyof","WorkOrd:B","WorkOrd:D"],
            "AND", 
            ["item.vendor","noneof","@NONE@"]
        ],
        columns:
        [   
            search.createColumn({
            name: "custbody_productionline",
            summary: "GROUP"
            }),
            search.createColumn({
            name: "custbody_section",
            summary: "GROUP"
            }),
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
                name: "formulatext",
                summary: "MAX",
                formula: "CASE WHEN {item.vendor}= {item.othervendor}THEN {item.vendorpricecurrency} ELSE ' ' END"
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
					"section": section,
                    "productionline": productionline,
                    "preferredvendor": preferredvendor,
                    "preferredvendorid": preferredvendorid,
					"item": item,
                    "itemid": itemid,
					"price": price,
                    "currency": currency,
					"qty": qtytot,
                    "total": qtytot * price,
                    "memo": memo
				    }
                    qtytot=0;
                    memo="";
                    
    				i++;
                }

            productionline=fresult.getText({name: "custbody_productionline",summary: "GROUP"});
            section=fresult.getValue({name: "custbody_section",summary: "GROUP"});
            preferredvendor=fresult.getText({name: "vendor",join: "item",summary: "GROUP"});
            preferredvendorid=fresult.getValue({name: "vendor",join: "item",summary: "GROUP"});
            item=fresult.getText({name: "item",summary: "GROUP"});
            itemid=fresult.getValue({name: "item",summary: "GROUP"});
            price=fresult.getValue({name: "formulacurrency",summary: "MAX"});
            currency=fresult.getValue({name: "formulatext",summary: "MAX"});
            qtytot+=Number(fresult.getValue({name: "formulanumeric",summary: "SUM"}));
            memo+=fresult.getValue({name: "altname",join: "customerMain",summary: "GROUP"})+"; ";
			})
		});

		return pagedatas;
	}

    function findCases2() {
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
            ["status","anyof","WorkOrd:B","WorkOrd:D"],
            "AND", 
            ["item.vendor","anyof","@NONE@"]
        ],
        columns:
        [   
            search.createColumn({
            name: "custbody_productionline",
            summary: "GROUP"
            }),
            search.createColumn({
            name: "custbody_section",
            summary: "GROUP"
            }),
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
                formula: "CASE WHEN {item.vendor}= {item.othervendor}THEN {quantity} ELSE {quantity} END"
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
					"section": section,
                    "productionline": productionline,
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

            productionline=fresult.getText({name: "custbody_productionline",summary: "GROUP"});
            section=fresult.getValue({name: "custbody_section",summary: "GROUP"});
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
            ["status","anyof","WorkOrd:B","WorkOrd:D"],
            "AND", 
            ["item.vendor","noneof","@NONE@"]
        ],
        columns:
        [   
            search.createColumn({
            name: "custbody_productionline",
            summary: "GROUP"
            }),
            search.createColumn({
            name: "custbody_section",
            summary: "GROUP"
            }),
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
                name: "formulatext",
                summary: "MAX",
                formula: "CASE WHEN {item.vendor}= {item.othervendor}THEN {item.vendorpricecurrency} ELSE ' ' END"
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
					"section": section,
                    "productionline": productionline,
                    "preferredvendor": preferredvendor,
                    "preferredvendorid": preferredvendorid,
					"item": item,
                    "itemid": itemid,
					"price": price,
                    "currency": currency,
					"qty": qtytot,
                    "total": qtytot * price,
                    "memo": memo
				    }
                    qtytot=0;
                    memo="";
                    
    				i++;
                }

            productionline=fresult.getText({name: "custbody_productionline",summary: "GROUP"});
            section=fresult.getValue({name: "custbody_section",summary: "GROUP"});
            preferredvendor=fresult.getText({name: "vendor",join: "item",summary: "GROUP"});
            preferredvendorid=fresult.getValue({name: "vendor",join: "item",summary: "GROUP"});
            item=fresult.getText({name: "item",summary: "GROUP"});
            itemid=fresult.getValue({name: "item",summary: "GROUP"});
            price=fresult.getValue({name: "formulacurrency",summary: "MAX"});
            currency=fresult.getValue({name: "formulatext",summary: "MAX"});
            qtytot+=Number(fresult.getValue({name: "formulanumeric",summary: "SUM"}));
            memo+=fresult.getValue({name: "altname",join: "customerMain",summary: "GROUP"})+"; ";
			})
		});

		return pagedatas;
	}

    function currencies() {
		var pagedatascurr=[];

		var fsearch = search.create({
			type: "currency",
       
        columns:
        [   
            "name",
            "symbol",
            "internalid",
            "exchangerate"

        ]
                });

		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});


		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});
            

			page.data.forEach(function (fresult) {

				    pagedatascurr[fresult.getValue({name: "name"})] = {
                    "name": fresult.getValue({name: "name"}),
                    "symbol": fresult.getValue({name: "symbol"}),
                    "internalid": fresult.getValue({name: "internalid"}),
                    "exchangerate": fresult.getValue({name: "exchangerate"})  
				    }    

			})
		});

		return pagedatascurr;
	}


    return {
        onRequest: onRequest
    };
});