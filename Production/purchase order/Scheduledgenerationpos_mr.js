/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@NModuleScope Public
 */

define(["N/runtime",'N/log', 'N/search', 'N/record',"N/email", "/SuiteScripts/Modules/generaltoolsv1.js"],
    function (runtime,log, search, record,email, GENERALTOOLS) {

        var isfirst= true;

        var getInputData = function getInputData(context) {

            var batchcode = runtime.getCurrentScript().getParameter({
                name: 'custscriptbatchcode'
            });

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
                    search.createColumn({
                        name: "custrecord_ppd_vendor",
                        sort: search.Sort.ASC
                    }),
                    search.createColumn({
                        name: "custrecord_ppd_item",
                        sort: search.Sort.ASC
                    }),
                    search.createColumn({
                        name: "custrecord_ppd_customer",
                        sort: search.Sort.ASC
                    }),
                    "custrecord_ppd_quantity",
                    "custrecord_ppd_currency",
                    "custrecord_ppd_amount",
                    "custrecord_ppd_amountdollar",
                    "custrecord_ppd_date",
                    "created",
                    "custrecord_ppd_duedate",
                    "custrecord_ppd_id",
                    "custrecord_ppd_price",
                    "custrecord_ppd_status",
                    search.createColumn({
                       name: "custentity_noppdbatching",
                       join: "CUSTRECORD_PPD_VENDOR"
                    }),
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
          
           
            return fsearch;
        };

        var map = function map(context) {

            var customFulfillRecordId = context.key;
            var customFulfillRecord = JSON.parse(context.value);

            context.write(customFulfillRecordId, customFulfillRecord);

        };

        var reduce = function reduce(context) {

            var custpageDate = runtime.getCurrentScript().getParameter({
                name: 'custscript_custpageDate'
            });
            var memoh = runtime.getCurrentScript().getParameter({
                name: 'custscript_memoh'
            });

            var fresult = JSON.parse(context.values[0]);

            internalid=fresult.values["MAX(formulanumeric)"];
            expdate=fresult.values["GROUP(custcol_bkms_po_item_exp_ship_date)"];

            
           
           

            log.debug("custpageDate",custpageDate);
           
            var totpo = 0;

            for (var i = 0; i < sublistCount; i++) {

                var omit = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_omit',
                    line: i
                });
               
                if (omit) continue;

                if (isfirst) {
                    var task = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskid',
                    line: i });
                    var taskd = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_task',
                    line: i });
                    var productionline = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_productionline',
                    line: i });
                    var ppdpot = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_ppdpo',
                    line: i });
                    var customerid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_customer',
                    line: i });
                    var vendorid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_preferredvendorid',
                    line: i });
                    var taskds = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskds',
                    line: i });
                    var leadtime = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_leadtime',
                    line: i });
                    var newpotdate=new Date(taskds);
                    var newpotdatedue=new Date(taskds);
                    newpotdate.setDate(newpotdate.getDate()-leadtime);
                    
                    if (new Date(newpotdate)<new Date(custpageDate)) 
                        {newpotdate=new Date(custpageDate);}
                    
                    
                    newpotdatedue.setDate(newpotdate.getDate()+leadtime);
                    
            

                        var purchaseOrder = record.create({
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
                            text: productionline // Replace with the internal ID of the vendor
                        });
                        purchaseOrder.setText({
                            fieldId: 'custbody_task',
                            text: taskd // Replace with the internal ID of the vendor
                        });
                        purchaseOrder.setValue({
                            fieldId: 'trandate',
                            value: new Date(newpotdate) // Set the transaction date
                        });
                        purchaseOrder.setValue({
                            fieldId: 'duedate',
                            value: new Date(newpotdatedue) // Set the transaction date
                        });
                        purchaseOrder.setValue({
                            fieldId: 'memo',
                            value: memoh // Set the transaction memo
                        });
                        purchaseOrder.setValue({
                            fieldId: 'custbody_typepo',
                            value: "4" // Set the transaction memo
                        });
                        purchaseOrder.setValue({
                            fieldId: 'custbody_customer',
                            value: customerid // Set the transaction memo
                        });
    

                        savingpo = true;
                        isfirst = false;
                    
                    }

                var ppdpo = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_ppdpo',
                    line: i
                });
               

                if (ppdpot!=ppdpo)
                {

                    if (savingpo) {purchaseOrder.save();savingpo=false;totpo++}
                    ppdpot = ppdpo;

                    var purchaseOrder = record.create({
                        type: record.Type.PURCHASE_ORDER,
                        isDynamic: true
                    });
                    var task = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskid',
                    line: i });
                    var taskd = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_task',
                    line: i });
                    var productionline = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_productionline',
                    line: i });
                    var customerid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_customer',
                    line: i });
                    var vendorid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_preferredvendorid',
                    line: i });
                    var taskds = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskds',
                    line: i });
                    var leadtime = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_leadtime',
                    line: i });
                    var newpotdate=new Date(taskds);
                    var newpotdatedue=new Date(taskds);
                    newpotdate.setDate(newpotdate.getDate()-leadtime);

                    if (new Date(newpotdate)<new Date(custpageDate)) 
                        {newpotdate=new Date(custpageDate);}
                    
                    newpotdatedue.setDate(newpotdate.getDate()+leadtime);
                    

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
                        text: productionline // Replace with the internal ID of the vendor
                    });
                    purchaseOrder.setValue({
                        fieldId: 'trandate',
                        value: new Date(newpotdate) // Set the transaction date
                    });
                    purchaseOrder.setValue({
                        fieldId: 'duedate',
                        value: new Date(newpotdatedue) // Set the transaction date
                    });
                    purchaseOrder.setValue({
                        fieldId: 'memo',
                        value: memoh // Set the transaction memo
                    });
                    purchaseOrder.setValue({
                        fieldId: 'custbody_typepo',
                        value: "4" // Set the transaction memo
                    });
                    purchaseOrder.setValue({
                        fieldId: 'custbody_customer',
                        value: customerid // Set the transaction memo
                    });

                    
                    savingpo = true;
                }


                var preferredvendor = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_preferredvendor',
                    line: i
                });

                var item = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_item',
                    line: i
                });
                var itemid = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_itemid',
                    line: i
                });
                var qty = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_qty',
                    line: i
                });

                var price = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_price',
                    line: i
                });

                var memo = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_memo',
                    line: i
                });


                 // Add line items
                purchaseOrder.selectNewLine({
                    sublistId: 'item'
                });
                log.debug("i",i);
                purchaseOrder.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: itemid // Replace with the internal ID of the item
                });

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

                purchaseOrder.commitLine({
                    sublistId: 'item'
                });
                console.log("Record No: ",i);
                
            }
            if (savingpo) {purchaseOrder.save();savingpo=false;totpo++}


            context.write(context.key, salesOrderData);
        };

        var summarize = function summarize(context) {

            var batchcode = runtime.getCurrentScript().getParameter({
                name: 'custscriptbatchcode'
            });

            var userObj = runtime.getCurrentUser();
            log.debug("userObj",userObj.id);
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
            var emaildest = paramemp.data.getValue({fieldId: "email"});

            log.debug("emaildest",emaildest);

            subject = "The generation of Batch printer lot ("+batchcode+ ") is done";


            email.send({
                author : userObj.id,
                recipients : emaildest,
                subject : subject,
                body : subject
            });

        };

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });