/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 * @NScriptId customscript_DeleteMasterLabels_wo
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
                
                log.debug("WOID",WOID);

                var scriptTask = task.create({taskType: task.TaskType.SCHEDULED_SCRIPT});
                // call ScheduledDeleteMasterLabels.js (2391)
                scriptTask.scriptId = "customscript_scheduleddeleteml_wo";
                scriptTask.deploymentId = 'customdeploy1';
                scriptTask.params = {custscriptwoiddelete: WOID};
                var scriptTaskId = scriptTask.submit();




            }
        }

        return {onRequest: onRequest}
    })
