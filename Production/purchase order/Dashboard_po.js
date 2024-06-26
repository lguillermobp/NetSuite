/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(['N/file','N/redirect',"N/runtime","N/ui/serverWidget", "N/record", "N/search", "N/file", "N/error",'N/log', "/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/Modules/LoDash.js"],
	/**
	 *
	 * @param serverWidget
	 * @param search
	 * @param file
	 * @param error
	 * @param base
	 * @param _
	 */
	function (file, redirect, runtime,serverWidget,record, search, file, error,log, GENERALTOOLS,  _) {
		/**
		 *
		 * @param context
		 */
        var customersselected;
        var sectionsselected;
        var summarypos=[];
        var vendorsid=[];
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
                    title: `PPD Generating Tool`
                });
                form.clientScriptModulePath = '/SuiteScripts/purchase order/DashboardClient_po.js';

                form.addButton({
                    id: 'custpage_process',
                    label: 'Generate PPD Records',
                    functionName: "processppd()"
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
                vendorsss();
               
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
                    label: 'Generate PPD Records',
                    functionName: "process()"
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
                var ppdpod = sublistpm.addField({
                    id: "custrecordml_ppdpo",
                    type: serverWidget.FieldType.TEXT,
                    label:'PPDPO'
                });

                ppdpod.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                sublistpm.addField({
                    id: "custrecordml_productionline",
                    type: serverWidget.FieldType.TEXT,
                    label:'Production Line'
                });
                var taskid =sublistpm.addField({
                    id: "custrecordml_taskid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Task Schedule'
                });
                taskid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                sublistpm.addField({
                    id: "custrecordml_task",
                    type: serverWidget.FieldType.TEXT,
                    label:'Task Schedule'
                });
                sublistpm.addField({
                    id: "custrecordml_taskds",
                    type: serverWidget.FieldType.TEXT,
                    label:'Start Date'
                });
                sublistpm.addField({
                    id: "custrecordml_taskde",
                    type: serverWidget.FieldType.TEXT,
                    label:'End Date'
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
                sublistpm.addField({
                    id: "custrecordml_leadtime",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Lead Time'
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
                var icurr= sublistpm.addField({
                    id: "custrecordml_icurrency",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Currency Internalid'
                });
                icurr.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
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
                var customerid = sublistpm.addField({
                    id: "custrecordml_customer",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Customer ID'
                });

                customerid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
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

                    

                    sublistpm.setSublistValue({
                        id: 'custrecordml_preferredvendor',
                        line: counter,
                        value: result1.preferredvendor
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_ppdpo',
                        line: counter,
                        value: result1.ppdpo
                        
                    });

                    if (!vendorsid[result1.preferredvendorid]) {qtylead="0"}
                    else {qtylead=vendorsid[result1.preferredvendorid].leadtime}

                    log.debug("result1.leadtime",result1.leadtime);
                    sublistpm.setSublistValue({
                        id: 'custrecordml_leadtime',
                        line: counter,
                        value: qtylead
                        
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
                        value: result1.taskd
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_taskid',
                        line: counter,
                        value: result1.task
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_taskds',
                        line: counter,
                        value: result1.taskds
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_taskde',
                        line: counter,
                        value: result1.taskde
                        
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

                    if (!result1.currency) {
                        icurrency=1}
                    else {icurrency=resultscurr[dcurrency].internalid;}
                    
                    sublistpm.setSublistValue({
                        id: 'custrecordml_currency',
                        line: counter,
                        value: dcurrency
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_icurrency',
                        line: counter,
                        value: icurrency
                    });
                    
                    sublistpm.setSublistValue({
                        id: 'custrecordml_currencyrate',
                        line: counter,
                        value: resultscurr[dcurrency].exchangerate
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_totalusd',
                        line: counter,
                        value: (result1.total*resultscurr[dcurrency].exchangerate).toFixed(2)
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_customer',
                        line: counter,
                        value: result1.customer
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_memo',
                        line: counter,
                        value: result1.memo.substring(0, 298)
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

               

                //======================================================================================================

                    var sublistppd = form.addSublist({
                    id: 'custpageppd_records',
                    type : serverWidget.SublistType.LIST,
                    label: 'PPD',
                    });
                    sublistppd.addField({
                        id: "custrecordml_productionline",
                        type: serverWidget.FieldType.TEXT,
                        label:'Production Line'
                    });
                    var ppdpod = sublistppd.addField({
                        id: "custrecordml_ppdpo",
                        type: serverWidget.FieldType.TEXT,
                        label:'PPDPO'
                    });
    
                    ppdpod.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.HIDDEN
                    });
                    
                    var tastidd= sublistppd.addField({
                        id: "custrecordml_task",
                        type: serverWidget.FieldType.TEXT,
                        label:'task'
                    });
                    tastidd.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.HIDDEN
                    });
                    sublistppd.addField({
                        id: "custrecordml_taskd",
                        type: serverWidget.FieldType.TEXT,
                        label:'task'
                    });
                    sublistppd.addField({
                        id: "custrecordml_taskds",
                        type: serverWidget.FieldType.TEXT,
                        label:'Start Date'
                    });
                    sublistppd.addField({
                        id: "custrecordml_preferredvendor",
                        type: serverWidget.FieldType.TEXT,
                        label:'Preferred Vendor'
                    });
                    var vendorid = sublistppd.addField({
                        id: "custrecordml_preferredvendorid",
                        type: serverWidget.FieldType.INTEGER,
                        label:'Preferred Vendor ID'
                    });
                    vendorid.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.HIDDEN
                    });
        
                   
                    sublistppd.addField({
                        id: "custrecordml_currency",
                        type: serverWidget.FieldType.TEXT,
                        label:'Currency Vendor'
                    });
                    sublistppd.addField({
                        id: "custrecordml_leadtime",
                        type: serverWidget.FieldType.INTEGER,
                        label:'Lead Time'
                    });
                    sublistppd.addField({
                        id: "custrecordml_total",
                        type: serverWidget.FieldType.FLOAT,
                        label:'Total'
                    });
                    sublistppd.addField({
                        id: "custrecordml_currencyrate",
                        type: serverWidget.FieldType.FLOAT,
                        label:'Exchange Rate'
                    });
                    sublistppd.addField({
                        id: "custrecordml_totalusd",
                        type: serverWidget.FieldType.FLOAT,
                        label:'Total USD'
                    });
                    sublistppd.addField({
                        id: "custrecordml_memo",
                        type: serverWidget.FieldType.TEXT,
                        label:'Project'
                    });
                    sublistppd.addField({
                        id: 'custrecordml_omit',
                        label: 'Omit',
                        type: serverWidget.FieldType.CHECKBOX
                    });
    
        
                    // loop through each line, skipping the header
                    
                    var counter = 0;

                    log.audit("summarypos",summarypos.length);
                    summarypos.forEach(function(result1) {
    
                        
                        sublistppd.setSublistValue({
                            id: 'custrecordml_ppdpo',
                            line: counter,
                            value: result1.ppdpo
                            
                        });
                        sublistppd.setSublistValue({
                            id: 'custrecordml_preferredvendor',
                            line: counter,
                            value: result1.preferredvendor+" "
                        });
                        sublistppd.setSublistValue({
                            id: 'custrecordml_taskds',
                            line: counter,
                            value: result1.taskds
                            
                        });
                        sublistppd.setSublistValue({
                            id: 'custrecordml_task',
                            line: counter,
                            value: result1.task
                            
                        });
                        if (!vendorsid[result1.preferredvendorid]) {qtylead="0"}
                        else {qtylead=vendorsid[result1.preferredvendorid].leadtime}

                        log.debug("result1.leadtime",result1.leadtime);
                        sublistppd.setSublistValue({
                        id: 'custrecordml_leadtime',
                        line: counter,
                        value: qtylead
                        
                    });
                        sublistppd.setSublistValue({
                            id: 'custrecordml_taskd',
                            line: counter,
                            value: result1.taskd+" "
                            
                        });
                        sublistppd.setSublistValue({
                            id: 'custrecordml_productionline',
                            line: counter,
                            value: result1.productionline+" "
                            
                        });
                        sublistppd.setSublistValue({
                            id: 'custrecordml_preferredvendorid',
                            line: counter,
                            value: result1.preferredvendorid
                            
                        });
                        
                        sublistppd.setSublistValue({
                            id: 'custrecordml_total',
                            line: counter,
                            value: result1.total.toFixed(2)
                        });
                        
                        if (!result1.currency) {
                            dcurrency="US Dollar";}
                        else {dcurrency=result1.currency;}
                        
                        sublistppd.setSublistValue({
                            id: 'custrecordml_currency',
                            line: counter,
                            value: dcurrency
                        });
                        
                        sublistppd.setSublistValue({
                            id: 'custrecordml_currencyrate',
                            line: counter,
                            value: resultscurr[dcurrency].exchangerate
                        });
                        sublistppd.setSublistValue({
                            id: 'custrecordml_totalusd',
                            line: counter,
                            value: (result1.total*resultscurr[dcurrency].exchangerate).toFixed(2)
                        });
                        sublistppd.setSublistValue({
                            id: 'custrecordml_memo',
                            line: counter,
                            value: result1.memo.substring(0, 298)
                        });
                       
                        counter++;
                    
            
                    })



                //======================================================================================================



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
            ["type","anyof","WorkOrd"], 
            "AND", 
            ["mainline","is","F"], 
            "AND", 
            ["status","anyof","WorkOrd:B","WorkOrd:D"], 
             "AND", 
            ["sum(formulanumeric: CASE WHEN {item.vendor}= {item.othervendor}THEN {quantity} ELSE 0 END)","notequalto","0"],
            "AND", 
            ["custbody_tasksc.custrecord_so_sc_task","noneof","@NONE@"]
  
        ],
        columns:
        [   
            search.createColumn({
            name: "custbody_productionline",
            summary: "GROUP"
            }),
            search.createColumn({
               name: "custrecord_so_sc_task",
               join: "CUSTBODY_TASKSC",
               summary: "GROUP",
               label: "Task Schedule"
            }),
            search.createColumn({
                name: "internalid",
                join: "CUSTBODY_TASKSC",
                summary: "GROUP"
             }),
            search.createColumn({
               name: "custrecord_so_sc_startdate",
               join: "CUSTBODY_TASKSC",
               summary: "MAX",
               label: "Start Date"
            }),
            search.createColumn({
               name: "custrecord_so_sc_enddate",
               join: "CUSTBODY_TASKSC",
               summary: "MAX",
               label: "End Date"
            }),
            search.createColumn({
               name: "preferredstockleveldays",
               join: "item",
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
                summary: "MAX",
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
               name: "internalid",
               join: "customerMain",
               summary: "GROUP"
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
             }),
             search.createColumn({
                name: "formulatext",
                summary: "GROUP",
                formula: "{custbody_tasksc.custrecord_so_sc_task}"
             })
            ]
        });
        
        if (customersselected.length==1) {
            customersselected1=customersselected[0];}
            else {customersselected1=customersselected;}

        if (vendorsselected.length==1) {
            vendorsselected1=vendorsselected[0];}
            else {vendorsselected1=vendorsselected;}
       
        if (customersselected.length>0) {
            log.debug("customersselected",customersselected);
            log.debug("customersselected1",customersselected1);
            fsearch.filters.push(search.createFilter({
                name: "name",
                operator: "anyof",
                values: customersselected1
            }));
        }
        if (vendorsselected.length>0) {
            log.debug("vendorsselected",vendorsselected);
            log.debug("vendorsselected1",vendorsselected1);
            fsearch.filters.push(search.createFilter({
                name: "othervendor",
                join: "item",
                operator: "anyof",
                values: vendorsselected1
            }));
        }
        // if (sectionsselected.length>0) {
        //     fsearch.filters.push(search.createFilter({
        //         name: "custbody_section",
        //         operator: "startswith",
        //         values: [sectionsselected]
        //     }));
        // }
       

		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});

        var prod="";
        var sectiont="";
        var isfirsttime=true;
        var qtytot=0;
        var qtytota=0;
        var memo="";
        var section;
        var i=0;
        var h=0;
        var procesar;

		pagedData.pageRanges.forEach(function (pageRange) {
            log.debug("pageRange",pageRange);
			var page = pagedData.fetch({index: pageRange.index});
           


			page.data.forEach(function (fresult) {
                log.debug("fresult",fresult);

                    productionline=fresult.getText({name: "custbody_productionline",summary: "GROUP"});
                    if (fresult.getValue({name: "custbody_section",summary: "GROUP"})) {section=fresult.getValue({name: "custbody_section",summary: "GROUP"});}
                    else {section=" ";}
                    if (fresult.getValue({name: "internalid",join: "CUSTBODY_TASKSC",summary: "GROUP"})) {task=fresult.getValue({name: "internalid",join: "CUSTBODY_TASKSC",summary: "GROUP"});}
                    else {task=" ";}
                    if (fresult.getValue({name: "formulatext",summary: "GROUP"})) {taskd=fresult.getValue({name: "formulatext",summary: "GROUP"});}
                    else {taskd=" ";}
                    if (fresult.getValue({name: "custrecord_so_sc_startdate",join: "CUSTBODY_TASKSC",summary: "MAX"})) {taskds=fresult.getValue({name: "custrecord_so_sc_startdate",join: "CUSTBODY_TASKSC",summary: "MAX"});}
                    else {taskds=" ";}
                    if (fresult.getValue({name: "custrecord_so_sc_enddate",join: "CUSTBODY_TASKSC",summary: "MAX"})) {taskde=fresult.getValue({name: "custrecord_so_sc_enddate",join: "CUSTBODY_TASKSC",summary: "MAX"});}
                    else {taskde=" ";}
                    if (fresult.getValue({name: "preferredstockleveldays",join: "item",summary: "GROUP"})) {leadtime=fresult.getValue({name: "preferredstockleveldays",join: "item",summary: "GROUP"});}
                    else {leadtime=0;}
                
                    procesar="Y";
                    preferredvendor=fresult.getText({name: "vendor",join: "item",summary: "GROUP"});
                    leadtime=Number(fresult.getValue({name: "preferredstockleveldays",join: "item",summary: "GROUP"}))+0;
                    preferredvendorid=fresult.getValue({name: "vendor",join: "item",summary: "GROUP"});
                    item=fresult.getText({name: "item",summary: "GROUP"});
                    itemid=fresult.getValue({name: "item",summary: "GROUP"});
                    price=fresult.getValue({name: "formulacurrency",summary: "MAX"});
                    currency=fresult.getValue({name: "formulatext",summary: "MAX"});
        
        
                    qtytot+=Number(fresult.getValue({name: "formulanumeric",summary: "MAX"}));
                
                    qtytota=Number(fresult.getValue({name: "quantityavailable",join: "item",summary: "MAX"}));
                    qtytotpo=Number(fresult.getValue({name: "quantityonorder",join: "item",summary: "MAX"}));
                    memo=fresult.getValue({name: "altname",join: "customerMain",summary: "GROUP"});
                    memoid=fresult.getValue({name: "internalid",join: "customerMain",summary: "GROUP"});

                    ppdpo="V"+preferredvendorid+"C"+memoid+"S"+task;
              
                    
				    pagedatas[i] = {
                    "ppdpo": ppdpo,
					"section": section,
                    "task": task,
                    "taskd": taskd,
                    "taskds": taskds,
                    "taskde": taskde,
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
                    "leadtime": leadtime,
                    "total": (qtytot) * price,
                    //"total": (qtytot-qtytota) * price,
                    "memo": memo,
                    "customer": memoid
				    }
                    
                    
    				i++;

                    vendorsid[preferredvendorid]=preferredvendor;
                    var index = summarypos.map(function (img) { return img.ppdpo; }).indexOf(ppdpo);
                    log.audit("index",index);
                    if (index==-1)
                        {
                            summarypos[h] ={
                                "ppdpo": ppdpo,
                                "task": task,
                                "taskd": taskd,
                                "taskds": taskds,
                                "productionline": productionline,
                                "total":(qtytot) * price,
                                "preferredvendor": preferredvendor,
                                "preferredvendorid": preferredvendorid,
                                "currency": currency,
                                "memo": memo,
                                "customer": memoid
                                };
                            
                            h++;
                        }
                    else 
                        {
                            qtytrn=summarypos[index].total
                            log.audit("summarypos[h]",summarypos[index]);
                            log.audit("qtytrn",qtytrn);
                            summarypos[index] = {
                                
                                "ppdpo": ppdpo,
                                "task": task,
                                "taskd": taskd,
                                "taskds": taskds,
                                "productionline": productionline,
                                "total":Number((qtytot) * price)+qtytrn,
                                "preferredvendor": preferredvendor,
                                "preferredvendorid": preferredvendorid,
                                "currency": currency,
                                "memo": memo,
                                "customer": memoid
                                };
                           
                        }
                       
                    
                    qtytot=0;
                    qtytota=0;
                    memo="";
                    procesar="N";
                   
			})
           
            
		});
        if (procesar=="Y")
            {  
                
                pagedatas[i] = {
                "ppdpo": ppdpo,
                "section": section,
                "task": task,
                "taskd": taskd,
                "taskds": taskds,
                "taskde": taskde,
                "productionline": productionline,
                "preferredvendor": preferredvendor,
                "preferredvendorid": preferredvendorid,
                "item": item,
                "itemid": itemid,
                "price": price,
                "currency": currency,
                "qty": qtytot,
                "leadtime": leadtime,
                "qtya": qtytota,
                "qtypo": qtytotpo,
                "total": (qtytot) * price,
                //"total": (qtytot-qtytota) * price,
                "memo": memo,
                "customer": memoid
                }

                i++;

                var index = summarypos.map(function (img) { return img.ppdpo; }).indexOf(ppdpo);
                    log.audit("index",index);
                    if (index==-1)
                        {
                            summarypos[h] ={
                                "ppdpo": ppdpo,
                                "task": task,
                                "taskd": taskd,
                                "taskds": taskds,
                                "productionline": productionline,
                                "total":(qtytot) * price,
                                "preferredvendor": preferredvendor,
                                "preferredvendorid": preferredvendorid,
                                "currency": currency,
                                "memo": memo,
                                "customer": memoid
                                };
                            
                            h++;
                        }
                    else 
                        {
                            qtytrn=summarypos[index].total
                            log.audit("summarypos[h]",summarypos[index]);
                            log.audit("qtytrn",qtytrn);
                            summarypos[index] = {
                                
                                "ppdpo": ppdpo,
                                "task": task,
                                "taskd": taskd,
                                "taskds": taskds,
                                "productionline": productionline,
                                "total":Number((qtytot) * price)+qtytrn,
                                "preferredvendor": preferredvendor,
                                "preferredvendorid": preferredvendorid,
                                "currency": currency,
                                "memo": memo,
                                "customer": memoid
                                };
                           
                        }
            }
            log.audit("i",i);
            summarypos = _.orderBy(summarypos, ["ppdpo"], ["asc"]);
            pagedatas = _.orderBy(pagedatas, ["ppdpo"], ["asc"]);
		return pagedatas;
	}

    function findCases2() {
		var pagedatas=[];

		var fsearch = search.create({
			type: "workorder",
        filters:
        [
            ["formulatext: CASE WHEN  {quantity}-NVL({quantitycommitted}, 0)>0  THEN 'YES'  ELSE 'NO' END","contains","%"], 
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
            name: "custbody_task",
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
            var section="";
            var isfirsttime=true;
            var qtytot=0;
            var memo="";

			page.data.forEach(function (fresult) {

                if (isfirsttime) {prod=fresult.getText({name: "item",summary: "GROUP"});
                    isfirsttime=false}
                
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
                    procesar="N";
                    
    				i++;
                }
           
            productionline=fresult.getText({name: "custbody_productionline",summary: "GROUP"});
            if (fresult.getValue({name: "custbody_section",summary: "MAX"})) {section=fresult.getValue({name: "custbody_section",summary: "MAX"});}
            else {section=" ";}
            if (fresult.getValue({name: "custbody_task",summary: "MAX"})) {task=fresult.getValue({name: "custbody_task",summary: "MAX"});}
            else {task=" ";}
            preferredvendor=fresult.getText({name: "vendor",join: "item",summary: "GROUP"});
            preferredvendorid=fresult.getValue({name: "vendor",join: "item",summary: "GROUP"});
            item=fresult.getText({name: "item",summary: "GROUP"});
            itemid=fresult.getValue({name: "item",summary: "GROUP"});
            price=fresult.getValue({name: "formulacurrency",summary: "MAX"});
            qtytot+=Number(fresult.getValue({name: "formulanumeric",summary: "SUM"}));
            qtytotpo=Number(fresult.getValue({name: "quantityonorder",join: "item",summary: "MAX"}));
            memo+=fresult.getValue({name: "altname",join: "customerMain",summary: "GROUP"})+"; ";
            procesar="Y";
			})

            if (procesar=="Y")
                {  
                  

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
                    procesar="N";
                    
    				i++;
                }
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
    function vendorsss() {
        
        log.debug("vendorsid",vendorsid);
		var fsearch = search.create({
            type: "vendor",
            filters:
            [
               ["internalid","anyof",vendorsid]
            ],
            columns:
            [
                "internalid",
                "entityid",
                "predicteddays"
            ]
                });

		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});


		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});
            

			page.data.forEach(function (fresult) {

                vendorsid[fresult.getValue({name: "internalid"})]= { 
                    "name": fresult.getValue({name: "entityid"}),
                    "leadtime": fresult.getValue({name: "predicteddays"})
                }

			})
		});

		return;
	}

    return {
        onRequest: onRequest
    };
});