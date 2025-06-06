/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(['N/https',"N/runtime","N/currentRecord", "N/error",'N/log', "N/record", "N/search","N/ui/message","N/url", "/SuiteScripts/Modules/LoDash.js"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (https,runtime,currentRecord, error,log,record, s,message,url,  _) {

        var countpos = 0;
        function pageInit(context) {

            var currentRecord = context.currentRecord;

            var sublistCount = currentRecord.getLineCount({
                sublistId: 'custpageppd_records'
            });

             currentRecord.setValue({
                fieldId: "custpage_html",
                value: "Total POs will be generated: "+ sublistCount
            });
            countpos = sublistCount;
            console.log("Totalrecord: ",sublistCount);


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
        function godashboard() {
            var script = 'customscript_maindash_poo';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });

            window.open(suiteletURL, "_self");

        }
        function unmarkall() {
            
            var currentRec = currentRecord.get();
            var count = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            console.log("Totalrecord: ",count);
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
            var countpo=0;
            var currentRecord = context.currentRecord;
            if (context.sublistId == 'custpageppd_records') 
                {
                    if (context.fieldId == 'custrecordml_omit')
                        {
                           
                            ppdpow= currentRecord.getCurrentSublistValue({sublistId: 'custpageppd_records',fieldId: 'custrecordml_ppdpons'});
                            omitppd=currentRecord.getCurrentSublistValue({sublistId: 'custpageppd_records',fieldId: 'custrecordml_omit'});
                            log.debug("ppdpow",ppdpow);
                            console.log("ppdpow: ",ppdpow);
                            console.log("omitppd: ",omitppd);
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
                                    fieldId: 'custrecordml_ppdpons'
                                });
                                log.debug("ppdporec",ppdporec);
                                console.log("ppdporec: ",ppdporec);
                                selecf=currentRecord.getCurrentSublistValue({
                                    sublistId: 'custpage_records',
                                    fieldId: 'custrecordml_omit'
                                });
    
                                if (ppdporec!=ppdpow) continue;
                                
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
                            var countppd = currentRecord.getLineCount({
                                sublistId: 'custpageppd_records'
                            });
                            var countpo=0;
                            for(var i=0;i<countppd;i++) 
                                {
                
                
                                currentRecord.selectLine({
                                    sublistId: "custpageppd_records",
                                    line: i
                                });
    
                               
                                selecf=currentRecord.getCurrentSublistValue({
                                    sublistId: 'custpageppd_records',
                                    fieldId: 'custrecordml_omit'
                                });
                                 if (!selecf) countpo++;
                                
                                
                                }
                            currentRecord.setValue({
                                fieldId: "custpage_html",
                                value: "Total POs will be generated: "+ countpo
                            });
    
                        }
    
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
            var PPDID = currentRec.getValue({
                fieldId: "custpage_ppdid"
            });

            var sublistCount = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            console.log("Totalrecord: ",sublistCount);

/*

            var script = 'customscript_maindash_poo';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });

            suiteletURL += "&ppd=" + PPDID;

            window.open(suiteletURL, "_self");
*/
            
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
                    var ppdponst = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_ppdpons',
                        line: i });
                    var customerid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_customer',
                    line: i });
                    var vendorid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_preferredvendorid',
                    line: i });
                    var taskds = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskds',
                    line: i });
                    var podate = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_podate',
                    line: i });
                    var leadtime = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_leadtime',
                    line: i });
                    var newpotdate=new Date(podate);
                    
                    var newpotdatedue=new Date(podate);
                    //newpotdate.setDate(newpotdate.getDate()-leadtime);
                    newpotdate= addDays(newpotdate, -leadtime);
                    
                    var isrunninglate= false;
                    if (new Date(newpotdate)<new Date(custpageDate)) 
                        {newpotdate=new Date(custpageDate);
                        isrunninglate=true;
                        }
                   
                    trndate=newpotdate;
                    newpotdatedue = newpotdate;
                    
                    //newpotdatedue.setDate(newpotdatedue.getDate()+leadtime);
                    newpotdatedue= addDays(newpotdatedue, +leadtime);
                    

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
                        
                        purchaseOrder.setValue({
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
                            value: memoh // Set the transaction memo
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

                var ppdpons = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_ppdpons',
                    line: i
                });
                var ppdpo = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_ppdpo',
                    line: i
                });
                
               

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
                       


                        savingpo=false;
                        totpo++}
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
                    var podate = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_podate',
                    line: i });
                    var leadtime = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_leadtime',
                    line: i });
                    var newpotdate=new Date(podate);
                    
                    var newpotdatedue=new Date(podate);
                    //newpotdate.setDate(newpotdate.getDate()-leadtime);
                    newpotdate= addDays(newpotdate, -leadtime);
                    
                    var isrunninglate= false;
                    if (new Date(newpotdate)<new Date(custpageDate)) 
                        {newpotdate=new Date(custpageDate);
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
                        value: memoh // Set the transaction memo
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
                console.log("Record No: ",i+" - "+sublistCount);
                
                
            }

            
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
                    totpo++
                }

            message.create({
                title: "Process Completed",
                message: "Have been created " + totpo + " Purchase Orders",
                type: message.Type.CONFIRMATION,
                duration: 10000
            }).show();
            return true;
        }

        function process1() {

            var currentRec = currentRecord.get();

            var arraylist = [];
            
            var custpageDate = currentRec.getValue({
                fieldId: "custpage_date"
            });
            var memoh = currentRec.getValue({
                fieldId: "custpage_memo"
            });
            var PPDID = currentRec.getValue({
                fieldId: "custpage_ppdid"
            });

            var sublistCount = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            var sublistCount = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            console.log("Totalrecord: ",sublistCount);

/*

            var script = 'customscript_maindash_poo';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });

            suiteletURL += "&ppd=" + PPDID;

            window.open(suiteletURL, "_self");
*/
            
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
                var custrecordml_baunit = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_baunit',line: i });
                var custrecordml_currency = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_currency',line: i });
                var custrecordml_currencyrate = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_currencyrate',line: i });
                var custrecordml_customer = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_customer',line: i });
                var custrecordml_icurrency = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_icurrency',line: i });
                var custrecordml_item = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_item',line: i });
                var custrecordml_itemid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_itemid',line: i });
                var custrecordml_leadtime = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_leadtime',line: i });
                var custrecordml_memo = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_memo',line: i });
                var custrecordml_nobatching = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_nobatching',line: i });
                var custrecordml_omit = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_omit',line: i });
                var custrecordml_podate = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_podate',line: i });
                var custrecordml_poid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_poid',line: i });
                var custrecordml_pounit = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_pounit',line: i });
                var custrecordml_ppdpon = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_ppdpon',line: i });
                var custrecordml_ppdpo = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_ppdpo',line: i });
                var custrecordml_ppdpons = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_ppdpons',line: i });
                var custrecordml_preferredvendor = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_preferredvendor', line: i});
                var custrecordml_preferredvendorid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_preferredvendorid',line: i });
                var custrecordml_price = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_price',line: i });
                var custrecordml_productionline = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_productionline',line: i });
                var custrecordml_qty = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_qty',line: i });
                var custrecordml_qtya = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_qtya',line: i });
                var custrecordml_qtypo = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_qtypo',line: i });
                var custrecordml_qtyt = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_qtyt',line: i });
                var custrecordml_section = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_section',line: i });
                var custrecordml_sectionid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_sectionid',line: i });
                var custrecordml_task = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_task',line: i });
                var custrecordml_taskd = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskd',line: i });
                var custrecordml_taskde = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskde',line: i });
                var custrecordml_taskds = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskds',line: i });
                var custrecordml_taskid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskid',line: i });
                var custrecordml_total =currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_total',line: i });
                var custrecordml_totalusd = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_totalusd',line: i });
                var custrecordml_unitrate = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_unitrate',line: i });
                
                    arraylist[i] = {
                        "custrecordml_customer": custrecordml_customer,
                        "custrecordml_item": custrecordml_item,
                        "custrecordml_itemid": custrecordml_itemid,
                        "custrecordml_leadtime": custrecordml_leadtime,
                        "custrecordml_memo": custrecordml_memo,
                        "custrecordml_podate": custrecordml_podate,
                        "custrecordml_ppdpo": custrecordml_ppdpo,
                        "custrecordml_ppdpons": custrecordml_ppdpons,
                        "custrecordml_preferredvendorid": custrecordml_preferredvendorid,
                        "custrecordml_price": custrecordml_price,
                        "custrecordml_productionline": custrecordml_productionline,
                        "custrecordml_qty": custrecordml_qty,
                        "custrecordml_task": custrecordml_task,
                        "custrecordml_taskd": custrecordml_taskd,
                        "custrecordml_taskds": custrecordml_taskds,
                        "custrecordml_taskid": custrecordml_taskid,
                        "custrecordml_unitrate": custrecordml_unitrate
                    }
                    
                    console.log("i: ",i);
                    totpo++;

            }

            arraylist[arraylist.length] = {
                "custrecordml_customer": "*last",
                "custrecordml_item": "*last",
                "custrecordml_itemid": "*last",
                "custrecordml_leadtime": "*last",
                "custrecordml_memo": "*last",
                "custrecordml_podate": "*last",
                "custrecordml_ppdpo": "*last",
                "custrecordml_ppdpons": "*last",
                "custrecordml_preferredvendorid": "*last",
                "custrecordml_price": "*last",
                "custrecordml_productionline": "*last",
                "custrecordml_qty": "*last",
                "custrecordml_task": "*last",
                "custrecordml_taskd": "*last",
                "custrecordml_taskds": "*last",
                "custrecordml_taskid": "*last",
                "custrecordml_unitrate": "*last"
            }
    
            var script = 'customscriptrendergenerate_poo';
            var deployment = 'customdeploy1';
            var parameters = "";

            var scheme = 'https://';
            var host = url.resolveDomain({
                hostType: url.HostType.APPLICATION
                });

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });
            //window.open(suiteletURL, "_blank");
            var headerObj = {
                name: 'Accept-Language',
                value: 'en-us'
            };
            var datap  = {
                ppdid: PPDID,
                datepo: custpageDate,
                memo: memoh,
                data: arraylist
            };
            postData=JSON.stringify(datap);

            var  response = https.post.promise({
                url  : scheme + host + suiteletURL,
                body: postData, // a=1&b=2&c=3
                headers: headerObj
            });  
            
            message.create({
                title: "Process Starting ...",
                message: "We will be created " + totpo + " Purchase Orders, you will receive a confirmation email when the process is finished",
                type: message.Type.CONFIRMATION,
                duration: 10000
            }).show();
            
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

            
            var prodline = currentRec.getValue({
                fieldId: "custpage_productionline"
            });
            var vendors = currentRec.getValue({
                fieldId: "custpage_vendors"
            });

            // Set value for custentity_customerssalected field
            employeeRecord.setValue({
                fieldId: "custentity_prodlineselected",
                value: prodline
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
        function addDays  (date, days)  {
             newDate = new Date(date);
            newDate.setDate(newDate.getDate() + days);
            return newDate;
          };
        return {
            pageInit: pageInit,
            godashboard: godashboard,
            refresh: refresh,
            addDays: addDays,
            onButtonClick: onButtonClick,
            process: process,
            process1: process1,
            fieldChanged: fieldChanged,
            markall: markall,
            unmarkall: unmarkall
        }
    })
