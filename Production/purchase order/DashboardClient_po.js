/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(["N/runtime","N/currentRecord", "N/error",'N/log', "N/record", "N/search","N/ui/message"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (runtime,currentRecord, error,log,record, s,message) {
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
            console.log("sublistCount",sublistCount);
            
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
                console.log("omit",omit);
                if (omit) continue;

                if (isfirst) {
                    var vendorid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_preferredvendorid',
                    line: i });
                    var sections = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_section',
                    line: i });
                    var productionline = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_productionline',
                    line: i });

                        var purchaseOrder = record.create({
                            type: record.Type.PURCHASE_ORDER,
                            isDynamic: true
                        });

                        // Set field values
                        console.log("vendorid",vendorid);
                        console.log("sections",sections);
                        console.log("productionline",productionline);
                        console.log("custpageDate",custpageDate);
                        purchaseOrder.setValue({
                            fieldId: 'entity',
                            value: vendorid // Replace with the internal ID of the vendor
                        });
                        purchaseOrder.setText({
                            fieldId: 'custbody_ecdsection',
                            text: sections // Replace with the internal ID of the vendor
                        });
                        purchaseOrder.setText({
                            fieldId: 'custbody_productionline',
                            text: productionline // Replace with the internal ID of the vendor
                        });
                        purchaseOrder.setValue({
                            fieldId: 'trandate',
                            value: new Date(custpageDate) // Set the transaction date
                        });
                        purchaseOrder.setValue({
                            fieldId: 'memo',
                            value: memoh // Set the transaction memo
                        });

                        savingpo = true;
                        isfirst = false;
                    
                    }

                var preferredvendorid = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_preferredvendorid',
                    line: i
                });
                console.log("preferredvendorid",preferredvendorid);

                if (vendorid!=preferredvendorid)
                {

                    if (savingpo) {purchaseOrder.save();savingpo=false;totpo++}
                    vendorid = preferredvendorid;

                    var purchaseOrder = record.create({
                        type: record.Type.PURCHASE_ORDER,
                        isDynamic: true
                    });
                    var sections = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_section',
                    line: i });
                    var productionline = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_productionline',
                    line: i });

                    console.log("vendorid",vendorid);
                    console.log("sections",sections);
                    console.log("productionline",productionline);
                    // Set field values
                    purchaseOrder.setValue({
                        fieldId: 'entity',
                        value: vendorid // Replace with the internal ID of the vendor
                    });
                    if (sections) 
                    {
                    purchaseOrder.setText({
                        fieldId: 'custbody_ecdsection',
                        text: sections // Replace with the internal ID of the vendor
                    });
                    }
                    purchaseOrder.setText({
                        fieldId: 'custbody_productionline',
                        text: productionline // Replace with the internal ID of the vendor
                    });
                    purchaseOrder.setValue({
                        fieldId: 'trandate',
                        value: new Date(custpageDate) // Set the transaction date
                    });
                    purchaseOrder.setValue({
                        fieldId: 'memo',
                        value: memoh // Set the transaction memo
                    });

                    
                    savingpo = true;
                }


                var preferredvendor = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_preferredvendor',
                    line: i
                });
                
                console.log("preferredvendor",preferredvendor);

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

            console.log("sections",sections);
            console.log("customers",customers);
            console.log("vendors",vendors);

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
            process: process
        }
    })
