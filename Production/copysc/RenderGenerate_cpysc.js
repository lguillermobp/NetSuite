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
                
                var SO_IDORI = datapost.soidori;
                var SO_IDNEW = datapost.soidnew;
                var DATAPPD = datapost.data;

               
                var scriptTask_mr = task.create({taskType: task.TaskType.MAP_REDUCE});
                
                scriptTask_mr.scriptId = "customscriptschedulegenerate_cpysc_mr";
                scriptTask_mr.deploymentId = 'customdeploy1';
                scriptTask_mr.params = {
                    custscript_cpysc_SO_IDORI: SO_IDORI,
                    custscript_cpysc_SO_IDNEW: SO_IDNEW,
                    custscript_cpysc_data: DATAPPD
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
