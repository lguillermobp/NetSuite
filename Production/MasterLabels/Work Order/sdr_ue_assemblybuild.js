/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/log","N/record", "N/search", "N/runtime", "/SuiteScripts/MasterLabels/Tools/masterlabeltools.js"], function (log,record, search, runtime, MLTOOLS) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {
        log.debug("context",context);
        const currentRecordId = context.newRecord.id;

        if (context.type === context.UserEventType.CREATE) {
            if (context.request.parameters.soid) {
                session.set({name: "soid", value: context.request.parameters.soid})
            }
        }

        if (context.type === context.UserEventType.VIEW) {

            const printSuitelet = `/app/site/hosting/scriptlet.nl?script=2062&deploy=1&idwo=${currentRecordId}`

            context.form.addButton({
                id: "custpage_gml",
                label: "Generate Master Labels",
                functionName: `window.open('${printSuitelet}');`
            })
        }
    }

    function beforeSubmit(context) {

        log.debug("type",context.type);
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
