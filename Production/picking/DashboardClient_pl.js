/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(['N/url',"N/runtime","N/currentRecord", "N/error",'N/log', "N/record", "N/search","N/ui/message"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (url,runtime,currentRecord, error,log,record, s,message) {
        var sublistCount;
        function pageInit(context) {
            var currentRec = context.currentRecord;


            sublistCount = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            currentRec.setValue('custpage_totsel', sublistCount);
            move(" ",sublistCount,sublistCount);

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
                fieldId: "custpage_saleorderno"
            });
            log.debug({title: 'saleorderno' , details: saleorderno });
            

        }

        function move(textb,actual, final) {
            var width=Math.round(actual/final*100);
            var elem = document.getElementById("myBar");
            var elem1 = document.getElementById("myProgress");

            if (width<33)                   { elem.style.backgroundColor = "#9e5d20";}
            else if (width>32 && width<66)  { elem.style.backgroundColor = "#095219";}
            else if (width<100)             { elem.style.backgroundColor = "#51875d";}
            else if (width>99)              { elem.style.backgroundColor = "#0d9e2d";}

            elem.style.width = width + "%";
            elem.innerHTML = "("+actual+") "+width  + "%";
            //elem1.innerHTML = textb;

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
                        value: totsel
                    });
                }
                else {
                    totsel--;
                    currentRecord.setValue({
                        fieldId: 'custpage_totsel',
                        value: totsel
                    });
                }
                move(" ",totsel,sublistCount);

            }

         }
        function process() {

            var currentRec = currentRecord.get();
            
            var wpbinlocationid = currentRec.getValue({
                fieldId: "custpage_wipbinid"
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
                console.log("selec1",selec);
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
            return true;
        }

  
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            process: process,
            godashboard: godashboard,
            gohelp: gohelp
        }
    })
