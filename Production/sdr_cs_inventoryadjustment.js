/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
var country;
define(["N/runtime","N/email","N/ui/dialog", "N/ui/message","N/log","N/record", "/SuiteScripts/Modules/generaltoolsv1.js"],

    function(runtime,email,dialog,message,log, r, GENERALTOOLS) {

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
            var currentRecord = context.currentRecord;
            log.debug("context.mode",context.mode);
            log.debug("context.currentRecord",context.currentRecord);

            var lineCount = currentRecord.getLineCount({
                sublistId: 'inventory'
            });

            log.debug("lineCount",lineCount);



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
            //finalResult and finalResultSet are global variables
            //accessible by all functions

            //User provided final answer from confirm box
        var finalResult = false
        var itemcode;
        //Flag to indicate if user provided final answer or not
        finalResultSet = false;
        var tranid;

        //Save record trigger
        function validateLine(context) {
            //If user have never provided a final answer,
            if (context.sublistId == "inventory") {

                var order = context.currentRecord;

                tranid = context.currentRecord.tranid;

                var unitcost = order.getCurrentSublistText({
                    sublistId: 'inventory',
                    fieldId: 'unitcost'
                });
                var avgunitcost = order.getCurrentSublistText({
                    sublistId: 'inventory',
                    fieldId: 'avgunitcost'
                });
                log.debug("unitcost",unitcost);

                if (unitcost <= 0) {


                        itemcode = order.getCurrentSublistText({
                        sublistId: 'inventory',
                        fieldId: 'item'
                    });

                    if (!finalResultSet) {
                        //Here you do your own saveRecord validation/automation.
                        //.....
                        //.....
                        //.....
                        //During validation/automation,
                        //	if something fails, you would return false
                        //	which will never get to below line.

                        //If everything pases, show the dialog box

                        dialog.confirm({
                            'title': 'Unit Cost in Zeros',
                            'message': 'Are you sure that Unit Cost must be Zeros?'
                        }).then(success).catch(fail);
                    }
                    //If user provided a final answer from confirm box, return out
                    else {
                        //Reset the finalResultSet flag to false
                        //	in case user selected "Cancel" on the confirm box.
                        finalResultSet = false;

                        //return will either give the control back to user
                        //	or continue with saving of the record
                        return finalResult;
                    }
                }
                else
                {
                    return true;
                }
            }

        }
        function success(result)
        {
            //Sets value of finalResult to user provided answer
            finalResult = result;
            //Updates the finalResultSet flag to true
            //	to indicate that user has made his/her choice
            finalResultSet = true;
            if (result) {
                log.debug("result", result);
                console.log("Thank you. You may proceed.");

                var userObj = runtime.getCurrentUser();
                log.debug("userObj", userObj.id);

                var paramrec = GENERALTOOLS.get_param_value(11);
                var recipientsstr = paramrec.data.getValue({fieldId: "custrecordparams_value"});
                var paramrec = GENERALTOOLS.get_param_value(12);
                var subject = paramrec.data.getValue({fieldId: "custrecordparams_value"});
                var paramrec = GENERALTOOLS.get_param_value(13);
                var emailBody = paramrec.data.getValue({fieldId: "custrecordparams_value"});

                const recipients = recipientsstr.split(',');
                log.debug("recipients", recipients);

                subject = subject.replace("${tranid}", tranid);
                subject = subject.replace("${ITEM}", itemcode);

                emailBody = emailBody.replace("${tranid}", tranid);
                emailBody = emailBody.replace("${ITEM}", itemcode);

                email.send({
                    author: userObj.id,
                    recipients: recipients,
                    subject: subject,
                    body: emailBody
                });

            }
            getNLMultiButtonByName('multibutton_submitter').onMainButtonClick(this);
        }
        function fail(reason)
        {
            return false;
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
            log.audit({
                title: 'Enter saveRecord',
                details: 'Success!'
            });
            var currentRecord = context.currentRecord;
            log.debug("currentRecord",currentRecord);
            var lineCount = currentRecord.getLineCount({
                sublistId: 'inventory'
            });
            var errors = [];

            log.debug("lineCount",lineCount);

            for (var slLine = 0; slLine < lineCount; slLine++) {
                currentRecord.selectLine({
                    sublistId: 'inventory',
                    line: slLine
                });
                log.debug("slLine",slLine);

                var itemid = currentRecord.getSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'item',
                    line: slLine
                });

                var paramItem = GENERALTOOLS.get_item_value(itemid);
                try {
                    var item= paramItem.data.getValue({fieldId: "itemid"});
                }
                catch (e) {
                    log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});

                }


                log.debug("item",item);

                var bin = currentRecord.getSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'binitem',
                    line: slLine
                });

                log.debug("bin",bin);

                var itemReceive = currentRecord.getSublistValue({
                    sublistId: 'inventory',
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
                        sublistId: 'inventory',
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
            log.debug("errors.length",errors.length);
            console.log('errors', errors);

            if (errors.length > 0) {
                log.debug("errors",errors);
                //displayErrors(errors);
                return false;
            }


            return true;

        }

        return {
            pageInit: pageInit,
            //fieldChanged: fieldChanged,
            //postSourcing: postSourcing,
            //sublistChanged: sublistChanged,
            //lineInit: lineInit,
            //validateField: validateField,
            validateLine: validateLine,
            //validateInsert: validateInsert,
            //validateDelete: validateDelete,
            saveRecord: saveRecord
        };

    });