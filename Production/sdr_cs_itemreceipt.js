/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
var country;
define(["N/ui/message","N/log","N/record", 'N/ui/dialog','N/currentRecord'],

    function(message, log, record, nDialog,currentRecord) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */


        function pageInit(context) {


            log.debug("context.mode",context.mode);

            datarec=context.currentRecord;

            createdfrom = datarec.getValue({fieldId: "createdfrom"});
            log.debug("createdfrom",  createdfrom);


        }
        function printrn(url) {
          console.log(url);
          window.open(url, "_blank");
        }

        function showbin(context) {

          var datarec = currentRecord.get();
          var varbin="";

          console.log(datarec);

          createdfrom = datarec.getValue({fieldId: "createdfrom"});

          var itemIndex = 0;
          var itemCount = datarec.getLineCount({
              "sublistId": "item"
          });
          log.debug("itemCount",itemCount);

          while (itemIndex < itemCount) {
              varbin="";
              console.log(itemIndex);
              
              try {
                  var linelb = datarec.selectLine({
                      "sublistId": "item",
                      "line": itemIndex
                  });
              } catch (e) {
                  log.debug({  title: "error: ", details: "datarec.selectLine Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
              }  
              console.log(linelb);

             



              var inventorydetailavail = datarec.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: "inventorydetailreq"
            });

            console.log(inventorydetailavail);

            var itemreceive = datarec.getCurrentSublistValue({
              sublistId: 'item',
              fieldId: "itemreceive"
            });
           
          
            
            
            if (itemreceive && inventorydetailavail=="T")
            {

              if (datarec.hasCurrentSublistSubrecord({
                sublistId: 'item',
                fieldId: 'inventorydetail'
            }) )
            {
              
                  var subRecordInventoryDetail = datarec.getCurrentSublistSubrecord({
                    sublistId: 'item',
                    fieldId: 'inventorydetail'
                });
                var linetot = subRecordInventoryDetail.getLineCount({
                  "sublistId": "inventoryassignment"
                });
                console.log(linetot);
                console.log(subRecordInventoryDetail);
                try {
                if (linetot > 0) 
                {
                  subRecordInventoryDetail.selectLine({
                    sublistId: 'inventoryassignment',
                    line: 0
                });
              
                var binNumber = subRecordInventoryDetail.getCurrentSublistText({
                    sublistId: 'inventoryassignment',
                    fieldId: 'binnumber'
                });
                console.log(binNumber);
                var quantity = subRecordInventoryDetail.getCurrentSublistValue({
                    sublistId: 'inventoryassignment',
                    fieldId: 'quantity'
                });
                
                if (binNumber) 
                {
                    
                var binRecord = record.load({
                    type: 'bin',
                    id: binNumber 
                });

                var binNumbertxt = binRecord.getText({
                    fieldId: 'binnumber'
                });

                log.debug("binNumber", binNumber);
                
                    varbin+= binNumbertxt + " (" + quantity + ") ";
                    console.log(varbin);

                    if (varbin) {
                      log.debug("varbin",varbin);
                  try {
                          datarec.setCurrentSublistValue({
                              sublistId: 'item',
                              fieldId: 'custcol_binlocationbydefault',
                              value: varbin,
                              ignoreFieldChange: true
                          });
                      } catch (e) {
                          log.debug({  title: "error: ", details: "datarec.setCurrentSublistValue Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
                      }
                  }
                }
                }

            } catch (e) {
              log.debug({  title: "error: ", details: "datarec.selectLine Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
              }  

            }

          }


              itemIndex++;
          }       
         
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
          log.audit("field",context.fieldId);
           
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

            var location = currentRecord.getValue({
                fieldId: 'location'
            });

            var itemIndex = 0;
            var itemCount = currentRecord.getLineCount({
                "sublistId": "item"
            });


            var rec;

            while (itemIndex < itemCount) {
                currentRecord.selectLine({
                    "sublistId": "item",
                    "line": itemIndex
                });
                var inventorydetailavail = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: "inventorydetailavail"
                });
                var itemreceive = currentRecord.getCurrentSublistValue({
                  sublistId: 'item',
                  fieldId: "itemreceive"
                });
                var inventorydetailset = currentRecord.getCurrentSublistValue({
                  sublistId: 'item',
                  fieldId: "inventorydetailset"
                });
              
                
                
                if (itemreceive && inventorydetailavail=="T")
                {
                  log.debug("itemreceive", itemreceive);
                  var subRecordInventoryDetail = currentRecord.getCurrentSublistSubrecord({
                    sublistId: 'item',
                    fieldId: 'inventorydetail'
                });
                  try {
                
                log.debug("subRecordInventoryDetail", subRecordInventoryDetail);
                } catch (e) { console.log(e); }
                console.log(subRecordInventoryDetail);
                if (subRecordInventoryDetail) {
                    var srLineCount = subRecordInventoryDetail.getLineCount({
                        sublistId: 'inventoryassignment'
                    });
                    var itemid = subRecordInventoryDetail.getValue({
                      fieldId: 'item'
                    });
                    log.debug("srLineCount", srLineCount);
                    if (srLineCount > 0) 
                    {
                        
                        subRecordInventoryDetail.selectLine({
                            sublistId: 'inventoryassignment',
                            line: 0
                        });

                        var binNumber = subRecordInventoryDetail.getCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'binnumber'
                        });
                        
                        if (binNumber) {

                            rec = record.load({
                                type: "inventoryitem",
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
                                rec.setCurrentSublistValue({sublistId: "binnumber", fieldId: "location", value: location});
                                rec.setCurrentSublistValue({sublistId: "binnumber", fieldId: "binnumber", value: binNumber});
                                rec.setCurrentSublistValue({sublistId: "binnumber", fieldId: "preferredbin", value: true});
                                rec.commitLine({sublistId: "binnumber"});
                                var saverec = rec.save();
                            }
                        }
                    }
                }
                }
                itemIndex++;
                
            }
            
            log.audit({
                title: 'Enter saveRecord',
                details: 'Success!'
              });
              var currentRecord = context.currentRecord;
              var lineCount = currentRecord.getLineCount({
                sublistId: 'item'
              });
              var errors = [];
          
              for (var slLine = 0; slLine < lineCount; slLine++) {
                currentRecord.selectLine({
                  sublistId: 'item',
                  line: slLine
                });
                var item = currentRecord.getSublistValue({
                  sublistId: 'item',
                  fieldId: 'itemname',
                  line: slLine
                });
                var bin = currentRecord.getSublistValue({
                  sublistId: 'item',
                  fieldId: 'binitem',
                  line: slLine
                });
                var itemReceive = currentRecord.getSublistValue({
                  sublistId: 'item',
                  fieldId: 'itemreceive',
                  line: slLine
                });
                itemReceive = itemReceive === 'F' ? false : itemReceive;
                console.log('item', item);
                console.log('itemBin', bin);
                console.log('itemReceive', itemReceive);
          
                if (bin === 'T' && (itemReceive || itemReceive === 'T')) {
                  var subRecordInventoryDetail = currentRecord.getCurrentSublistSubrecord({
                    sublistId: 'item',
                    fieldId: 'inventorydetail'
                  });
          
                  if (subRecordInventoryDetail) {
                    var srLineCount = subRecordInventoryDetail.getLineCount({
                      sublistId: 'inventoryassignment'
                    });
                    console.log('srLineCount', srLineCount);
                    var binErrors = [];
          
                    if (srLineCount > 0) {
                      for (var srLine = 0; srLine < srLineCount; srLine++) {
                        subRecordInventoryDetail.selectLine({
                          sublistId: 'inventoryassignment',
                          line: srLine
                        });
                        var binNumber = subRecordInventoryDetail.getCurrentSublistValue({
                          sublistId: 'inventoryassignment',
                          fieldId: 'binnumber'
                        });
                        console.log('binName', binNumber);
          
                        if (!binNumber) {
                          binErrors.push({
                            line: srLine + 1,
                            message: 'Bin Number not set!'
                          });
                        }
                      }
          
                      if (binErrors.length > 0) {
                        errors.push({
                          item: {
                            line: slLine + 1,
                            name: item
                          },
                          subRecord: binErrors
                        });
                      }
                    } else {
                      errors.push({
                        item: {
                          line: slLine + 1,
                          name: item
                        },
                        subRecord: 'No Inventory Detail!'
                      });
                    }
                  } else {
                    errors.push({
                      item: {
                        line: slLine + 1,
                        name: item
                      },
                      subRecord: 'No Inventory Detail!'
                    });
                  }
                }
              }
          
              console.log('errors', errors);
          
              if (errors.length > 0) {
                displayErrors(errors);
                return false;
              }
          
              return true;
            
            
        }
        var displayErrors = function displayErrors(errors) {
            var message = '<ul>';
            errors.forEach(function (error) {
              message += "<li>Item Line: ".concat(error.item.line, ", item: ").concat(error.item.name);
        
              if (Array.isArray(error.subRecord)) {
                message += '<ul style="padding: 0 0 10px 15px">';
                error.subRecord.forEach(function (sr) {
                  message += "<li>Inventory Line: ".concat(sr.line, ", message: ").concat(sr.message, "</li>");
                });
                message += '</ul>';
              } else {
                message += "<ul style=\"padding: 0 0 10px 15px\"><li>".concat(error.subRecord, "</li></ul>");
              }
        
              message += '</li>';
            });
            message += '</ul>'; 
            
            // const oMsg = nMessage.create({
            //   title: 'Inventory Detail Error!',
            //   type: nMessage.Type.WARNING,
            //   message,
            // });
            //
            // oMsg.show();
        
            nDialog.alert({
              title: 'Inventory Detail Error!',
              message: message
            }).then(function (success) {
              console.log(success);
            })["catch"](function (failure) {
              console.log(failure);
            });
          };
        return {
            pageInit: pageInit,
            showbin: showbin,
            printrn: printrn,
            fieldChanged: fieldChanged,
            //postSourcing: postSourcing,
            //sublistChanged: sublistChanged,
            //lineInit: lineInit,
            //validateField: validateField,
            //validateLine: validateLine,
            //validateInsert: validateInsert,
            //validateDelete: validateDelete,
            saveRecord: saveRecord
        };

    });