/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(["N/search",'N/log', "N/file", "N/http", "N/xml", "N/error", "N/task"],
    /**
     *
     * @param search
     * @param file
     * @param http
     * @param xml
     * @param error
     * @param base
     */
    function (search, log, file, http, xml, error, task) {
        function onRequest(context) {

            var request = context.request;
            var response = context.response;

            if (context.request.method === http.Method.POST) {

                var datapost = JSON.parse(request.body);
                
                var WO_ID = datapost.woid;
                var DATE_PO = datapost.datepo;
                var MEMO = datapost.memo;
                var DATAPPD = datapost.data;

                log.audit("WO_ID", WO_ID);
                log.audit("DATE_PO", DATE_PO);
                log.audit("MEMO", MEMO);
                log.audit("DATAPPD", DATAPPD);

               
                var scriptTask_mr = task.create({taskType: task.TaskType.MAP_REDUCE});
                // call ScheduledIFPrintCode.js (2085)
                scriptTask_mr.scriptId = "customscriptschedulegenerate_wopo_mr";
                scriptTask_mr.deploymentId = 'customdeploy1';
                scriptTask_mr.params = {
                    custscript_wopo_woid: WO_ID,
                    custscript_wopo_datepo: DATE_PO,
                    custscript_wopo_memo: MEMO,
                    custscript_wopo_data: DATAPPD
                };
                var scriptTaskId = scriptTask_mr.submit();

                var myTaskStatus = task.checkStatus({
                    taskId: scriptTaskId
                });
               
                context.response.renderPdf("Processing");
                
               
            }
        }

        return {onRequest: onRequest}
    })
