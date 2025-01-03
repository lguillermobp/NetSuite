/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@NModuleScope Public
 */
 var totreg;
 define(["N/runtime",'N/log', 'N/search', 'N/record',"N/email", "/SuiteScripts/Modules/generaltoolsv1.js"],
    
    function (runtime,log, search, record,email, GENERALTOOLS) {


        var getInputData = function getInputData(context) {

            var PPDID = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_ppdid'
            });
            var DATE_PO = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_datepo'
            });
            var MEMO = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_memo'
            });
            var DATAPPD = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_data'
            });
            var fsearch = JSON.parse(DATAPPD); 

            totreg = fsearch.length;
           
            return fsearch;
        };
        var PPDCodeID=0;
        var tppdpo="";
        var totpo=0;
        var isfirst= true;
        var omit = false;
        var savingpo = false;
        var purchaseOrder;
        var ppdpot;
        var newpotdatedue;
        var map = function map(context) {

            var fsearchId = context.key;
            var fresult = JSON.parse(context.value);

            var PPDID = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_ppdid'
            });
            var DATE_PO = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_datepo'
            });
            var MEMO = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_memo'
            });
            var custpageDate = new Date(DATE_PO);          

            if (fresult.custrecordml_customer=="*last")

                {
                    if (savingpo) {
                        var idpo=purchaseOrder.save();
                        record.submitFields({
                            type: "customrecord_ppd_po",
                            id: ppdpot.trim(),
                            values: {
                                "custrecord_poid": idpo
                            }
                        })
                        savingpo=false;
                        omit=true;
                        
                    }
                }

                try {
                    if (!omit) 

                        {

                    if (isfirst) {
                        var task = fresult.custrecordml_taskid;
                        var taskd = fresult.custrecordml_task;
                        var productionline = fresult.custrecordml_productionline;
                        ppdpot = fresult.custrecordml_ppdpo;
                        var ppdponst = fresult.custrecordml_ppdpons;
                        var customerid = fresult.custrecordml_customer;
                        var vendorid = fresult.custrecordml_preferredvendorid;
                        var taskds = fresult.custrecordml_taskds;
                        var podate = fresult.custrecordml_podate;
                        var leadtime = fresult.custrecordml_leadtime;
                        var newpotdate=new Date(podate);
                        
                        newpotdatedue=new Date(podate);
                        //newpotdate.setDate(newpotdate.getDate()-leadtime);
                        newpotdate= addDays(newpotdate, -leadtime);
                        
                        var isrunninglate= false;
                        if (new Date(newpotdate)<new Date(DATE_PO)) 
                            {newpotdate=new Date(DATE_PO);
                            isrunninglate=true;
                            }
                       
                        trndate=newpotdate;
                        newpotdatedue = newpotdate;
                        
                        //newpotdatedue.setDate(newpotdatedue.getDate()+leadtime);
                        newpotdatedue= addDays(newpotdatedue, +leadtime);
        
                              purchaseOrder = record.create({
                                type: record.Type.PURCHASE_ORDER,
                                isDynamic: true
                            });
 
                            // Set field values
                           
                            purchaseOrder.setValue({
                                fieldId: 'entity',
                                value: vendorid // Replace with the internal ID of the vendor
                            });
                            purchaseOrder.setValue({
                                fieldId: 'custbody_tasksc',
                                value: task // Replace with the internal ID of the vendor
                            });
                            purchaseOrder.setText({
                                fieldId: 'custbody_productionline',
                                text: productionline.trim() // Replace with the internal ID of the vendor
                            });
                            
                            purchaseOrder.setText({
                                fieldId: 'custbody_ppdcode',
                                value: ppdpot.trim() // Replace with the internal ID of the vendor
                            });
                            
                            purchaseOrder.setText({
                                fieldId: 'custbody_task',
                                text: taskd // Replace with the internal ID of the vendor
                            });
                            purchaseOrder.setValue({
                                fieldId: 'trandate',
                                value: new Date(trndate) // Set the transaction date
                            });
                            purchaseOrder.setValue({
                                fieldId: 'duedate',
                                value: new Date(newpotdatedue) // Set the transaction date
                            });
                            purchaseOrder.setValue({
                                fieldId: 'memo',
                                value: MEMO // Set the transaction memo
                            });
                            purchaseOrder.setValue({
                                fieldId: 'custbody_typepo',
                                value: "4" // Set the transaction memo
                            });
                            purchaseOrder.setValue({
                                fieldId: 'custbody_runninglate',
                                value: isrunninglate 
                            });
                            purchaseOrder.setValue({
                                fieldId: 'custbody_customer',
                                value: customerid // Set the transaction memo
                            });
        
                            savingpo = true;
                            isfirst = false;
                        
                        }
                        
                        var ppdpons = fresult.custrecordml_ppdpons;
                        var ppdpo = fresult.custrecordml_ppdpo;

        
                        if (ppdpot!=ppdpo)
                            {
            
                                if (savingpo) {
                                    var idpo = purchaseOrder.save();
                                    record.submitFields({
                                        type: "customrecord_ppd_po",
                                        id: ppdpot.trim(),
                                        values: {
                                            "custrecord_poid": idpo
                                        }
                                    })
                                    log.debug("totpo",totpo);
                                    savingpo=false;
                                    totpo++}
                                ppdpot = ppdpo;
            
                                purchaseOrder = record.create({
                                    type: record.Type.PURCHASE_ORDER,
                                    isDynamic: true
                                });
  

                                var task = fresult.custrecordml_taskid;
                                var taskd = fresult.custrecordml_task;
                                var productionline = fresult.custrecordml_productionline;
                                var customerid = fresult.custrecordml_customer;
                                var vendorid = fresult.custrecordml_preferredvendorid;
                                var taskds = fresult.custrecordml_taskds;
                                var podate = fresult.custrecordml_podate;
                                var leadtime = fresult.custrecordml_leadtime;
                                var newpotdate=new Date(podate);
                                
                                //newpotdate.setDate(newpotdate.getDate()-leadtime);
                                newpotdate= addDays(newpotdate, -leadtime);

                                var isrunninglate= false;
                                if (new Date(newpotdate)<new Date(DATE_PO)) 
                                    {newpotdate=new Date(DATE_PO);
                                    isrunninglate=true;
                                    }
                                
                                trndate=newpotdate;
                                newpotdatedue = newpotdate;
                               
                                //newpotdatedue.setDate(newpotdatedue.getDate()+leadtime);
                                newpotdatedue= addDays(newpotdatedue, +leadtime);
                                
            
                                // Set field values
                                purchaseOrder.setValue({
                                    fieldId: 'entity',
                                    value: vendorid // Replace with the internal ID of the vendor
                                });
                                if (task) 
                                {
                                purchaseOrder.setValue({
                                    fieldId: 'custbody_tasksc',
                                    value: task // Replace with the internal ID of the vendor
                                });
                                }
                                purchaseOrder.setText({
                                    fieldId: 'custbody_task',
                                    text: taskd // Replace with the internal ID of the vendor
                                });
                                purchaseOrder.setText({
                                    fieldId: 'custbody_productionline',
                                    text: productionline.trim() // Replace with the internal ID of the vendor
                                });
                                purchaseOrder.setValue({
                                    fieldId: 'trandate',
                                    value: new Date(trndate) // Set the transaction date
                                });
                                purchaseOrder.setValue({
                                    fieldId: 'duedate',
                                    value: new Date(newpotdatedue) // Set the transaction date
                                });
                                
                                 purchaseOrder.setValue({
                                     fieldId: 'custbody_ppdcode',
                                     value: ppdpot.trim() // Replace with the internal ID of the vendor
                                 });
                                purchaseOrder.setValue({
                                    fieldId: 'memo',
                                    value: MEMO // Set the transaction memo
                                });
                                purchaseOrder.setValue({
                                    fieldId: 'custbody_typepo',
                                    value: "4" // Set the transaction memo
                                });
                                purchaseOrder.setValue({
                                    fieldId: 'custbody_runninglate',
                                    value: isrunninglate 
                                });
                                purchaseOrder.setValue({
                                    fieldId: 'custbody_customer',
                                    value: customerid // Set the transaction memo
                                });
            
                                
                                savingpo = true;
                            }
        
        
                            //=================================================
                            var preferredvendor = fresult.custrecordml_preferredvendor;
            
                            var item = fresult.custrecordml_item;
                            var itemid = fresult.custrecordml_itemid;
                            var qty = fresult.custrecordml_qty;
                            var unitrate = fresult.custrecordml_unitrate;
                            var price = fresult.custrecordml_price;
                            var memo = fresult.custrecordml_memo;
            

                             // Add line items
                            purchaseOrder.selectNewLine({
                                sublistId: 'item'
                            });
                            
                            purchaseOrder.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'item',
                                value: itemid // Replace with the internal ID of the item
                            });
            
                            if (unitrate==0) {unitrate=1;}
                            
                            qty=Math.ceil(qty/unitrate);
            
                            purchaseOrder.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity',
                                value: qty // Set the quantity
                            });
            
                            purchaseOrder.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'rate',
                                value: price 
                            });
            
                            purchaseOrder.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_notes',
                                value: memo 
                            });
            
                            purchaseOrder.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'expectedreceiptdate',
                                value:  new Date(newpotdatedue) 
                            });
            
                            purchaseOrder.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_atlas_promise_date',
                                value:  new Date(newpotdatedue) 
                            });
                            purchaseOrder.commitLine({
                                sublistId: 'item'
                            });

                    }



                  
                } catch (e) {
                    log.error("error",e);
                }



                function addDays  (date, days)  {
                    newDate = new Date(date);
                   newDate.setDate(newDate.getDate() + days);
                   return newDate;
                 };

           

           
            context.write(fsearchId, fresult);

        };
        
        var reduce = function reduce(context) {

            var fresult = JSON.parse(context.values[0]);

            context.write(context.key, fresult);
        };

        var summarize = function summarize(context) {

            var PPDID = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_ppdid'
            });

            log.debug("PPDID",PPDID);

            try { 
            var paramppd = GENERALTOOLS.get_PPDID(PPDID);
            var PPDNAME = paramppd.data.getValue({fieldId: "name"});

            var userObj = runtime.getCurrentUser();
            log.debug("userObj",userObj.id);
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
            var emaildest = paramemp.data.getValue({fieldId: "email"});

            log.debug("emaildest",emaildest);

            subject = "The generation of PPD ("+PPDNAME+ ") is done";


            email.send({
                author : userObj.id,
                recipients : emaildest,
                subject : subject,
                body : subject
            });
        } catch (e) {
            log.error("error",e);
        }

        };

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });