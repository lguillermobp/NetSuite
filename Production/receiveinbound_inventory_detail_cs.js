'use strict';
/**
 *@NApiVersion 2.x
 *@NModuleScope Public
 *@NScriptType ClientScript
 */

define(['N/log', 'N/ui/message', 'N/ui/dialog', "/SuiteScripts/Modules/generaltoolsv1.js"], function (log, nMessage, nDialog, GENERALTOOLS) {
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
        message += '</ul>'; // const oMsg = nMessage.create({
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
    function pageInit(context) {
        var currentRecord = context.currentRecord;
        log.debug("context.mode",context.mode);
        log.debug("context.currentRecord",context.currentRecord);

        var lineCount = currentRecord.getLineCount({
            sublistId: 'receiveitems'
        });

        log.debug("lineCount",lineCount);


    }

    var saveRecord = function saveRecord(context) {
        log.audit({
            title: 'Enter saveRecord',
            details: 'Success!'
        });
        var currentRecord = context.currentRecord;
        log.debug("currentRecord",currentRecord);
        var lineCount = currentRecord.getLineCount({
            sublistId: 'receiveitems'
        });
        var errors = [];

        log.debug("lineCount",lineCount);

        for (var slLine = 0; slLine < lineCount; slLine++) {
            currentRecord.selectLine({
                sublistId: 'receiveitems',
                line: slLine
            });
            log.debug("slLine",slLine);

            var itemid = currentRecord.getSublistValue({
                sublistId: 'receiveitems',
                fieldId: 'item',
                line: slLine
            });

            var paramItem = GENERALTOOLS.get_item_value(itemid);
            var item= paramItem.data.getValue({fieldId: "itemid"});

            log.debug("item",item);

            var bin = currentRecord.getSublistValue({
                sublistId: 'receiveitems',
                fieldId: 'binitem',
                line: slLine
            });

            log.debug("bin",bin);

            var itemReceive = currentRecord.getSublistValue({
                sublistId: 'receiveitems',
                fieldId: 'receiveitem',
                line: slLine
            });


            log.debug("itemReceive",itemReceive);

            itemReceive = itemReceive === 'F' ? false : itemReceive;
            console.log('item', item);
            console.log('itemBin', bin);
            console.log('itemReceive', itemReceive);

            if (bin === 'T' && (itemReceive || itemReceive === 'T')) {
                var subRecordInventoryDetail = currentRecord.getCurrentSublistSubrecord({
                    sublistId: 'receiveitems',
                    fieldId: 'inventorydetail'
                });

                log.debug("subRecordInventoryDetail",subRecordInventoryDetail);

                if (subRecordInventoryDetail) {
                    var srLineCount = subRecordInventoryDetail.getLineCount({
                        sublistId: 'inventoryassignment'
                    });
                    log.debug("srLineCount",srLineCount);
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
                            log.debug("binName",binNumber);
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