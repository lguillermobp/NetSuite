/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(["N/runtime","N/currentRecord", "N/error", "/SuiteScripts/Modules/generaltoolsv1.js"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (runtime,currentRecord, error, GENERALTOOLS) {
        function pageInit() {
        }

        function printPriorityOrders(locationId) {
            var currRec = currentRecord.get();

            var STARTING_DOCUMENT_NUMBER = currRec.getText({
                fieldId: "custpage_starting_document_number"
            });
            var NUMBER_OF_PRIORITY_ORDERS = currRec.getText({
                fieldId: "custpage_number_of_priority_orders"
            });

            var STATUS_PRINTED = currRec.getValue({
                fieldId: "custpage_status_printed"
            }) === true ? "true" : "false";

            var batchcode = currRec.getText({
                fieldId: "custpage_batch_lot_code"
            });

            if (STATUS_PRINTED == "true") {
                var userObj = runtime.getCurrentUser();
                var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
                var initials = paramemp.data.getValue({fieldId: "initials"});

                var d = new Date();
                var ydate = d.getFullYear();
                var mdate = d.getMonth() + 1;
                var ddate = d.getDate();
                var hdate = d.getHours();
                var tdate = d.getMinutes();
                var sdate = d.getSeconds();
                var mdate = mdate < 10 ? '0' + mdate.toString() : mdate.toString();
                var ddate = ddate < 10 ? '0' + ddate.toString() : ddate.toString();
                var hdate = hdate < 10 ? '0' + hdate.toString() : hdate.toString();
                var tdate = tdate < 10 ? '0' + tdate.toString() : tdate.toString();
                var sdate = sdate < 10 ? '0' + sdate.toString() : sdate.toString();

                var fecha = ydate + mdate + ddate + hdate + tdate + sdate;
                var batchcode = initials + '_' + fecha;

                currRec.setValue({
                    fieldId: "custpage_batch_lot_code",
                    value: batchcode
                });
            }
            // call RenderPriorityPrintPDF.js (1941)
            var url = "/app/site/hosting/scriptlet.nl?script=1941&deploy=1";
            url += "&location=" + locationId;
            url += "&startingDocumentNumber=" + STARTING_DOCUMENT_NUMBER;
            url += "&numberOfPriorityOrders=" + NUMBER_OF_PRIORITY_ORDERS
            url += "&status_printed=" + STATUS_PRINTED
            url += "&batch_code=" + batchcode
            window.open(url, "_blank")
        }

        return {
            pageInit: pageInit,
            printPriorityOrders: printPriorityOrders,
        }
    })
