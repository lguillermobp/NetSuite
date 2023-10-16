/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(['N/url',"N/log","N/record", "N/search", "N/runtime", "/SuiteScripts/MasterLabels/Tools/masterlabeltools.js"], function (url,log,record, search, runtime, MLTOOLS) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {
        log.debug("context",context);
        log.debug("type_bl",context.type);
        const currentRecordId = context.newRecord.id;

        if (context.type === context.UserEventType.CREATE) {
            if (context.request.parameters.soid) {
                session.set({name: "soid", value: context.request.parameters.soid})
            }
        }

        if (context.type === context.UserEventType.VIEW) {

            var script = 'customscript_Dashboard_wo';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });


            var urlclient = suiteletURL;



            // call Dashboard.js (2071)

            urlclient += "&idwo=" + currentRecordId;
            

            context.form.addButton({
                id: "custpage_gml",
                label: "Generate Master Labels",
                functionName: `window.open('${urlclient}');`
            })
        }
    }

    function beforeSubmit(context) {

        log.debug("type_bs",context.type);
        if (context.type=="delete")
        {
            const internalid = context.newRecord.id;
            log.debug("internalid", internalid);
            var qtydel = MLTOOLS.delete_ML_WO(internalid);

        }
    }
    function afterSubmit(context) {


    }


    return {
        beforeLoad: beforeLoad,
        beforeSubmit:beforeSubmit,
        afterSubmit:afterSubmit
    }
})
