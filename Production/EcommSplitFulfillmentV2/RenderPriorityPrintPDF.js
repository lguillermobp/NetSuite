/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(["N/search", "N/file", "N/http", "N/xml", "N/error", "N/task", "./Base.js"],
    /**
     *
     * @param search
     * @param file
     * @param http
     * @param xml
     * @param error
     * @param base
     */
    function (search, file, http, xml, error, task, base) {
        function onRequest(context) {
            if (context.request.method === http.Method.GET) {
                const LOCATION_ID = base.validateLocationId(context.request.parameters.location);
                const NUMBER_OF_PRIORITY_ORDERS = Number(context.request.parameters.numberOfPriorityOrders);
                const STARTING_DOCUMENT_NUMBER = String(context.request.parameters.startingDocumentNumber);
                const STATUS_PRINTED = context.request.parameters.status_printed === "true";
                const BATCH_CODE = context.request.parameters.batch_code;

                let salesOrderData = base.getSalesOrderData(LOCATION_ID, STARTING_DOCUMENT_NUMBER,STATUS_PRINTED,BATCH_CODE);
               /* salesOrderData = base.prioritizeSalesOrderData(salesOrderData); */
                if (salesOrderData.length!=0) {
                salesOrderData = base.pivotSalesOrderData(LOCATION_ID,salesOrderData,NUMBER_OF_PRIORITY_ORDERS,STATUS_PRINTED,BATCH_CODE);

                /*salesOrderData = base.getTopNumberOfPrioritySalesOrdersAtSouth(NUMBER_OF_PRIORITY_ORDERS,
                 salesOrderData, ALLOW_PARTIAL_SHIPPING);
                 */
                if (STATUS_PRINTED==true) {
                    ifrecords = base.prioritizeSalesOrderData(salesOrderData,BATCH_CODE);


/*
                    var scriptTask = task.create({taskType: task.TaskType.SCHEDULED_SCRIPT});
                    // call ScheduledIFPrintCode.js (2085)
                    scriptTask.scriptId = "customscriptscheduledgenerateifprintcode";
                    scriptTask.deploymentId = 'customdeploy1';
                    scriptTask.params = {
                        custscriptcustscriptsalesorderdata	: salesOrderData,
                        custscriptcustscriptbatchcode: BATCH_CODE
                    };
                    var scriptTaskId = scriptTask.submit();

 */

                    var scriptTask_mr = task.create({taskType: task.TaskType.MAP_REDUCE});
                    // call ScheduledIFPrintCode.js (2085)
                    scriptTask_mr.scriptId = "customscriptscheduledgenerat_mr";
                    scriptTask_mr.deploymentId = 'customdeploy1';
                    scriptTask_mr.params = {
                        custscriptsalesorderdata	: salesOrderData,
                        custscriptbatchcode: BATCH_CODE
                    };
                    var scriptTaskId = scriptTask_mr.submit();



                }

                const xmlString = base.createXmlString(salesOrderData, LOCATION_ID,STATUS_PRINTED,BATCH_CODE);

                context.response.renderPdf({xmlString: xmlString});
                }
                else {
                    context.response.renderPdf("NO DATA");

                }
            }
        }

        return {onRequest: onRequest}
    })
