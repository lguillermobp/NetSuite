/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(["N/runtime","N/currentRecord", "N/error",'N/log', "N/record", "N/search","N/ui/message", "/SuiteScripts/Modules/LoDash.js"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (runtime,currentRecord, error,log,record, s,message,  _) {
        function pageInit() {
        }

        function markall() {
            var currentRec = currentRecord.get();
            var count = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });

            for(var i=0;i<count;i++) {

                currentRec.selectLine({
                    sublistId: "custpage_records",
                    line: i
                });

                selecf=currentRec.getCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_omit'
                });
                if (selecf) continue;
                currentRec.setCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_omit',
                    value: true,
                    ignoreFieldChange: false
                });
               
            }
            currentRec.commitLine({
                sublistId: 'custpage_records'
            });
            
        }
        function unmarkall() {
            
            var currentRec = currentRecord.get();
            var count = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            
            for(var i=0;i<count;i++) {


                currentRec.selectLine({
                    sublistId: "custpage_records",
                    line: i
                });
                selecf=currentRec.getCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_omit'
                });
                if (!selecf) continue;
                currentRec.setCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_omit',
                    value: false,
                    ignoreFieldChange: false
                });
            }
            currentRec.commitLine({
                sublistId: 'custpage_records'
            });
            
        }
/**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(context) {
           
            var currentRecord = context.currentRecord;
            
            if (context.sublistId == 'custpageppd_records') 
                if (context.fieldId == 'custrecordml_omit')
                    {
                        ppdpo=currentRecord.getCurrentSublistValue({sublistId: 'custpageppd_records',fieldId: 'custrecordml_ppdpo'});
                        omitppd=currentRecord.getCurrentSublistValue({sublistId: 'custpageppd_records',fieldId: 'custrecordml_omit'});

                        var count = currentRecord.getLineCount({
                            sublistId: 'custpage_records'
                        });
                        
                        for(var i=0;i<count;i++) {
            
            
                            currentRecord.selectLine({
                                sublistId: "custpage_records",
                                line: i
                            });

                            ppdporec=currentRecord.getCurrentSublistValue({
                                sublistId: 'custpage_records',
                                fieldId: 'custrecordml_ppdpo'
                            });

                            if (ppdporec!=ppdpo) continue;
                            
                            currentRecord.setCurrentSublistValue({
                                sublistId: 'custpage_records',
                                fieldId: 'custrecordml_omit',
                                value: omitppd,
                                ignoreFieldChange: false
                            });
                            currentRecord.commitLine({
                                sublistId: 'custpage_records'
                            });
                        }
                        

                    }

                
                {
                    
                }
             
          }
  
      
        function process() {

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
           

            log.debug("custpageDate",custpageDate);
            log.debug("sublistCount",sublistCount);
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
                    newpotdate.setDate(newpotdate.getDate()-leadtime);
                    
                    if (new Date(newpotdate)<new Date(custpageDate)) 
                        {newpotdatedue=new Date(custpageDate);}
                    else 
                        {var newpotdatedue=new Date(custpageDate);}
                    
                    newpotdatedue.setDate(newpotdatedue.getDate()+leadtime);
                    
            

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
                    newpotdate.setDate(newpotdate.getDate()-leadtime);

                    if (new Date(newpotdate)<new Date(custpageDate)) 
                        {newpotdatedue=new Date(custpageDate);}
                    else 
                        {var newpotdatedue=new Date(custpageDate);}
                    
                    newpotdatedue.setDate(newpotdatedue.getDate()+leadtime);
                    

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

            message.create({
                title: "Process Completed",
                message: "Have been created " + totpo + " Purchase Orders",
                type: message.Type.CONFIRMATION,
                duration: 10000
            }).show();
            return true;
        }

        function download(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
    
            element.style.display = 'none';
            document.body.appendChild(element);
    
            element.click();
    
            document.body.removeChild(element);
        }

        function refresh(idemp) {

            var employeeRecord = record.load({
                type: record.Type.EMPLOYEE,
                id: idemp,
                isDynamic: true
            });

            var currentRec = currentRecord.get();

            var sections = currentRec.getValue({
                fieldId: "custpage_section"
            });
            var customers = currentRec.getValue({
                fieldId: "custpage_customers"
            });
            var vendors = currentRec.getValue({
                fieldId: "custpage_vendors"
            });

            // Set value for custentity_customerssalected field
            employeeRecord.setValue({
                fieldId: "custentity_customerssalected",
                value: customers
            });
             // Set value for custentity_customerssalected field
            employeeRecord.setValue({
                fieldId: "custentity_sectionsselected",
                value: sections
            });
            employeeRecord.setValue({
                fieldId: "custentity_vendorsselected",
                value: vendors
            });
           
            employeeRecord.save();
            
           
            location.reload();
        }

        function onButtonClick(context) {
    
            var url = new URL(document.location.href);
            var page_status = url.searchParams.get('page_status');
            log.debug('page_status', page_status);
    
    
    // XML content of the file
            var res = decodeURI(context)
                res = res.replaceAll('^', '"');
                res = res.replaceAll('&&', '\n');
                res = res.replaceAll('^', '"');
    
    
    //create file
    
            var filename = "BOM.csv";
    
            download(filename, res);
    
    
        }
        return {
            pageInit: pageInit,
            unmarkall: unmarkall,
            markall: markall,
            refresh: refresh,
            onButtonClick: onButtonClick,
            process: process,
            fieldChanged: fieldChanged
        }
    })
