/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 * @NScriptId customscript_GenerateMasterLabels_wo
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

                var scriptTask = task.create({taskType: task.TaskType.MAP_REDUCE});
                // call customscript_generatemasterlabelsmr_wo.js (2341)
                scriptTask.scriptId = "customscript_generatemasterlabelsmr_wo";
                scriptTask.deploymentId = 'customdeploy1';
                scriptTask.params = {custscript_mrwoid: WOID, custscript_mrstartsscc:startsscc, custscript_mrstartcases:startcases};
                var scriptTaskId = scriptTask.submit();




            }
        }

        return {onRequest: onRequest}
    })
