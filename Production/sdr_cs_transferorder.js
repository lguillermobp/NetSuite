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


        function pageInit(context) {


            log.debug("context.mode",context.mode);




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

            if (context.fieldId == 'custbody_saleorder') {

                var currRec = context.currentRecord;
                SOID = currRec.getValue({fieldId: "custbody_saleorder"});
                log.debug("SOID", SOID);
                var paramso = GENERALTOOLS.get_SO_value(SOID);
                var itemsook = searchsoitems(paramso.data, currRec);
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

                var order = context.currentRecord;

                var expectedreceiptdate = order.getCurrentSublistText({
                    sublistId: 'item',
                    fieldId: 'expectedreceiptdate'
                });

                var item = order.getCurrentSublistText({
                    sublistId: 'item',
                    fieldId: 'item'
                });

                log.debug("item",item);
                log.debug("expectedreceiptdate",expectedreceiptdate);

                if (!expectedreceiptdate) {
                    log.debug("error", "error");
                    message.create({
                        title: "Expected Receipt Date",
                        message: item + " must contain a valid date.",
                        type: message.Type.ERROR,
                        duration: 10000
                    }).show();
                    return false;
                }




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


            return true;


        }

        function searchsoitems(paramso,context) {


            var order = paramso;
            var rec = context;

            var itemIndex = 0;
            var itemCount = order.getLineCount({
                "sublistId": "item"
            });
            var today5 = new Date();
            today5.setDate(today5.getDate() + 5);
            log.debug("today5", today5);

            while (itemIndex < itemCount) {


                var item = order.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    "line": itemIndex
                });
                var quantity = order.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    "line": itemIndex
                });
                log.debug("item", item);
                //rec.insertLine({sublistId: "item", line: itemIndex});
                rec.selectNewLine({sublistId: "item"});
                rec.setCurrentSublistValue({sublistId: "item", fieldId: "item", value: item});
                rec.setCurrentSublistValue({sublistId: "item", fieldId: "units", value: "1"});
                rec.setCurrentSublistValue({sublistId: "item", fieldId: "quantity", value: quantity});
                rec.setCurrentSublistValue({sublistId: "item", fieldId: "expectedreceiptdate", value: today5});

                try {
                    rec.commitLine({sublistId: "item", ignoreRecalc: false});

                } catch (e) {
                    log.error("Not able to save new License Plate - " + e.name, e.message);
                    return;
                }


                itemIndex++;
            }
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