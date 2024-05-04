/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(['N/file','N/redirect',"N/runtime","N/ui/serverWidget", "N/record", "N/search", "N/file", "N/error",'N/log', "/SuiteScripts/Modules/generaltoolsv1.js"],
	/**
	 *
	 * @param serverWidget
	 * @param search
	 * @param file
	 * @param error
	 * @param base
	 * @param _
	 */
	function (file, redirect, runtime,serverWidget,record, search, file, error,log, GENERALTOOLS) {
		/**
		 *
		 * @param context
		 */
        var customersselected;
        var sectionsselected;
        function onRequest(context) {

            var userObj = runtime.getCurrentUser();
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
            customersselected=paramemp.data.getValue({fieldId: "custentity_customerssalected"});
            sectionsselected=paramemp.data.getValue({fieldId: "custentity_sectionsselected"});
            vendorsselected=paramemp.data.getValue({fieldId: "custentity_vendorsselected"});

		    // var userID = userObj.id;
		    // var userPermission = userObj.getPermission({	name : 'TRAN_BUILD'	});
		    // autAB= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;

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
                form.addButton({
                    id: 'custpage_refresh',
                    label: 'Refresh records',
                    functionName: "refresh("+userObj.id+")"
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
                
    
    
                var sublistpm = form.addSublist({
                    id: 'custpage_records',
                    type : serverWidget.SublistType.LIST,
                    label: 'Demand Records',
        
                });
                var resultspt= findCases1();
               
                var plantext="";
                var isfirsttime=true;
                var header = "";
                var contenido = "";
                for (let x in resultspt) {
                
                    for (let y in resultspt[x]) {
                        if (isfirsttime) {
                            header+='"'+y+'",';  
                           
                        }
                        contenido+='"'+resultspt[x][y]+'",'; 
                        
                    }
                    contenido+='\n'; 
                    isfirsttime=false;
                 }
                 plantext=header+'\n'+contenido;
                 
                var vendor = form.addField({
                    id: "custpage_vendors",
                    type: serverWidget.FieldType.MULTISELECT,
                    label: "Vendors",
                    source: "Vendor"
                    });

                    vendor.defaultValue = vendorsselected;

                 
                 var customer = form.addField({
                    id: "custpage_customers",
                    type: serverWidget.FieldType.MULTISELECT,
                    label: "Customers",
                    source: "Customer"
                    });

                customer.defaultValue = customersselected;

                    customer.updateBreakType({
                        breakType : serverWidget.FieldBreakType.STARTCOL
                    });
                    

                var sections = form.addField({
                    id: "custpage_section",
                    type: serverWidget.FieldType.TEXT,
                    label: "Sections",
                    source: "customrecord_section"
                    });

                sections.defaultValue = sectionsselected;

				sublistpm.addButton({
                    id: 'custpage_processtag',
                    label: 'Generate POs',
                    functionName: "process1('custpage_records')"
                });

                sublistpm.addButton({
                    id : 'custpage_buttonexcel', //always prefix with 'custpage_'
                    label : 'Export CSV', //label of the button
                    functionName: 'onButtonClick("'+encodeURI(plantext)+'")'
                });
                sublistpm.addButton({
                    id: 'custpage_markmark',
                    label: 'Mark all',
                    functionName: "markall()"
                });
                sublistpm.addButton({
                    id: 'custpage_unmarkmark',
                    label: 'Unmark all',
                    functionName: "unmarkall()"
                });

                sublistpm.addField({
                    id: "custrecordml_productionline",
                    type: serverWidget.FieldType.TEXT,
                    label:'Production Line'
                });
                sublistpm.addField({
                    id: "custrecordml_task",
                    type: serverWidget.FieldType.TEXT,
                    label:'Task Schedule'
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
                    id: "custrecordml_qtyt",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Quantity Total'
                });
                sublistpm.addField({
                    id: "custrecordml_qtya",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Available Quantity'
                });
                sublistpm.addField({
                    id: "custrecordml_qtypo",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Quantity on Purchase Order'
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
               
                
               
    
                // loop through each line, skipping the header
                
                var counter = 0;
                resultspt.forEach(function(result1) {

                    //if ((result1.qty-result1.qtya)>0) 
                    if ((result1.qty)>0)
                    {

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
                        id: 'custrecordml_task',
                        line: counter,
                        value: result1.task
                        
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
                        id: 'custrecordml_qtyt',
                        line: counter,
                        value: result1.qty
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_qtya',
                        line: counter,
                        value: result1.qtya
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_qtypo',
                        line: counter,
                        value: result1.qtypo
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_qty',
                        line: counter,
                        value: (result1.qty)
                      //  value: (result1.qty-result1.qtya-result1.qtypo)
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_total',
                        line: counter,
                        value: result1.total.toFixed(2)
                    });
                    
                    if (!result1.currency) {
                        dcurrency="US Dollar";}
                    else {dcurrency=result1.currency;}
                    
                    sublistpm.setSublistValue({
                        id: 'custrecordml_currency',
                        line: counter,
                        value: dcurrency
                    });
                    
                    sublistpm.setSublistValue({
                        id: 'custrecordml_currencyrate',
                        line: counter,
                        value: resultscurr[dcurrency].exchangerate
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_totalusd',
                        line: counter,
                        value: (result1.total/resultscurr[dcurrency].exchangerate).toFixed(2)
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_memo',
                        line: counter,
                        value: result1.memo.substring(0, 298)
                    });
                   
                    counter++;
                }
                
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
                    id: "custrecordml_task",
                    type: serverWidget.FieldType.TEXT,
                    label:'Task Schedule'
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
                        id: 'custrecordml_task',
                        line: counter,
                        value: result1.task
                        
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
                        value: result1.memo.substring(0, 298)
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
            ["formulatext: CASE WHEN  {quantity}-NVL({quantitycommitted}, 0)>0  THEN 'YES'  ELSE 'NO' END","contains","YES"], 
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
            name: "custbody2",
            summary: "MAX"
            }),
            search.createColumn({
            name: "custbody_section",
            summary: "MAX"
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
                formula: "CASE WHEN {item.vendor}= {item.othervendor}THEN {item.vendorpricecurrency} ELSE '' END"
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
             }),
             search.createColumn({
                name: "quantityonorder",
                join: "item",
                summary: "MAX"
             })
            ]
        });
        
        
        if (customersselected.length>0) {
            log.debug("customersselected",customersselected);
            fsearch.filters.push(search.createFilter({
                name: "name",
                operator: "anyof",
                values: customersselected
            }));
        }
        if (vendorsselected.length>0) {
            log.debug("vendorsselected",vendorsselected);
            fsearch.filters.push(search.createFilter({
                name: "othervendor",
                join: "item",
                operator: "anyof",
                values: vendorsselected
            }));
        }
        if (sectionsselected.length>0) {
            fsearch.filters.push(search.createFilter({
                name: "custbody_section",
                operator: "startswith",
                values: [sectionsselected]
            }));
        }

		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});



		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});
            var prod="";
            var sectiont="";
            var isfirsttime=true;
            var qtytot=0;
            var qtytota=0;
            var memo="";
            var section;

			page.data.forEach(function (fresult) {

                if (isfirsttime) 
                {
                    
                    sectiont=fresult.getValue({name: "custbody_section",summary: "MAX"});
                    prod=fresult.getText({name: "item",summary: "GROUP"});
                    isfirsttime=false;
                }
                
                if (prod!=fresult.getText({name: "item",summary: "GROUP"}) || sectiont!=fresult.getValue({name: "custbody_section",summary: "MAX"}))
                {  
                    prod=fresult.getText({name: "item",summary: "GROUP"});
                    sectiont=fresult.getValue({name: "custbody_section",summary: "MAX"});
                    
				    pagedatas[i] = {
					"section": section,
                    "task": task,
                    "productionline": productionline,
                    "preferredvendor": preferredvendor,
                    "preferredvendorid": preferredvendorid,
					"item": item,
                    "itemid": itemid,
					"price": price,
                    "currency": currency,
					"qty": qtytot,
                    "qtya": qtytota,
                    "qtypo": qtytotpo,
                    "total": (qtytot) * price,
                    //"total": (qtytot-qtytota) * price,
                    "memo": memo
				    }
                    qtytot=0;
                    qtytota=0;
                    memo="";
                    
    				i++;
                }

            productionline=fresult.getText({name: "custbody_productionline",summary: "GROUP"});
            if (fresult.getValue({name: "custbody_section",summary: "MAX"})) {section=fresult.getValue({name: "custbody_section",summary: "MAX"});}
            else {section=" ";}
            if (fresult.getValue({name: "custbody2",summary: "MAX"})) {task=fresult.getValue({name: "custbody2",summary: "MAX"});}
            else {task=" ";}
            
            preferredvendor=fresult.getText({name: "vendor",join: "item",summary: "GROUP"});
            preferredvendorid=fresult.getValue({name: "vendor",join: "item",summary: "GROUP"});
            item=fresult.getText({name: "item",summary: "GROUP"});
            itemid=fresult.getValue({name: "item",summary: "GROUP"});
            price=fresult.getValue({name: "formulacurrency",summary: "MAX"});
            currency=fresult.getValue({name: "formulatext",summary: "MAX"});
            
            qtytot+=Number(fresult.getValue({name: "formulanumeric",summary: "SUM"}));
            qtytota=Number(fresult.getValue({name: "quantityavailable",join: "item",summary: "MAX"}));
            qtytotpo=Number(fresult.getValue({name: "quantityonorder",join: "item",summary: "MAX"}));
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
            ["formulatext: CASE WHEN  {quantity}-NVL({quantitycommitted}, 0)>0  THEN 'YES'  ELSE 'NO' END","contains","YES"], 
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
            name: "custbody2",
            summary: "MAX"
            }),
            search.createColumn({
            name: "custbody_section",
            summary: "MAX"
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
             }),
             search.createColumn({
                name: "quantityonorder",
                join: "item",
                summary: "MAX"
             })
        ]
        });

        if (customersselected.length>0) {
            fsearch.filters.push(search.createFilter({
                name: "name",
                operator: "anyof",
                values: customersselected
            }));
        }
        if (vendorsselected.length>0) {
            log.debug("vendorsselected",vendorsselected);
            fsearch.filters.push(search.createFilter({
                name: "othervendor",
                join: "item",
                operator: "anyof",
                values: vendorsselected
            }));
        }
        if (sectionsselected.length>0) {
            fsearch.filters.push(search.createFilter({
                name: "custbody_section",
                operator: "startswith",
                values: [sectionsselected]
            }));
        }

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
                    "task": task,
                    "productionline": productionline,
                    "preferredvendor": preferredvendor,
                    "preferredvendorid": preferredvendorid,
					"item": item,
                    "itemid": itemid,
					"price": price,
					"qty": qtytot,
                    "qtypo": qtytotpo,
                    "memo": memo
				    }
                    qtytot=0;
                    memo="";
                    
    				i++;
                }

            productionline=fresult.getText({name: "custbody_productionline",summary: "GROUP"});
            if (fresult.getValue({name: "custbody_section",summary: "MAX"})) {section=fresult.getValue({name: "custbody_section",summary: "MAX"});}
            else {section=" ";}
            if (fresult.getValue({name: "custbody2",summary: "MAX"})) {task=fresult.getValue({name: "custbody2",summary: "MAX"});}
            else {task=" ";}
            preferredvendor=fresult.getText({name: "vendor",join: "item",summary: "GROUP"});
            preferredvendorid=fresult.getValue({name: "vendor",join: "item",summary: "GROUP"});
            item=fresult.getText({name: "item",summary: "GROUP"});
            itemid=fresult.getValue({name: "item",summary: "GROUP"});
            price=fresult.getValue({name: "formulacurrency",summary: "MAX"});
            qtytot+=Number(fresult.getValue({name: "formulanumeric",summary: "SUM"}));
            qtytotpo=Number(fresult.getValue({name: "quantityonorder",join: "item",summary: "MAX"}));
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