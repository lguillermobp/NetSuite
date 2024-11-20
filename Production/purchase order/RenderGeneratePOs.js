/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(["N/search", "N/file", "N/http", "N/xml", "N/error", "N/task"],
    /**
     *
     * @param search
     * @param file
     * @param http
     * @param xml
     * @param error
     * @param base
     */
    function (search, file, http, xml, error, task) {
        function onRequest(context) {
            if (context.request.method === http.Method.GET) {
                const LOCATION_ID = base.validateLocationId(context.request.parameters.location);
                const NUMBER_OF_PRIORITY_ORDERS = Number(context.request.parameters.numberOfPriorityOrders);
                const STARTING_DOCUMENT_NUMBER = String(context.request.parameters.startingDocumentNumber);
                const STATUS_PRINTED = context.request.parameters.status_printed === "true";
                const BATCH_CODE = context.request.parameters.batch_code;

             
               
                    var scriptTask_mr = task.create({taskType: task.TaskType.MAP_REDUCE});
                    // call ScheduledIFPrintCode.js (2085)
                    scriptTask_mr.scriptId = "customscriptscheduledgenerat_mr";
                    scriptTask_mr.deploymentId = 'customdeploy1';
                    scriptTask_mr.params = {
                        custscriptsalesorderdata	: salesOrderData,
                        custscriptbatchcode: BATCH_CODE
                    };
                    var scriptTaskId = scriptTask_mr.submit();


                const xmlString = base.createXmlString(salesOrderData, LOCATION_ID,STATUS_PRINTED,BATCH_CODE);

                context.response.renderPdf("Processing");
               
            }
        }

        return {onRequest: onRequest}
    })
