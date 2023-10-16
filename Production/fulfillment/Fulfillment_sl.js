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
                const daterun = context.request.parameters.daterun;
                const datetran = context.request.parameters.datetran;


                var scriptTask = task.create({taskType: task.TaskType.SCHEDULED_SCRIPT});
                scriptTask.scriptId = 2063;
                scriptTask.deploymentId = 'customdeploy1';
                scriptTask.params = {custscriptwoid: daterun, custscriptstartsscc:datetran};
                var scriptTaskId = scriptTask.submit();




            }
        }

        return {onRequest: onRequest}
    })
