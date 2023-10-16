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

        var pendingaprovests;
        function pageInit(context) {

            var currRec = context.currentRecord;
            log.debug("context.mode",context.mode);
            var userObj = runtime.getCurrentUser();
            var userID = userObj.id;
            var paramemp = GENERALTOOLS.get_employee_value(userID);
            pendingaprovests=paramemp.data.getValue({fieldId: "custentity_invoicestspa"});
            log.debug("pendingaprovests",pendingaprovests);
            if (pendingaprovests) { currRec.setValue('approvalstatus', "1"); }



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

            if (context.sublistId == "item" &&  context.fieldId == "rate") {

                var order = context.currentRecord;

                var tranid=context.currentRecord.tranid;

                var origrate = order.getCurrentSublistText({
                    sublistId: 'item',
                    fieldId: 'origrate'
                });
                var rate = order.getCurrentSublistText({
                    sublistId: 'item',
                    fieldId: 'rate'
                });
                if (origrate != rate) {


                    var itemcode = order.getCurrentSublistText({
                        sublistId: 'item',
                        fieldId: 'item'
                    });

                    var options = {
                        title: 'Change of Rate',
                        message: 'Are you sure change the Original Rate?',
                        buttons: [
                            { label: 'Yes', value: 1 },
                            { label: 'No', value: 2 }
                        ]
                    };

                    function success(result) {
                        if (result == 1) {
                            console.log("Thank you. You may proceed.");
                            var userObj = runtime.getCurrentUser();
                            log.debug("userObj",userObj.id);

                            var orderdoc = order.getCurrentSublistText({
                                sublistId: 'item',
                                fieldId: 'orderdoc'
                            });


                            var paramPO = GENERALTOOLS.get_PO_value(orderdoc);
                            var POnumber= paramPO.data.getValue({fieldId: "tranid"});
                            var paramrec = GENERALTOOLS.get_paramnew_value('0101');

                            var recipients= paramrec.data.getValue({name: "custrecordparams_value"});
                            var paramrec = GENERALTOOLS.get_paramnew_value('0102');
                            var subject= paramrec.data.getValue({name: "custrecordparams_value"});
                            var paramrec = GENERALTOOLS.get_paramnew_value('0103');
                            var emailBody= paramrec.data.getValue({name: "custrecordparams_value"});

                            subject = subject.replace("${NEWRATE}", rate);
                            subject = subject.replace("${PO}", POnumber);
                            subject = subject.replace("${ITEM}", itemcode);

                            emailBody = emailBody.replace("${NEWRATE}", rate);
                            emailBody = emailBody.replace("${PO}", POnumber);
                            emailBody = emailBody.replace("${ITEM}", itemcode);


                            email.send({
                                author : userObj.id,
                                recipients : recipients,
                                subject : subject,
                                body : emailBody,
                                relatedRecords : {
                                    transactionId : orderdoc
                                }
                            });





                        } else if (result == 2) {

                            order.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'rate',
                                value: origrate,
                                ignoreFieldChange: true
                            });

                            console.log("This is not acceptable.");
                        } else {
                            console.log("Please try again.");
                        }
                    }
                    function failure(reason) { console.log('Failure: ' + reason) }

                    dialog.create(options).then(success).catch(failure);



                }
            }
            return true;
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
        function validateLine(context) {

            if (context.sublistId == "item") {

                var chgbox = 0;
                var order = context.currentRecord;

                var itemcode = order.getCurrentSublistText({
                    sublistId: 'item',
                    fieldId: 'item'
                });


                log.debug("country", country);


            }
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
            var currRec = context.currentRecord;
            if (pendingaprovests) { currRec.setValue('documentstatus', "D"); }
            return true;


        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
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