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
                type: serverWidget.FieldType.TEXT,
                label: 'Manufacturing Order'
            });


            form.addSubmitButton({
                label: 'Submit'
            });

            scriptContext.response.writePage(form);
        } else {
            var script = 'customscript_dashboard_pl';
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
        function get_WO_internalID(wo) {

            var internalid;
            var retval = {};
            log.debug("wo",wo);
            var fsearch = s.create({
                type: "workorder",
                filters:
                    [
                        ["numbertext","is",wo],
                        "AND",
                        ["type","anyof","WorkOrd"],
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
            log.debug("pagedData",pagedData);
            pagedData.pageRanges.forEach(function (pageRange) {
                log.debug("pageRange",pageRange);
               var page = pagedData.fetch({index: pageRange.index});

               page.data.forEach(function (fresult) {
                log.debug("fresult",fresult);

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

