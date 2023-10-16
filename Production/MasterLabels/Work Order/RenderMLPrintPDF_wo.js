/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 * @NScriptId customscript_RenderMLPrintPDF_wo
 */

define(["N/http", "N/xml",  "./Base_wo.js"],
    /**
     *
     * @param http
     * @param base
     */
    function (http, xml, base) {
        function onRequest(context) {
            if (context.request.method === http.Method.GET) {
                const WOID = Number(context.request.parameters.workorder);


                let listML = base.getMasterLabelsData(WOID);
               /* salesOrderData = base.prioritizeSalesOrderData(salesOrderData); */

                const xmlString = base.createXmlStringForHTML(listML);

                //context.response.renderPdf({xmlString: xmlString});
                context.response.write({ output: xmlString });
            }


        }

        return {onRequest: onRequest}
    })