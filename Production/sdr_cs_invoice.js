/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @NScriptId customscript_sdr_cs_transferorder
 *
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
           
            log.debug("context.mode",context.mode);
            var currRec = context.currentRecord;

            var userObj = runtime.getCurrentUser();
            var userID = userObj.id;
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
            pendingaprovests=paramemp.data.getValue({fieldId: "custentity_invoicestspa"});



            SOID = currRec.getValue({fieldId: "createdfrom"});
            log.debug("SOID",SOID);
            var paramso = GENERALTOOLS.get_SO_value(SOID);
            var itembo=searchboitems(paramso.data);
            log.debug("itembo",itembo);
            if (itembo.length>0) {
                if (itembo.length==1) {
                    var msgbo = "Please note the following item is on back order: " + itembo.toString();
                }
                else {
                    var msgbo = "Please note the following items are on back order: " + itembo.toString();
                }
                log.debug("msgbo",msgbo);
                currRec.setValue({fieldId: "message", value: msgbo});
                message.create({
                    title: "Items in Back Order",
                    message: "Customer Message (Comunication) field has been changed to: " +msgbo,
                    type: message.Type.WARNING,
                    duration: 10000
                }).show();
            }


            balance = currRec.getValue({fieldId: "balance"});

            if (balance < 0)
            {
                

                var parammsg = GENERALTOOLS.get_message_value('SYS_00003',userID);
                var msgdes= parammsg.data.getValue({name: "custrecord_msgdes"});
                var msgdes1= parammsg.data.getValue({name: "custrecord_msg_desl"});
                var msgrcv= parammsg.data.getValue({name: "custrecord_msgrcv"});
                var msggra= parammsg.data.getValue({name: "custrecord_msg_severity"});

                message = '<strong>Message:</strong> ' + msgdes + '<br/><br/>';
                message += '<strong>Message 2:</strong> ' + msgdes1 + '<br/><br/>';
                message += '<strong>Recovery:</strong> ' + msgrcv + '<br/><br/>';
                message += '<strong>Severity:</strong> ' + msggra;

                dialog.alert({
                    title: '**Customer has a credit $' + balance +' **',
                    message: message
                }).then(function (success) {
                    console.log(success);
                })["catch"](function (failure) {
                    console.log(failure);
                });
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


            return true;


        }

        function searchboitems(context) {


            var order = context;

            var itemIndex = 0;
            var itemCount = order.getLineCount({
                "sublistId": "item"
            });

            var itembo=[];
            while (itemIndex < itemCount) {

                var quantitybackordered = order.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantitybackordered',
                    "line": itemIndex
                });

                var item = order.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'item_display',
                    "line": itemIndex
                });
                if (quantitybackordered!=0) {
                    itembo.push(item);
                }

                itemIndex++;
            }
            return itembo;
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