/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(["N/http", "N/xml",  "./Base.js"],
    /**
     *
     * @param http
     * @param base
     */
    function (http, xml, base) {
        function onRequest(context) {
            if (context.request.method === http.Method.GET) {
                const SOID = Number(context.request.parameters.saleorder);


                let listML = base.getMasterLabelsData(SOID);
               /* salesOrderData = base.prioritizeSalesOrderData(salesOrderData); */

                const xmlString = base.createXmlStringForHTML(listML);

                //context.response.renderPdf({xmlString: xmlString});
                context.response.write({ output: xmlString });
            }


        }

        return {onRequest: onRequest}
    })