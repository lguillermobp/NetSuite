/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/log', 'N/ui/message', 'N/ui/dialog',"N/record"], function (log, nMessage, nDialog, record) {

    var pageInit =function pageInit(context) {


        log.debug("context.mode",context.mode);

        datarec=context.currentRecord;

        createdfrom = datarec.getValue({fieldId: "createdfrom"});
        log.debug("createdfrom",  createdfrom);


        var itemIndex = 0;
        var itemCount = datarec.getLineCount({
            "sublistId": "item"
        });
        log.debug("itemCount",itemCount);

        while (itemIndex < itemCount) {

            log.debug("itemIndex",  itemIndex);
            try {
                datarec.selectLine({
                    "sublistId": "item",
                    "line": itemIndex
                });
            } catch (e) {
                log.debug({  title: "error: ", details: "datarec.selectLine Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
            }  
           
            log.debug("itemCount",  itemCount);
            try {
                var inventorydetailavail = datarec.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: "inventorydetailreq"
                });
            } catch (e) {
                log.debug({  title: "error: ", details: "inventorydetailavail Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
            }
            
            log.debug("inventorydetailavail",  inventorydetailavail);
            if (inventorydetailavail == "T") 
            {

            var varbin="";
            var subRecordInventoryDetail = datarec.getCurrentSublistSubrecord({
                sublistId: 'item',
                fieldId: 'inventorydetail'
            });
            try {
             
            var totalcount = subRecordInventoryDetail.getValue({
                  fieldId: 'totalquantity'
              });
           
             log.debug("totalcount",totalcount);
            } catch (e) {
                log.debug({  title: "error: ", details: "subRecordInventoryDetail Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
            }
            

            if (totalcount>0) {
                var srLineCount = subRecordInventoryDetail.getLineCount({
                    sublistId: 'inventoryassignment'
                });
                
                log.debug("srLineCount",srLineCount);
                if (srLineCount > 0) 
                {
                    
                    subRecordInventoryDetail.selectLine({
                        sublistId: 'inventoryassignment',
                        line: 0
                    });
                    log.debug("srLineCount","here");
                    var binNumber = subRecordInventoryDetail.getCurrentSublistText({
                        sublistId: 'inventoryassignment',
                        fieldId: 'binnumber'
                    });
                    var quantity = subRecordInventoryDetail.getCurrentSublistValue({
                        sublistId: 'inventoryassignment',
                        fieldId: 'quantity'
                    });
                    
                    if (binNumber) {
                        
                    var binRecord = record.load({
                        type: 'bin',
                        id: binNumber 
                    });

                    var binNumbertxt = binRecord.getText({
                        fieldId: 'binnumber'
                    });

                    log.debug("binNumber", binNumber);

                        varbin+= binNumbertxt + " (" + quantity + ") ";
                       
                    }
                }
               

            }
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
            itemIndex++;
        }


       
       

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

  var saveRecord = function saveRecord(context) {
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
  };

  return {
    pageInit: pageInit,
    saveRecord: saveRecord
  };
});