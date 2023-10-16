/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/record", "N/search", "N/runtime"], function (record, search, runtime) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {
        const currentRecordId = context.newRecord.id;

        if (context.type === context.UserEventType.CREATE) {
            if (context.request.parameters.soid) {
                session.set({name: "soid", value: context.request.parameters.soid})
            }
        }

        if (context.type === context.UserEventType.VIEW) {

            const printSuitelet = `/app/site/hosting/scriptlet.nl?script=2067&deploy=1&idso=${currentRecordId}`

            context.form.addButton({
                id: "custpage_gml",
                label: "Generate Master Labels",
                functionName: `window.open('${printSuitelet}');`
            })
        }
    }


    return {
        beforeLoad: beforeLoad

    }
})
