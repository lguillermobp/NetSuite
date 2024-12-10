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
                const PPD_ID = base.validateLocationId(context.request.parameters.ppdid);
                const DATE_PO = base.validateDate(context.request.parameters.datepo);
                const MEMO = base.validateMemo(context.request.parameters.memo);
                const DATAPPD = base.validateData(context.request.parameters.datappd);
               
                    var scriptTask_mr = task.create({taskType: task.TaskType.MAP_REDUCE});
                    // call ScheduledIFPrintCode.js (2085)
                    scriptTask_mr.scriptId = "customscript_schedulegenerate_poo_mr";
                    scriptTask_mr.deploymentId = 'customdeploy1';
                    scriptTask_mr.params = {
                        custscript_ppdid: PPD_ID,
                        custscript_datepo: DATE_PO,
                        custscript_memo: MEMO,
                        custscript_data: DATAPPD
                    };
                    var scriptTaskId = scriptTask_mr.submit();


                const xmlString = base.createXmlString(salesOrderData, LOCATION_ID,STATUS_PRINTED,BATCH_CODE);

                context.response.renderPdf("Processing");
               
            }
        }

        return {onRequest: onRequest}
    })
