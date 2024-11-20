/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@NModuleScope Public
 */

define(["N/runtime",'N/log', 'N/search', 'N/record',"N/email", "/SuiteScripts/Modules/generaltoolsv1.js"],
    function (runtime,log, search, record,email, GENERALTOOLS) {

        var isfirst= true;

        var getInputData = function getInputData(context) {

            var PPDID = runtime.getCurrentScript().getParameter({
                name: 'ppdid'
            });

            var fsearch = search.create({
                type: "customrecord_ppd",
                filters:
                [
                    ["custrecord_ppd_id","anyof",PPDID]
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
                "custrecord_purchaseunit",
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
                }),
                search.createColumn({
                   name: "quantityavailable",
                   join: "CUSTRECORD_PPD_ITEM"
                }),
                search.createColumn({
                   name: "quantityonorder",
                   join: "CUSTRECORD_PPD_ITEM"
                }),
                search.createColumn({
                   name: "purchaseunit",
                   join: "CUSTRECORD_PPD_ITEM"
                }),
                search.createColumn({
                   name: "unitstype",
                   join: "CUSTRECORD_PPD_ITEM"
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

            var fresult = JSON.parse(context.values[0]);

            var task=fresult.values["GROUP(trandate)"];


            var currentRec = currentRecord.get();
            
            var custpageDate = currentRec.getValue({
                fieldId: "custpage_date"
            });
            var memoh = currentRec.getValue({
                fieldId: "custpage_memo"
            });

            var sublistCount = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            console.log("Totalrecord: ",sublistCount);
            
            
            var isfirst= true;
        
            var totpo = 0;

            for (var i = 0; i < sublistCount; i++) {
                

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
                            text: productionline.trim() // Replace with the internal ID of the vendor
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
                        text: productionline.trim() // Replace with the internal ID of the vendor
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
                var unitrate = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_unitrate',
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

                purchaseOrder.commitLine({
                    sublistId: 'item'
                });
                console.log("Record No: ",i+" - "+vendorid);
                
                
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