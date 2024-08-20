/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(['N/https',"N/file", "N/runtime",'N/url',"N/ui/dialog","N/runtime","N/currentRecord",'N/log', "N/record", "N/search","N/ui/message", "/SuiteScripts/Modules/helptools.js", "/SuiteScripts/Modules/generaltoolsv1.js"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (https,file, runtime,url,dialog,runtime,currentRecord,log,record, s,message,HELPTOOLS, GENERALTOOLS) {
        var sublistCount;
        var sublistCountt;
        function pageInit(context) {
            var currentRec = context.currentRecord;

            

        }

        function godashboard() {
            var script = 'customscript_maindashboard_re';
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
                var binNumber = currentRec.getCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: "custrecordml_bin"
                });

                if (binNumber) 
                {
                    // selecf=currentRec.getCurrentSublistValue({
                    //     sublistId: 'custpage_records',
                    //     fieldId: 'custrecordml_selected'
                    // });
                    // if (selecf) continue;
                    currentRec.setCurrentSublistValue({
                        sublistId: 'custpage_records',
                        fieldId: 'custrecordml_selected',
                        value: true,
                        ignoreFieldChange: true
                    });
                    currentRec.commitLine({
                        sublistId: 'custpage_records'
                    });
                    
                }
               
            }
            
            
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
                // selecf=currentRec.getCurrentSublistValue({
                //     sublistId: 'custpage_records',
                //     fieldId: 'custrecordml_selected'
                // });
                // if (!selecf) continue;
                currentRec.setCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_selected',
                    value: false,
                    ignoreFieldChange: true
                });
                currentRec.commitLine({
                    sublistId: 'custpage_records'
                });
                
            }
            
            
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
         

         function printrn(url) {
            console.log(url);
            window.open(url, "_blank");
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
            
            if (context.fieldId == 'custrecordml_bin') 
                
                {

                    var binNumber = currentRecord.getCurrentSublistValue({
                        sublistId: context.sublistId,
                        fieldId: "custrecordml_bin"
                    });

                    if (binNumber) 

                        {
                        

                            var locationid = currentRecord.getValue({
                                fieldId: 'custpage_locationid'
                            });
                            
                            var itemid = currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: "custrecordml_itemid"
                            });
                            var binNumber = currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: "custrecordml_bin"
                            });
                            
                            paramitem = GENERALTOOLS.get_Item_basic(itemid);
                            paramdata = paramitem.data;
                            typerecord=paramdata.recordtype;

                            if (!paramdata.binNumber) {

                                rec = record.load({
                                    type: typerecord,
                                    id: itemid,
                                    isDynamic: true
                                })
                            
                                    var lineNumber = rec.findSublistLineWithValue({
                                    sublistId: 'binnumber',
                                    fieldId: 'preferredbin',
                                    value: true
                                });
                            
                                if (lineNumber==-1) {
                                    
                                    rec.selectNewLine({sublistId: "binnumber"});
                                    rec.setCurrentSublistValue({sublistId: "binnumber", fieldId: "location", value: locationid});
                                    rec.setCurrentSublistValue({sublistId: "binnumber", fieldId: "binnumber", value: binNumber});
                                    rec.setCurrentSublistValue({sublistId: "binnumber", fieldId: "preferredbin", value: true});
                                    rec.commitLine({sublistId: "binnumber"});
                                    var saverec = rec.save();
                                }
                            }
                            console.log(context.fieldId);

                        }
                        else {
                            currentRecord.setCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: "custrecordml_selected",
                                value: false
                            });
                        }
                }

                if (context.fieldId == 'custrecordml_selected') 
                
                    {
                        var selec = currentRecord.getCurrentSublistValue({
                            sublistId: context.sublistId,
                            fieldId: "custrecordml_selected"
                        });
                        var inventorydetailavail = currentRecord.getCurrentSublistValue({
                            sublistId: context.sublistId,
                            fieldId: "custrecordml_inventorydetailavail"
                        });
                        console.log("inventorydetailavail",inventorydetailavail);

                        var binNumber = currentRecord.getCurrentSublistValue({
                            sublistId: context.sublistId,
                            fieldId: "custrecordml_bin"
                        });

                        if (inventorydetailavail == "T") {
                        if (selec && !binNumber) 
                        {
                             currentRecord.setCurrentSublistValue({
                                 sublistId: context.sublistId,
                                 fieldId: "custrecordml_selected",
                                 value: false
                             });
                        }
                    }

                    }
             
          }
  
          /**
           * Function to be executed when field is slaved.
           *
           * @param {Object} scriptContext
           * @param {Record} scriptContext.currentRecord - Current form record
           * @param {string} scriptContext.sublistId - Sublist name
           * @param {string} scriptContext.fieldId - Field name
           *
           * @since 2015.2
           */
          function postSourcing(scriptContext) {
  
          }
  
          /**
           * Function to be executed after sublist is inserted, removed, or edited.
           *
           * @param {Object} scriptContext
           * @param {Record} scriptContext.currentRecord - Current form record
           * @param {string} scriptContext.sublistId - Sublist name
           *
           * @since 2015.2
           */
          function sublistChanged(context) {
            log.audit("field",context.sublistId);
            console.log(context.sublistId);
  
  
          }
  
          /**
           * Function to be executed after line is selected.
           *
           * @param {Object} scriptContext
           * @param {Record} scriptContext.currentRecord - Current form record
           * @param {string} scriptContext.sublistId - Sublist name
           *
           * @since 2015.2
           */
          function lineInit(scriptContext) {
  
          }
  
          /**
           * Validation function to be executed when field is changed.
           *
           * @param {Object} scriptContext
           * @param {Record} scriptContext.currentRecord - Current form record
           * @param {string} scriptContext.sublistId - Sublist name
           * @param {string} scriptContext.fieldId - Field name
           * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
           * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
           *
           * @returns {boolean} Return true if field is valid
           *
           * @since 2015.2
           */
          function validateField(scriptContext) {
  
          }
  
          /**
           * Validation function to be executed when sublist line is committed.
           *
           * @param {Object} scriptContext
           * @param {Record} scriptContext.currentRecord - Current form record
           * @param {string} scriptContext.sublistId - Sublist name
           *
           * @returns {boolean} Return true if sublist line is valid
           *
           * @since 2015.2
           */
          function validateLine(currentRecord) {
  
  
              return true;
          }
  
          /**
           * Validation function to be executed when sublist line is inserted.
           *
           * @param {Object} scriptContext
           * @param {Record} scriptContext.currentRecord - Current form record
           * @param {string} scriptContext.sublistId - Sublist name
           *
           * @returns {boolean} Return true if sublist line is valid
           *
           * @since 2015.2
           */
          function validateInsert(scriptContext) {
  
          }
  
          /**
           * Validation function to be executed when record is deleted.
           *
           * @param {Object} scriptContext
           * @param {Record} scriptContext.currentRecord - Current form record
           * @param {string} scriptContext.sublistId - Sublist name
           *
           * @returns {boolean} Return true if sublist line is valid
           *
           * @since 2015.2
           */
          function validateDelete(scriptContext) {
  
          }
  /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {
            return false;
        }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {
            return false;
        }
  
          /**
           * Validation function to be executed when record is saved.
           *
           * @param {Object} scriptContext
           * @param {Record} scriptContext.currentRecord - Current form record
           * @returns {boolean} Return true if record is valid
           *
           * @since 2015.2
           */
          function saveRecord(context) {

            currentRecord = context.currentRecord;
            log.audit("currentRecord",currentRecord);

            var POID = currentRecord.getValue({
                fieldId: 'custpage_prchaseorderid'
            });
            var typetransaction = currentRecord.getValue({
                fieldId: 'custpage_typetransaction'
            });
            var memo = currentRecord.getValue({
                fieldId: 'custpage_memo'
            });
            console.log(POID);

            var sublistCount = currentRecord.getLineCount({
                sublistId: 'custpage_records'
            });


//======================================================================================

                // *** USING THE RECORD MODULE ***
                var itemReceipt = record.transform({
                    fromType: typetransaction,
                    fromId: POID,
                    toType: record.Type.ITEM_RECEIPT,
                    isDynamic: true
                });

                itemReceipt.setValue({
                    fieldId: 'memo',
                    value: memo
                });

                var _loop = function _loop(i) {

                    itemReceipt.selectLine({
                        "sublistId": "item",
                        "line": i
                    });

                    var requiredQuantity = itemReceipt.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantityremaining'
                    });

                    var lineid = itemReceipt.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'line'
                    });
                    var itemt = itemReceipt.getCurrentSublistText({
                        sublistId: 'item',
                        fieldId: 'item'
                    });
                    var binitem = itemReceipt.getCurrentSublistText({
                        sublistId: 'item',
                        fieldId: 'binitem'
                    });
                    console.log("lineid: " + lineid);
                    console.log("itemt: " + itemt);
                    var lineNumber = currentRecord.findSublistLineWithValue({
                        sublistId: 'custpage_records',
                        fieldId: 'custrecordml_lineid',
                        value: lineid
                    });
                    console.log("linenumber: " + lineNumber);

                    if (lineNumber!=-1) {

                  
                        var selec = currentRecord.getSublistValue({
                            sublistId: 'custpage_records',
                            fieldId: 'custrecordml_selected',
                            line: lineNumber
                        });
                        var item = currentRecord.getSublistValue({
                            sublistId: 'custpage_records',
                            fieldId: 'custrecordml_itemid',
                            line: lineNumber
                        });
                       
                        var binlocation = currentRecord.getSublistValue({
                            sublistId: 'custpage_records',
                            fieldId: 'custrecordml_bin',
                            line: lineNumber
                        });
                        var qty = currentRecord.getSublistValue({
                            sublistId: 'custpage_records',
                            fieldId: 'custrecordml_qty',
                            line: lineNumber
                        });
                        console.log(selec);
                        if (!selec) {qty="";}
                        itemReceipt.setCurrentSublistValue({ // Set qty for line
                             sublistId: 'item',
                             fieldId: 'itemreceive',
                             value: selec
                         });
                        console.log(qty);
                        itemReceipt.setCurrentSublistValue({ // Set qty for line
                            sublistId: 'item',
                            fieldId: 'quantity',
                            value: qty
                        });
                        console.log(binitem);
                        if (selec && binitem=="T") 
                        {


                            var subrecord = itemReceipt.getCurrentSublistSubrecord({
                                sublistId: 'item',
                                fieldId: 'inventorydetail'
                                });
                            console.log(subrecord);

                           // Add a line to the subrecord's inventory assignment sublist.
                           var newline=subrecord.selectNewLine({
                                sublistId: 'inventoryassignment'
                            });
                            console.log(newline);
                            subrecord.setCurrentSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'binnumber', 
                                value: binlocation
                                });
                            

                            console.log(binlocation);
                            subrecord.setCurrentSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'quantity',
                                value: qty
                                });

                            // Save the line in the subrecord's sublist.
                            subrecord.commitLine({
                                sublistId: 'inventoryassignment'
                            });
                        }

                         // Save the line in the record's sublist
                        itemReceipt.commitLine({
                            sublistId: 'item'
                        });

                     

                    }

                }
                console.log("sublistCount: " +sublistCount);
                var itemReceiptLineCount = itemReceipt.getLineCount('item');
                for (var i = 0; i < itemReceiptLineCount; i += 1) {
                    _loop(i);
                }

                
                var itemReceiptID = itemReceipt.save(); // Attempting to save the record
                try {
                    
                    log.debug("New Item Receipt ID", itemReceiptID);
                    message.create({
                        title: "Success",
                        message: "Item receipt has been created successfully",
                        type: message.Type.CONFIRMATION
                    }).show();
                    
                    function success(result) { console.log('Success with value: ' + result) } 
                    function failure(reason) { console.log('Failure: ' + reason) } 

                    dialog.alert({ 
                    title: 'Nice Job!!!', 
                    message: 'Item Receipt has been created successfully, please Click OK to continue.' 
                    }).then(success).catch(failure); 
                    
                   
                   return true;
                } catch (e) {
                    message.create({
                        title: "Error",
                        message: "Item receipt has not been created, please contact administrator " + e.name + " - " + e.message,
                        type: message.Type.ERROR
                    }).show();
                    log.error("Not able to save new Item Receipt - " + e.name, e.message);
                }

//======================================================================================

           
            // return true;
    
            }  
        return {
            pageInit: pageInit,
            printrn : printrn ,
            unmarkall: unmarkall,
            markall: markall,
            fieldChanged: fieldChanged,
            godashboard: godashboard,
            gohelp: gohelp,
            saveRecord: saveRecord,
            validateInsert: validateInsert,
            validateDelete: validateDelete,
            sublistChanged: sublistChanged
        }
    })
