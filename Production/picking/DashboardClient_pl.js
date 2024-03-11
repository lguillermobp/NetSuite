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

        function process() {
            var currRec = currentRecord.get();
        
            // call RenderPriorityPrintPDF.js (1941)
            var url = "/app/site/hosting/scriptlet.nl?script=1941&deploy=1";
            url += "&fieldfilename=" + fieldfilename;
           
            //window.open(url, "_blank")
        }

      
        function process() {

            var currentRec = currentRecord.get();
            
            var custpageDate = currentRec.getValue({
                fieldId: "custpage_date"
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
                        var purchaseOrder = record.create({
                            type: record.Type.PURCHASE_ORDER,
                            isDynamic: true
                        });

                        // Set field values
                        console.log("vendorid",vendorid);
                        console.log("custpageDate",custpageDate);
                        purchaseOrder.setValue({
                            fieldId: 'entity',
                            value: vendorid // Replace with the internal ID of the vendor
                        });

                        purchaseOrder.setValue({
                            fieldId: 'trandate',
                            value: new Date(custpageDate) // Set the transaction date
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
        
                    // Set field values
                    purchaseOrder.setValue({
                        fieldId: 'entity',
                        value: vendorid // Replace with the internal ID of the vendor
                    });
        
                    purchaseOrder.setValue({
                        fieldId: 'trandate',
                        value: new Date(custpageDate) // Set the transaction date
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

  
        return {
            pageInit: pageInit,
            process: process
        }
    })
