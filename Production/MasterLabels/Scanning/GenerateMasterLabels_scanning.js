/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(["N/log", "N/task","N/http", 'N/redirect'],
    /**
     *
     * @param search
     * @param file
     * @param http
     * @param xml
     * @param error
     * @param base
     */
    function (log, task, http, redirect) {
        function onRequest(context) {
            if (context.request.method === http.Method.GET) {

                const WOID = Number(context.request.parameters.workorder);
                const startsscc = Number(context.request.parameters.startsscc);
                const startcases = Number(context.request.parameters.startcases);
                log.debug("WOID",WOID);

                var scriptTask = task.create({taskType: task.TaskType.SCHEDULED_SCRIPT});
                // call ScheduledGenerateMasterLabels.js (2063)
                scriptTask.scriptId = "customscript_scheduledgenerateml_scan";
                scriptTask.deploymentId = 'customdeploy1';
                scriptTask.params = {custscriptwoid: WOID, custscriptstartsscc:startsscc, custscriptstartcases:startcases};
                var scriptTaskId = scriptTask.submit();




            }
        }

        return {onRequest: onRequest}
    })