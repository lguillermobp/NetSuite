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
                    title: `Purchase Order Generating Tool`
                });
                form.clientScriptModulePath = '/SuiteScripts/purchase order/DashboardClient_poo.js';

                form.addButton({
                    id: 'custpage_process',
                    label: 'Generate Purchase Orders',
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
                 
				sublistpm.addButton({
                    id: 'custpage_processtag',
                    label: 'Generate Purchase Orders',
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

                    
                    log.debug("result1.leadtime",result1.leadtime);
                    sublistpm.setSublistValue({
                        id: 'custrecordml_leadtime',
                        line: counter,
                        value: leadtime
                        
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
                        

                        log.debug("result1.leadtime",result1.leadtime);
                        sublistppd.setSublistValue({
                        id: 'custrecordml_leadtime',
                        line: counter,
                        value: leadtime
                        
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
			type: "customrecord_ppd",
            filters:
            [
            ],
            columns:
            [
                "custrecord_ppd_productionline",
                "custrecord_ppd_task",
                search.createColumn({
                    name: "custrecord_so_sc_startdate",
                    join: "CUSTRECORD_PPD_TASK"
                }),
                search.createColumn({
                    name: "custrecord_so_sc_enddate",
                    join: "CUSTRECORD_PPD_TASK"
                }),
                "custrecord_ppd_leadtime",
                "custrecord_ppd_vendor",
                "custrecord_ppd_item",
                "custrecord_ppd_quantity",
                "custrecord_ppd_currency",
                "custrecord_ppd_customer",
                "custrecord_ppd_amount",
                "custrecord_ppd_amountdollar",
                "custrecord_ppd_date",
                "created",
                "custrecord_ppd_duedate",
                "custrecord_ppd_id",
                "custrecord_ppd_price",
                "custrecord_ppd_status",
                search.createColumn({
                   name: "internalid",
                   join: "CUSTRECORD_PPD_TASK"
                }),
                search.createColumn({
                   name: "custrecord_so_sc_task",
                   join: "CUSTRECORD_PPD_TASK"
                })
            ]
        });
      
       

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

                    productionline=fresult.getText({name: "custrecord_ppd_productionline"});
                    section=" ";
                    if (fresult.getValue({name: "internalid",join: "CUSTRECORD_PPD_TASK"})) {task=fresult.getValue({name: "internalid",join: "CUSTRECORD_PPD_TASK"});}
                    else {task=" ";}
                    if (fresult.getText({name: "custrecord_so_sc_task",join: "CUSTRECORD_PPD_TASK"})) {taskd=fresult.getText({name: "custrecord_so_sc_task",join: "CUSTRECORD_PPD_TASK"});}
                    else {taskd=" ";}
                    if (fresult.getValue({name: "custrecord_so_sc_startdate",join: "CUSTRECORD_PPD_TASK"})) {taskds=fresult.getValue({name: "custrecord_so_sc_startdate",join: "CUSTRECORD_PPD_TASK"});}
                    else {taskds=" ";}
                    if (fresult.getValue({name: "custrecord_so_sc_enddate",join: "CUSTRECORD_PPD_TASK"})) {taskde=fresult.getValue({name: "custrecord_so_sc_enddate",join: "CUSTRECORD_PPD_TASK"});}
                    else {taskde=" ";}
                    if (fresult.getValue({name: "custrecord_ppd_leadtime"})) {leadtime=fresult.getValue({name: "custrecord_ppd_leadtime"});}
                    else {leadtime=0;}
                
                    procesar="Y";
                    preferredvendor=fresult.getText({name: "custrecord_ppd_vendor"});
                    leadtime=Number(fresult.getValue({name: "custrecord_ppd_leadtime"}))+0;
                    preferredvendorid=fresult.getValue({name: "custrecord_ppd_vendor"});
                    item=fresult.getText({name: "custrecord_ppd_item"});
                    itemid=fresult.getValue({name: "custrecord_ppd_item"});
                    price=fresult.getValue({name: "custrecord_ppd_price"});
                    currency=fresult.getText({name: "custrecord_ppd_currency"});
        
        
                    qtytot+=Number(fresult.getValue({name: "custrecord_ppd_quantity"}));
                
                   // qtytota=Number(fresult.getValue({name: "quantityavailable",join: "item",summary: "MAX"}));
                  //  qtytotpo=Number(fresult.getValue({name: "quantityonorder",join: "item",summary: "MAX"}));
                    qtytota=0;
                    qtytotpo=0;
                    memo=fresult.getText({name: "custrecord_ppd_customer"});
                    memoid=fresult.getValue({name: "custrecord_ppd_customer"});

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