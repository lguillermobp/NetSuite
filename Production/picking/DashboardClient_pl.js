/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(['N/https',"N/file", "N/runtime",'N/url',"N/ui/dialog","N/runtime","N/currentRecord",'N/log', "N/record", "N/search","N/ui/message", "/SuiteScripts/Modules/helptools.js"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (https,file, runtime,url,dialog,runtime,currentRecord,log,record, s,message,HELPTOOLS) {
        var sublistCount;
        var sublistCountt;
        function pageInit(context) {
            var currentRec = context.currentRecord;

            var WOsts = currentRec.getValue({
                fieldId: 'custpage_customerwosts'
            });

            if (WOsts == "999Released") {
            message.create({
                title: "Manufacturing Order Status Error",
                message: "Te MO is now in " + WOsts + " status. Please release the MO first before processing the Picking List.",
                type: message.Type.ERROR
            }).show();
            }

            sublistCount = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            sublistCounttr = currentRec.getLineCount({
                sublistId: 'custpage_recordstr'
            });


            if (sublistCounttr>0) {
                message.create({
                    title: "MO has been previously transferred",
                    message: "Caution this Manufacturing Order already has a transfer done previously.",
                    type: message.Type.WARNING,
                    duration: 10000
                }).show();
                }
    


            sublistCountt = Number(currentRec.getLineCount({
                sublistId: 'custpage_recordsbo'
            })+sublistCount);
            currentRec.setValue('custpage_totsel', sublistCount);
            move(" ",sublistCount,sublistCount);
            move1(" ",sublistCount,sublistCountt);

        }

        function godashboard() {
            var script = 'customscript_maindashboard';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });

            window.open(suiteletURL, "_self");

        }

        function gohelp() {

            var currRec = currentRecord.get();

            var saleorderno = currRec.getValue({
                fieldId: "custpage_workorderno"
            });
            log.debug({title: 'workorderno' , details: saleorderno });
            var okg=HELPTOOLS.helpgo(saleorderno);
            

        }

        function move(textb,actual, final) {
            var width=Math.round(actual/final*100);
            var elemt = document.getElementById("MyPalletId");
            var elem = document.getElementById("myBar");
            var elem1 = document.getElementById("myProgress");

            if (width<33)                   { elem.style.backgroundColor = "#9e5d20";}
            else if (width>32 && width<66)  { elem.style.backgroundColor = "#095219";}
            else if (width<100)             { elem.style.backgroundColor = "#51875d";}
            else if (width>99)              { elem.style.backgroundColor = "#0d9e2d";}

            elem.style.width = width + "%";
            elem.innerHTML = "("+actual+") "+width  + "%";
            elemt.innerHTML = "Available Items ("+final+")";
            
            //elem1.innerHTML = textb;

        }

        function move1(textb,actual, final) {
            var width=Math.round(actual/final*100);
            var elemt = document.getElementById("MyPalletId1");
            var elem = document.getElementById("myBar1");
            var elem1 = document.getElementById("myProgress1");

            if (width<33)                   { elem.style.backgroundColor = "#9e5d20";}
            else if (width>32 && width<66)  { elem.style.backgroundColor = "#095219";}
            else if (width<100)             { elem.style.backgroundColor = "#51875d";}
            else if (width>99)              { elem.style.backgroundColor = "#0d9e2d";}

            elem.style.width = width + "%";
            elem.innerHTML = "("+actual+") "+width  + "%";
            elemt.innerHTML = "Total ("+final+")";
            
            //elem1.innerHTML = textb;

        }

        function markall() {
            var currentRec = currentRecord.get();
            var count = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });

            for(var i=0;i<=count;i++) {

                currentRec.selectLine({
                    sublistId: "custpage_records",
                    line: i
                });

                selecf=currentRec.getCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_selected'
                });
                if (selecf) continue;
                currentRec.setCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_selected',
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
            
            for(var i=0;i<=count;i++) {

                currentRec.selectLine({
                    sublistId: "custpage_records",
                    line: i
                });
                selecf=currentRec.getCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_selected'
                });
                if (!selecf) continue;
                currentRec.setCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_selected',
                    value: false,
                    ignoreFieldChange: false
                });
            }
            currentRec.commitLine({
                sublistId: 'custpage_records'
            });
            
        }


         /**
         *  Function to be executed when field is changed.*
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
            var currentRecord = context.currentRecord

            var fieldId = context.fieldId

            if (fieldId === "custrecordml_selected" ) {
                var selec = currentRecord.getCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_selected'
                });
                var totsel = currentRecord.getValue({
                    fieldId: 'custpage_totsel'
                });
                if (selec) {
                    totsel++;
                    currentRecord.setValue({
                        fieldId: 'custpage_totsel',
                        value: totsel,
                        ignoreFieldChange: true
                    });
                }
                else {
                    totsel--;
                    currentRecord.setValue({
                        fieldId: 'custpage_totsel',
                        value: totsel,
                        ignoreFieldChange: true
                    });
                }
                move(" ",totsel,sublistCount);
                move1(" ",totsel,sublistCountt);

            }

         }
        function process() {

            console.log("process","process");

            dialog.confirm({
                title: 'Do you want to submit?',
                message: 'This is a msg for confirmation',
            }).then(success).catch(fail);

                    function success(result) {

                        if (result) {



                            var currentRec = currentRecord.get();

                            document.getElementById("secondarycustpage_process").disabled = true;
                            document.getElementById("custpage_process").disabled = true;

                            var wpbinlocationid = currentRec.getValue({
                                fieldId: "custpage_wipbinid"
                            });

                            var workorderno = currentRec.getValue({
                                fieldId: "custpage_workorderno"
                            });

                            var locationid = currentRec.getValue({
                                fieldId: "custpage_locationid"
                            });

                            var sublistCount = currentRec.getLineCount({
                                sublistId: 'custpage_records'
                            });
                            console.log("sublistCount",sublistCount);
                            
                            var invtransf = record.create({
                                type: record.Type.INVENTORY_TRANSFER,
                                isDynamic: true
                            });
                            invtransf.setValue({
                                fieldId: 'memo',
                                value: workorderno 
                            });
                            invtransf.setValue({
                                fieldId: 'location',
                                value: 1 // Replace with the internal ID
                            });
                            invtransf.setValue({
                                fieldId: 'transferlocation',
                                value: locationid // Replace with the internal ID
                            });


                            for (var i = 0; i < sublistCount; i++) {

                                var selec = currentRec.getSublistValue({
                                    sublistId: 'custpage_records',
                                    fieldId: 'custrecordml_selected',
                                    line: i
                                });
                                
                                if (!selec) continue;

                                move(" ",i+1,sublistCount);
                                move1(" ",i,sublistCountt);

                                var item = currentRec.getSublistValue({
                                    sublistId: 'custpage_records',
                                    fieldId: 'custrecordml_itemid',
                                    line: i
                                });
                                var binlocationid = currentRec.getSublistValue({
                                    sublistId: 'custpage_records',
                                    fieldId: 'custrecordml_binlocationid',
                                    line: i
                                });
                                var binlocation = currentRec.getSublistValue({
                                    sublistId: 'custpage_records',
                                    fieldId: 'custrecordml_binlocation',
                                    line: i
                                });
                                var qty = currentRec.getSublistValue({
                                    sublistId: 'custpage_records',
                                    fieldId: 'custrecordml_qtyb',
                                    line: i
                                });
                                var qtyneed = currentRec.getSublistValue({
                                    sublistId: 'custpage_records',
                                    fieldId: 'custrecordml_qtyneeded',
                                    line: i
                                });
                                
                                if (qtyneed > qty) {qtyneed = qty;}

                                // Add line items
                                invtransf.selectNewLine({
                                    sublistId: 'inventory'
                                });
                                
                                invtransf.setCurrentSublistValue({
                                    sublistId: 'inventory',
                                    fieldId: 'item',
                                    value: item // Replace with the internal ID of the item
                                });
                                console.log("item",item);
                                console.log("qtyneed",qtyneed);
                                invtransf.setCurrentSublistValue({
                                    sublistId: 'inventory',
                                    fieldId: 'adjustqtyby',
                                    value: qtyneed // Set the quantity
                                });


                                // Create the subrecord for that line.
                                var subrec = invtransf.getCurrentSublistSubrecord({
                                    sublistId: 'inventory',
                                    fieldId: 'inventorydetail'
                                });

                                // Add a line to the subrecord's inventory assignment sublist.
                                subrec.selectNewLine({
                                    sublistId: 'inventoryassignment'
                                });

                                subrec.setCurrentSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'quantity',
                                    value: qtyneed
                                });
                                subrec.setCurrentSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'binnumber',
                                    value: binlocationid
                                });
                                subrec.setCurrentSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'tobinnumber',
                                    value: wpbinlocationid
                                });

                                

                                // Save the line in the subrecord's sublist.
                                subrec.commitLine({
                                    sublistId: 'inventoryassignment'
                                });


                                invtransf.commitLine({
                                    sublistId: 'inventory'
                                });

                                
                            }
                            invtransf.save();

                            message.create({
                                title: "Process Completed",
                                message: "The Picking List has been processed successfully.",
                                type: message.Type.CONFIRMATION,
                                duration: 10000
                            }).show();

                            location.reload();
                        }
                    }

                    function fail(reason)
                    {
                        return false;
                    }


            return true;
        }

        function printpl(woid) 
        {
            
            
            var suiteletURL = url.resolveScript({
                scriptId: 'customscript_printbomlist',
                deploymentId: 'customdeploy1',
                returnExternalUrl: false,
                params: {
                    'id': woid,
                }
                });
                https.get.promise({
                    url: suiteletURL
                }).then(function (response) {
                    showSuccess(pdf)
                }).catch(function (reason) {
                    log.error("failed to send to print", reason)
                    showError(reason);
                });
                // If the suitelet generates a PDF or form that should appear for the user, use window.open()
                window.open(suiteletURL);
                // To open SuiteLet in same tab, use location.href
                

        }
        return {
            pageInit: pageInit,
            printpl: printpl,
            unmarkall: unmarkall,
            markall: markall,
            fieldChanged: fieldChanged,
            process: process,
            godashboard: godashboard,
            gohelp: gohelp
        }
    })
