/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(["N/search", "N/file", "N/http", "N/xml", "N/error",  "./Base.js"],
    /**
     *
     * @param search
     * @param file
     * @param http
     * @param xml
     * @param error
     * @param base
     */
    function (search, file, http, xml, error,  base) {
        function onRequest(context) {
            if (context.request.method === http.Method.GET) {
                const LOCATION_ID = base.validateLocationId(context.request.parameters.location);
                const NUMBER_OF_PRIORITY_ORDERS = Number(context.request.parameters.numberOfPriorityOrders);
                const STARTING_DOCUMENT_NUMBER = String(context.request.parameters.startingDocumentNumber);
                const ALLOW_PARTIAL_SHIPPING = context.request.parameters.allowPartialShipping === "true";

                let salesOrderData = base.getSalesOrderData(LOCATION_ID, STARTING_DOCUMENT_NUMBER);
               /* salesOrderData = base.prioritizeSalesOrderData(salesOrderData); */
                salesOrderData = base.pivotSalesOrderData(LOCATION_ID, salesOrderData,NUMBER_OF_PRIORITY_ORDERS,ALLOW_PARTIAL_SHIPPING);
                /*salesOrderData = base.getTopNumberOfPrioritySalesOrdersAtSouth(NUMBER_OF_PRIORITY_ORDERS,
                 salesOrderData, ALLOW_PARTIAL_SHIPPING);
                 */

                const xmlString = base.createXmlString(salesOrderData, LOCATION_ID);

                context.response.renderPdf({xmlString: xmlString});
            }
        }

        return {onRequest: onRequest}
    })
