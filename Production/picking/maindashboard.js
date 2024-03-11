/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search','N/ui/serverWidget','N/log','N/url', 'N/redirect'],
    function (s,serverWidget, log, url, redirect) {
    const onRequest = (scriptContext) => {
        if (scriptContext.request.method === 'GET') {
            let form = serverWidget.createForm({
                title: 'Picking Dashboard'
            });

            let field = form.addField({
                id: 'workorder',
                type: serverWidget.FieldType.INTEGER,
                label: 'Manufacturing Order'
            });


            form.addSubmitButton({
                label: 'Submit'
            });

            scriptContext.response.writePage(form);
        } else {
            var script = 'customscript_dashboard_scanning';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });
            var retval=get_WO_internalID(scriptContext.request.parameters.workorder);
            var idwo=retval.internalid;
            
            suiteletURL += "&idwo=" + idwo;
            log.debug("suiteletURL",suiteletURL);
            redirect.redirect({ url: suiteletURL });


        }
    }
        function get_WO_internalID(so) {

            var internalid;

            var fsearch = s.create({
                type: "workorder",
                filters:
                    [
                        ["number","equalto",so],
                        "AND",
                        ["type","anyof","workorder"],
                        "AND",
                        ["mainline","is","T"]
                    ],
                columns:
                    [
                        "mainline",
                        "tranid",
                        "internalid"
                    ]
            });

            var pagedData = fsearch.runPaged({
                "pageSize": 1000
            });

            pagedData.pageRanges.forEach(function (pageRange) {

               var page = pagedData.fetch({index: pageRange.index});

               page.data.forEach(function (fresult) {

                    internalid = fresult.getValue({name: "internalid"});
                    retval = {
                       "internalid": internalid
                    }

                });

            })

            return retval;
        }


    return {onRequest}
});

