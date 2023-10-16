/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(["N/currentRecord", "N/error"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (currentRecord, error) {
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
            var ALLOW_PARTIAL_SHIPPING = currRec.getValue({
                fieldId: "custpage_allow_partial_shipping"
            }) === true ? "true" : "false";

            var url = "/app/site/hosting/scriptlet.nl?script=1815&deploy=1";
            url += "&location=" + locationId;
            url += "&startingDocumentNumber=" + STARTING_DOCUMENT_NUMBER;
            url += "&numberOfPriorityOrders=" + NUMBER_OF_PRIORITY_ORDERS
            url += "&allowPartialShipping=" + ALLOW_PARTIAL_SHIPPING
            window.open(url, "_blank")
        }

        return {
            pageInit: pageInit,
            printPriorityOrders: printPriorityOrders,
        }
    })
