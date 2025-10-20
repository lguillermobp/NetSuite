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
        var PPDID;
        function onRequest(context) {

            var userObj = runtime.getCurrentUser();
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id); 
            customersselected=paramemp.data.getValue({fieldId: "custentity_customerssalected"});
            requeststatusselected=paramemp.data.getValue({fieldId: "custentity_requeststatusselected"});
            vendorsselected=paramemp.data.getValue({fieldId: "custentity_vendorsselected"});
            prodlineselected=paramemp.data.getValue({fieldId: "custentity_prodlineselected"});
            viewecdid=paramemp.data.getValue({fieldId: "custentity_viewecduserid"});

		    // var userID = userObj.id;
		    // var userPermission = userObj.getPermission({	name : 'TRAN_BUILD'	});
		    // autAB= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;

            if (context.request.method === 'GET') {

                
                PPDID = context.request.parameters.ppd;
        
                let form = serverWidget.createForm({
                    title: `Reactive Order List Generating Tool`
                });
                form.clientScriptModulePath = '/SuiteScripts/purchase order/DashboardClient_rl.js';

           
                form.addButton({
                    id: 'custpage_refresh',
                    label: 'Refresh records',
                    functionName: "refresh("+userObj.id+")"
                });
                     
                var datepos = form.addField({
                    id: "custpage_date",
                    label: "PO Date",
                    type: serverWidget.FieldType.DATE,
                });

                datepos.defaultValue = new Date();

                let memo = form.addField({
                    id: "custpage_memo",
                    label: "MEMO",
                    type: serverWidget.FieldType.TEXT,
                });

                 let sviewecduserid = form.addField({
                    id: "custpage_viewecduserid",
                    label: "User ViewECD ID",
                    type: serverWidget.FieldType.INTEGER,
                });
                sviewecduserid.defaultValue = viewecdid;

                sviewecduserid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                
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

                var requeststatus = form.addField({
                    id: "custpage_requeststatus",
                    type: serverWidget.FieldType.MULTISELECT,
                    label: "Request Status",
                    source: "customrecord_requeststatus"
                });

                requeststatus.defaultValue = requeststatusselected;

                let htmlField = form.addField({
                    id: "custpage_html",
                    label: "html",
                    type: serverWidget.FieldType.INLINEHTML,
                });
                
                var sublistpm = form.addSublist({
                    id: 'custpage_records',
                    type : serverWidget.SublistType.LIST,
                    label: 'Reactive Order List',
        
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

                if (resultspt.length!=0) {
                         form.addButton({
                            id: 'custpage_process',
                            label: 'Generate Purchase Orders',
                            functionName: "process1()"
                        });
                 
                        sublistpm.addButton({
                            id: 'custpage_processtag',
                            label: 'Generate Purchase Orders',
                            functionName: "process1()"
                        });

                        sublistpm.addButton({
                            id : 'custpage_buttonexcel', //always prefix with 'custpage_'
                            label : 'Export CSV', //label of the button
                            functionName: 'onButtonClick("'+encodeURI(plantext)+'")'
                        });
                    }
               
                sublistpm.addField({
                    id: 'custrecordml_omit',
                    label: 'Include',
                    type: serverWidget.FieldType.CHECKBOX
                });
                
                var sitem = sublistpm.addField({
                    id: "custrecordml_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'Item'
                });
                 var sitemid = sublistpm.addField({
                    id: "custrecordml_itemid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Item ID'
                });

                sitemid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                var sinternalid = sublistpm.addField({
                    id: "custrecordml_internalid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Internal ID'
                });

                sinternalid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                
                var sitemd = sublistpm.addField({
                    id: "custrecordml_itemd",
                    type: serverWidget.FieldType.TEXT,
                    label:'Description Item'
                });
               
                sublistpm.addField({
                    id: "custrecordml_additionalinformation",
                    type: serverWidget.FieldType.TEXT,
                    label:'Additional Information'
                });

                sublistpm.addField({
                    id: "custrecordml_reason",
                    type: serverWidget.FieldType.TEXT,
                    label:'Reason'
                });
                sublistpm.addField({
                    id: "custrecordml_rq_type_vecd",
                    type: serverWidget.FieldType.TEXT,
                    label:'Type of Request'
                });
                
                sublistpm.addField({
                    id: "custrecordml_requeststs",
                    type: serverWidget.FieldType.TEXT,
                    label:'Status'
                });
                var srequeststscod = sublistpm.addField({
                    id: "custrecordml_requeststscod",
                    type: serverWidget.FieldType.TEXT,
                    label:'Status Code'
                });
                srequeststscod.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var srequeststscodid = sublistpm.addField({
                    id: "custrecordml_requeststscodid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Status Code ID'
                });
                srequeststscodid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                sublistpm.addField({
                    id: "custrecordml_date",
                    type: serverWidget.FieldType.TEXT,
                    label:'Date Created'
                });
                sublistpm.addField({
                    id: "custrecordml_qty",
                    type: serverWidget.FieldType.TEXT,
                    label:'Quantity'
                });
                var staskid =sublistpm.addField({
                    id: "custrecordml_taskid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Task Id'
                });
                staskid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                sublistpm.addField({
                    id: "custrecordml_taskdes",
                    type: serverWidget.FieldType.TEXT,
                    label:'Task Description'
                });

                sublistpm.addField({
                    id: "custrecordml_preferredvendor",
                    type: serverWidget.FieldType.TEXT,
                    label:'Preferred Vendor'
                });
                sublistpm.addField({
                    id: "custrecordml_leadtime",
                    type: serverWidget.FieldType.FLOAT,
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
                tpounit=sublistpm.addField({
                    id: "custrecordml_pounit",
                    type: serverWidget.FieldType.TEXT,
                    label:'unit purchase'
                });
                tpounit.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                tbaunit=sublistpm.addField({
                    id: "custrecordml_baunit",
                    type: serverWidget.FieldType.TEXT,
                    label:'unit Base'
                });
                tbaunit.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                tunitrate=sublistpm.addField({
                    id: "custrecordml_unitrate",
                    type: serverWidget.FieldType.FLOAT,
                    label:'unit Rate'
                });
                tunitrate.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
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
                var sviewecd= sublistpm.addField({
                    id: "custrecordml_sviewecd",
                    type: serverWidget.FieldType.INTEGER,
                    label:'viewecd Request'
                });
                sviewecd.updateDisplayType({
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
                
                var customerid = sublistpm.addField({
                    id: "custrecordml_customerid",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Customer ID'
                });

                customerid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var customerid = sublistpm.addField({
                    id: "custrecordml_customer",
                    type: serverWidget.FieldType.TEXT,
                    label:'Customer'
                });
                sublistpm.addField({
                    id: "custrecordml_employee",
                    type: serverWidget.FieldType.TEXT,
                    label:'Employee'
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

                var resultscurr= currencies();   

                // loop through each line, skipping the header
                
                var counter = 0;

                resultspt.forEach(function(result1) {

                    sublistpm.setSublistValue({
                        id: 'custrecordml_preferredvendor',
                        line: counter,
                        value: result1.preferredvendor+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_preferredvendorid',
                        line: counter,
                        value: 0+result1.preferredvendorid
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_item',
                        line: counter,
                        value: result1.item+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_internalid',
                        line: counter,
                        value: result1.internalid
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_itemid',
                        line: counter,
                        value: result1.itemid
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_itemd',
                        line: counter,
                        value: result1.itemd
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_additionalinformation',
                        line: counter,
                        value: result1.additionalinformation + " "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_sviewecd',
                        line: counter,
                        value: result1.sviewecd
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_reason',
                        line: counter,
                        value: result1.reason
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_rq_type_vecd',
                        line: counter,
                        value: result1.rq_type_vecd
                        
                    });
                    
                    sublistpm.setSublistValue({
                        id: 'custrecordml_leadtime',
                        line: counter,
                        value: result1.leadtime+0
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_requeststs',
                        line: counter,
                        value: result1.requeststs
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_requeststscodid',
                        line: counter,
                        value: result1.requeststscodid
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_requeststscod',
                        line: counter,
                        value: result1.requeststscod
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_date',
                        line: counter,
                        value: result1.date
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_taskdes',
                        line: counter,
                        value: result1.taskdes
                        
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_taskid',
                        line: counter,
                        value: result1.taskid
                        
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
                        id: 'custrecordml_pounit',
                        line: counter,
                        value: result1.unitpurchase+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_baunit',
                        line: counter,
                        value: result1.unitbase+" "
                    });
 
                    sublistpm.setSublistValue({
                        id: 'custrecordml_unitrate',
                        line: counter,
                        value: result1.unitrate
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
                        id: 'custrecordml_customerid',
                        line: counter,
                        value: result1.customerid
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_customer',
                        line: counter,
                        value: result1.customer
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_employee',
                        line: counter,
                        value: result1.employee
                    });
                   
                    sublistpm.setSublistValue({
                        id: 'custrecordml_omit',
                        line: counter,
                        value: result1.omit
                    });
                   
                    counter++;
                
				})

                //======================================================================================================

                
                 var sublistgt = form.addSublist({
                    id: 'custpage_recordsgt',
                    type : serverWidget.SublistType.LIST,
                    label: 'Purchase Ordered List',
        
                });
                var resultsgt= findCases2();
               
                var sitem = sublistgt.addField({
                    id: "custrecordgt_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'Item'
                });
                 var sitemid = sublistgt.addField({
                    id: "custrecordgt_itemid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Item ID'
                });

                sitemid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                var sinternalid = sublistgt.addField({
                    id: "custrecordgt_internalid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Internal ID'
                });

                sinternalid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                
                var sitemd = sublistgt.addField({
                    id: "custrecordgt_itemd",
                    type: serverWidget.FieldType.TEXT,
                    label:'Description Item'
                });
               
                sublistgt.addField({
                    id: "custrecordgt_additionalinformation",
                    type: serverWidget.FieldType.TEXT,
                    label:'Additional Information'
                });

                sublistgt.addField({
                    id: "custrecordgt_reason",
                    type: serverWidget.FieldType.TEXT,
                    label:'Reason'
                });
                sublistgt.addField({
                    id: "custrecordgt_rq_type_vecd",
                    type: serverWidget.FieldType.TEXT,
                    label:'Type of Request'
                });
                
                sublistgt.addField({
                    id: "custrecordgt_requeststs",
                    type: serverWidget.FieldType.TEXT,
                    label:'Status'
                });
                var srequeststscod = sublistgt.addField({
                    id: "custrecordgt_requeststscod",
                    type: serverWidget.FieldType.TEXT,
                    label:'Status Code'
                });
                srequeststscod.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var srequeststscodid = sublistgt.addField({
                    id: "custrecordgt_requeststscodid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Status Code ID'
                });
                srequeststscodid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                sublistgt.addField({
                    id: "custrecordgt_date",
                    type: serverWidget.FieldType.TEXT,
                    label:'Date Created'
                });
                sublistgt.addField({
                    id: "custrecordgt_qty",
                    type: serverWidget.FieldType.TEXT,
                    label:'Quantity'
                });
                var staskid =sublistgt.addField({
                    id: "custrecordgt_taskid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Task Id'
                });
                staskid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var staskdes =sublistgt.addField({
                    id: "custrecordgt_taskdes",
                    type: serverWidget.FieldType.TEXT,
                    label:'Task Description'
                });
                staskdes.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                sublistgt.addField({
                    id: "custrecordgt_preferredvendor",
                    type: serverWidget.FieldType.TEXT,
                    label:'Preferred Vendor'
                });
                 sublistgt.addField({
                    id: "custrecordgt_purchaseorder",
                    type: serverWidget.FieldType.TEXT,
                    label:'Purchase Order'
                });
                sublistgt.addField({
                    id: "custrecordgt_leadtime",
                    type: serverWidget.FieldType.FLOAT,
                    label:'Lead Time'
                });
                var vendorid = sublistgt.addField({
                    id: "custrecordgt_preferredvendorid",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Preferred Vendor ID'
                });
                vendorid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                }); 
                tpounit=sublistgt.addField({
                    id: "custrecordgt_pounit",
                    type: serverWidget.FieldType.TEXT,
                    label:'unit purchase'
                });
                tpounit.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                tbaunit=sublistgt.addField({
                    id: "custrecordgt_baunit",
                    type: serverWidget.FieldType.TEXT,
                    label:'unit Base'
                });
                tbaunit.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                tunitrate=sublistgt.addField({
                    id: "custrecordgt_unitrate",
                    type: serverWidget.FieldType.FLOAT,
                    label:'unit Rate'
                });
                tunitrate.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                sublistgt.addField({
                    id: "custrecordgt_price",
                    type: serverWidget.FieldType.FLOAT,
                    label:'Price Vendor'
                });
                sublistgt.addField({
                    id: "custrecordgt_currency",
                    type: serverWidget.FieldType.TEXT,
                    label:'Currency Vendor'
                });
                var icurr= sublistgt.addField({
                    id: "custrecordgt_icurrency",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Currency Internalid'
                });
                icurr.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var sviewecd= sublistgt.addField({
                    id: "custrecordgt_sviewecd",
                    type: serverWidget.FieldType.INTEGER,
                    label:'viewecd Request'
                });
                sviewecd.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                sublistgt.addField({
                    id: "custrecordgt_total",
                    type: serverWidget.FieldType.FLOAT,
                    label:'Total'
                });
                sublistgt.addField({
                    id: "custrecordgt_currencyrate",
                    type: serverWidget.FieldType.FLOAT,
                    label:'Exchange Rate'
                });
                sublistgt.addField({
                    id: "custrecordgt_totalusd",
                    type: serverWidget.FieldType.FLOAT,
                    label:'Total USD'
                });
                
                var customerid = sublistgt.addField({
                    id: "custrecordgt_customerid",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Customer ID'
                });

                customerid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var customerid = sublistgt.addField({
                    id: "custrecordgt_customer",
                    type: serverWidget.FieldType.TEXT,
                    label:'Customer'
                });
                sublistgt.addField({
                    id: "custrecordgt_employee",
                    type: serverWidget.FieldType.TEXT,
                    label:'Employee'
                });
              

                var resultscurr= currencies();   

                // loop through each line, skipping the header
                
                var counter = 0;

                resultsgt.forEach(function(result1) {
                    log.debug('result1', result1);

                    sublistgt.setSublistValue({
                        id: 'custrecordgt_preferredvendor',
                        line: counter,
                        value: result1.preferredvendor+" "
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_preferredvendorid',
                        line: counter,
                        value: 0+result1.preferredvendorid
                        
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_item',
                        line: counter,
                        value: result1.item+" "
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_internalid',
                        line: counter,
                        value: result1.internalid
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_itemid',
                        line: counter,
                        value: result1.itemid
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_itemd',
                        line: counter,
                        value: result1.itemd
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_additionalinformation',
                        line: counter,
                        value: result1.additionalinformation + " "
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_sviewecd',
                        line: counter,
                        value: result1.sviewecd
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_reason',
                        line: counter,
                        value: result1.reason
                        
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_rq_type_vecd',
                        line: counter,
                        value: result1.rq_type_vecd
                        
                    });
                    
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_leadtime',
                        line: counter,
                        value: result1.leadtime+0
                        
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_requeststs',
                        line: counter,
                        value: result1.requeststs
                        
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_requeststscodid',
                        line: counter,
                        value: result1.requeststscodid
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_requeststscod',
                        line: counter,
                        value: result1.requeststscod
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_date',
                        line: counter,
                        value: result1.date
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_taskdes',
                        line: counter,
                        value: result1.taskdes
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_purchaseorder',
                        line: counter,
                        value: result1.purchaseorder
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_taskid',
                        line: counter,
                        value: result1.taskid
                        
                    });
                                      
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_price',
                        line: counter,
                        value: result1.price
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_qty',
                        line: counter,
                        value: result1.qty
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_pounit',
                        line: counter,
                        value: result1.unitpurchase+" "
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_baunit',
                        line: counter,
                        value: result1.unitbase+" "
                    });
 
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_unitrate',
                        line: counter,
                        value: result1.unitrate
                    });
                    
                 
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_total',
                        line: counter,
                        value: result1.total.toFixed(2)
                    });
                    
                    if (!result1.currency) {
                        dcurrency="US Dollar";}
                    else {dcurrency=result1.currency;}

                    if (!result1.currency) {
                        icurrency=1}
                    else {icurrency=resultscurr[dcurrency].internalid;}
                    
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_currency',
                        line: counter,
                        value: dcurrency
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_icurrency',
                        line: counter,
                        value: icurrency
                    });
                    
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_currencyrate',
                        line: counter,
                        value: resultscurr[dcurrency].exchangerate
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_totalusd',
                        line: counter,
                        value: (result1.total*resultscurr[dcurrency].exchangerate).toFixed(2)
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_customerid',
                        line: counter,
                        value: result1.customerid
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_customer',
                        line: counter,
                        value: result1.customer
                    });
                    sublistgt.setSublistValue({
                        id: 'custrecordgt_employee',
                        line: counter,
                        value: result1.employee
                    });
                   
                    counter++;
                
				})

                context.response.writePage(form);
            } else {
              
            
            }
    }
	function findCases1() {
        var i=0;
		var pagedatas=[];
        var resultsunitm= unitm();
        var fsearch = search.load({ id: 'customsearch_rr_tosuitelet' });

        var defaultFilters = fsearch.filters;
            var customFilters = [];
            statussel= ["4","5","6"];
                customFilters = {
                    name: "custrecord_requeststscod",
                    operator: "anyof",
                    values: statussel,
                    isor: false,
                    isnot: false,
                    leftparens: 0,
                    rightparens: 0

                };

                defaultFilters.push(customFilters);
                fsearch.filters = defaultFilters;           
            

        if (vendorsselected.length==1) {
            vendorsselected1=vendorsselected[0];}
            else {vendorsselected1=vendorsselected;}

        if (customersselected.length==1) {
            customersselected1=customersselected[0];}
            else {customersselected1=customersselected;}

        if (requeststatusselected.length==1) {
            requeststatusselected1=requeststatusselected[0];}
            else {requeststatusselected1=requeststatusselected;}

        if (vendorsselected.length>0) {
            
            fsearch.filters.push(search.createFilter({ 
                name: "vendor",
                join: "CUSTRECORD_ITEM",
                operator: "anyof",
                values: vendorsselected1
            }));
        }
        if (requeststatusselected.length>0) {

            fsearch.filters.push(search.createFilter({
                name: "custrecord_requeststscod",
                operator: "anyof",
                values: requeststatusselected1
            }));
        }
        if (customersselected.length>0) {

            fsearch.filters.push(search.createFilter({
                name: "custrecord_project",
                operator: "anyof",
                values: customersselected1
            }));
        }
        
		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});

		pagedData.pageRanges.forEach(function (pageRange) {
           
			var page = pagedData.fetch({index: pageRange.index});

			page.data.forEach(function (fresult) {

                var index1 = Number(resultsunitm.map(function (img) { return img.name; }).indexOf(fresult.getText({name: "unitstype", join: "CUSTRECORD_ITEM"})+"/"+fresult.getText({name: "purchaseunit", join: "CUSTRECORD_ITEM"})));
                   if (index1==-1) {unitrate=1;}
                    else {unitrate=resultsunitm[index1].conversionrate;}


                 pagedatas[i] = {
                    "internalid": fresult.getValue({name: "internalid"}),
                    "requeststscodid": fresult.getValue({name: "custrecord_requeststscod"}),
                    "requeststscod": fresult.getText({name: "custrecord_requeststscod"}),
                    "itemd": fresult.getValue({name: "custrecord_itemdescription"}),
                    "item": fresult.getText({name: "custrecord_item"}),
                    "itemid": fresult.getValue({name: "custrecord_item"}),
                    "sviewecd": fresult.getValue({name: "custrecord_viewecdid"}),
                    "employee": fresult.getValue({name: "custrecord_employee"}),
                    "additionalinformation": fresult.getValue({name: "custrecord_additionalinformation"}),
                    "reason": fresult.getValue({name: "custrecord_reason"}),
                    "rq_type_vecd": fresult.getText({name: "custrecord_rq_type_vecd"}),
                    "requeststs": fresult.getValue({name: "custrecord_requeststs"}),
                    "date": fresult.getValue({name: "created"}),
                    "qty": fresult.getValue({name: "custrecord_qty"}),
                    "taskid": fresult.getValue({name: "custbody_scheduletaskid", join: "CUSTRECORD_WO"}),
                    "taskdes": fresult.getText({name: "custbody_scheduletaskid", join: "CUSTRECORD_WO"}),
                    "preferredvendor": fresult.getText({name: "vendor", join: "CUSTRECORD_ITEM"}),
                    "preferredvendorid": fresult.getValue({name: "vendor", join: "CUSTRECORD_ITEM"}),
                    "unitpurchase": fresult.getText({name: "purchaseunit", join: "CUSTRECORD_ITEM"}),
                    "unitbase": fresult.getText({name: "unitstype", join: "CUSTRECORD_ITEM"}),
                    "price": fresult.getValue({name: "vendorcost", join: "CUSTRECORD_ITEM"}),
                    "currency": fresult.getText({name: "vendorpricecurrency", join: "CUSTRECORD_ITEM"}),
                    "customerid": fresult.getValue({name: "custrecord_project"}),
                    "customer": fresult.getText({name: "custrecord_project"}),
                    "unitrate": unitrate,
                    "omit": 'F',
                    "leadtime": fresult.getValue({name: "leadtime", join: "CUSTRECORD_ITEM"}),
                    "total": Number(fresult.getValue({name: "custrecord_qty"})) * Number(fresult.getValue({name: "vendorcost", join: "CUSTRECORD_ITEM"}))         
				    }

                    i++;
			})
            
		});
      
            pagedatas = _.orderBy(pagedatas,  ['preferredvendorid', 'customerid'], ['asc', 'asc']);
		return pagedatas;
	}

    function findCases2() {
        var x=0;
		var pagedatas=[];
        var resultsunitm= unitm();
        var fsearch = search.load({ id: 'customsearch_rr_tosuitelet' });

        var defaultFilters = fsearch.filters;
            var customFilters = [];
            statussel= ["7","8"];
                customFilters = {
                    name: "custrecord_requeststscod",
                    operator: "anyof",
                    values: statussel,
                    isor: false,
                    isnot: false,
                    leftparens: 0,
                    rightparens: 0

                };

        defaultFilters.push(customFilters);
        fsearch.filters = defaultFilters; 

        log.debug('customersselected', fsearch);
        
		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});

        log.debug('pagedData', pagedData);
		pagedData.pageRanges.forEach(function (pageRange) {
           
			var page = pagedData.fetch({index: pageRange.index});

			page.data.forEach(function (fresult) {

                var index1 = Number(resultsunitm.map(function (img) { return img.name; }).indexOf(fresult.getText({name: "unitstype", join: "CUSTRECORD_ITEM"})+"/"+fresult.getText({name: "purchaseunit", join: "CUSTRECORD_ITEM"})));
                   if (index1==-1) {unitrate=1;}
                    else {unitrate=resultsunitm[index1].conversionrate;}


                 pagedatas[x] = {
                    "internalid": fresult.getValue({name: "internalid"}),
                    "requeststscodid": fresult.getValue({name: "custrecord_requeststscod"}),
                    "requeststscod": fresult.getText({name: "custrecord_requeststscod"}),
                    "itemd": fresult.getValue({name: "custrecord_itemdescription"}),
                    "item": fresult.getText({name: "custrecord_item"}),
                    "itemid": fresult.getValue({name: "custrecord_item"}),
                    "sviewecd": fresult.getValue({name: "custrecord_viewecdid"}),
                    "employee": fresult.getValue({name: "custrecord_employee"}),
                    "additionalinformation": fresult.getValue({name: "custrecord_additionalinformation"}),
                    "reason": fresult.getValue({name: "custrecord_reason"}),
                    "rq_type_vecd": fresult.getText({name: "custrecord_rq_type_vecd"}),
                    "requeststs": fresult.getValue({name: "custrecord_requeststs"}),
                    "date": fresult.getValue({name: "created"}),
                    "qty": fresult.getValue({name: "custrecord_qty"}),
                    "taskid": fresult.getValue({name: "custbody_scheduletaskid", join: "CUSTRECORD_WO"}),
                    "taskdes": fresult.getText({name: "custbody_scheduletaskid", join: "CUSTRECORD_WO"}),
                    "preferredvendor": fresult.getText({name: "vendor", join: "CUSTRECORD_ITEM"}),
                    "preferredvendorid": fresult.getValue({name: "vendor", join: "CUSTRECORD_ITEM"}),
                    "unitpurchase": fresult.getText({name: "purchaseunit", join: "CUSTRECORD_ITEM"}),
                    "unitbase": fresult.getText({name: "unitstype", join: "CUSTRECORD_ITEM"}),
                    "price": fresult.getValue({name: "vendorcost", join: "CUSTRECORD_ITEM"}),
                    "currency": fresult.getText({name: "vendorpricecurrency", join: "CUSTRECORD_ITEM"}),
                    "customerid": fresult.getValue({name: "custrecord_project"}),
                    "customer": fresult.getText({name: "custrecord_project"}),
                    "purchaseorder": fresult.getText({name: "custrecord_po"}),
                    "unitrate": unitrate,
                    "leadtime": fresult.getValue({name: "leadtime", join: "CUSTRECORD_ITEM"}),
                    "total": Number(fresult.getValue({name: "custrecord_qty"})) * Number(fresult.getValue({name: "vendorcost", join: "CUSTRECORD_ITEM"}))         
				    }
                    log.debug('pagedatas[i]', pagedatas[i]);

                    x++;
			})
            
		});
      
            pagedatas = _.orderBy(pagedatas,  ['preferredvendorid', 'customerid'], ['asc', 'asc']);
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

    function unitm() {
		var pagedatasunitm=[];

		var fsearch = search.create({
			type: "unitstype",
            filters:
            [
            ],
            columns:
            [
                "internalid",
                "baseunit",
                "name",
                "conversionrate",
                "unitname",
                "pluralname"
            ]
                });

		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});


		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});
            

			page.data.forEach(function (fresult) {

                pagedatasunitm[fresult.getValue({name: "name"})+"/"+fresult.getValue({name: "unitname"})] = fresult.getValue({name: "conversionrate"});
			})
		});

		return pagedatasunitm;
	}

    return {
        onRequest: onRequest
    };
});