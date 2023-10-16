/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
var country;
define(["N/ui/message","N/log","N/record",'N/https', "/SuiteScripts/Modules/generaltoolsv1.js"],

    function(message, log, r, https, GENERALTOOLS) {

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

            log.debug("context.mode",context.mode);

            datarec=context.currentRecord;

            createdfrom = datarec.getValue({fieldId: "createdfrom"});
            ordertype = datarec.getValue({fieldId: "ordertype"});
            log.debug("createdfrom.length", createdfrom.length);

            if (ordertype=="RtnAuth") {

                var RA = r.load({
                    type: "returnauthorization",
                    id: createdfrom,
                    isDynamic: false,
                    defaultValues: null
                });

                memo = RA.getValue({fieldId: "memo"});
                ifrma = memo.substring(0, 4);
                rma = memo.replace("RMA: ", "");

                log.debug("rma", rma);
                log.debug("ifrma", ifrma);

                log.debug("createdfrom", createdfrom);
                log.debug("ordertype", ordertype);

                var itemIndex = 0;
                var itemCount = datarec.getLineCount({
                    "sublistId": "item"
                });
                log.debug("itemCount", itemCount);

                while (itemIndex < itemCount) {
                    datarec.selectLine({
                        "sublistId": "item",
                        "line": itemIndex
                    });

                    var externalid = datarec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_aftershipexternalid'
                    });
                    log.debug("bsexternalid", externalid);
                    var quantityreceived = datarec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity'
                    });
                    log.debug("bsquantityreceived", quantityreceived);

                    if (ifrma == "RMA:") {
                        postAftership1(rma, externalid, quantityreceived)
                    }
                    itemIndex++
                }
            }


            return true;

        }

        function postAftership(rma, externalid, qty) {


            const data = JSON.stringify({
                "items": [
                    {
                        "external_id": externalid,
                        "quantity": qty
                    }
                ],
                "send_notification": true
            });

            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    console.log(this.responseText);
                }
            });

            xhr.open("POST", "https://api.aftership.com/returnscenter/v2/returns/rma/" + rma + "/item-receive-batch");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("as-api-key", "asat_10477bd142bc4e678e169f9897d2eef1");

            valback=xhr.send(data);
            log.debug("valback",  valback);
        }

        function postAftership1(rma, externalid, qty) {



            var headerObj = {
                    "Content-Type": "application/json",
                    "as-api-key": "asat_10477bd142bc4e678e169f9897d2eef1"
                };

            const bodyObj = JSON.stringify({
                "items": [
                    {
                        "external_id": externalid,
                        "quantity": qty
                    }
                ],
                "send_notification": true
            });


            var response = https.post({
                url: "https://api.aftership.com/returnscenter/v2/returns/rma/" + rma + "/item-receive-batch",
                body: bodyObj,
                headers: headerObj
            });
            log.debug("response",  response);

        }

        return {
            pageInit: pageInit,
            //fieldChanged: fieldChanged,
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