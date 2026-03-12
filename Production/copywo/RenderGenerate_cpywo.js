/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(["N/search", 'N/log', "N/file", "N/http", "N/xml", "N/error", "N/task"],
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

                var WO_IDORI = datapost.woidori;
                var WO_IDNEW = datapost.woidnew;
                var DATAPPD = datapost.data;


                var scriptTask_mr = task.create({ taskType: task.TaskType.MAP_REDUCE });

                scriptTask_mr.scriptId = "customscriptschedulegenerate_cpywo_mr";
                scriptTask_mr.deploymentId = 'customdeploy1';
                scriptTask_mr.params = {
                    custscript_cpywo_WO_IDORI: WO_IDORI,
                    custscript_cpywo_WO_IDNEW: WO_IDNEW,
                    custscript_cpywo_data: DATAPPD
                };
                var scriptTaskId = scriptTask_mr.submit();

                var myTaskStatus = task.checkStatus({
                    taskId: scriptTaskId
                });

                context.response.renderPdf("Processing");


            }
        }

        return { onRequest: onRequest }
    })
