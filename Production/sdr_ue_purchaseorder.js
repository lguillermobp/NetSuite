/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/record",'N/log', "N/search", "N/runtime"], function (record, log, search, runtime) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {
        log.debug("context",context);
        const currentRecord = context.newRecord;
        log.debug("currentRecord",currentRecord.getValue({fieldId: "id"}) );
        idpo= currentRecord.getValue({fieldId: "id"});
        const currentRecordId = idpo;
        log.debug("currentRecordId",currentRecordId);
        postatus = context.newRecord.getValue({fieldId: "status"});

        
        const printSuitelet = `/app/site/hosting/scriptlet.nl?script=1788&deploy=1&id=${currentRecordId}`

        context.form.addButton({
            id: "custpage_print", 
            label: "Print Reception Note",
            functionName: `window.open('${printSuitelet}');`
        })

        

        if (postatus == "Approved by Supervisor/Pending Receipt" || postatus == "Pending Billing/Partially Received" || postatus == "Partially Received") {
            const printSuitelet1 = `/app/site/hosting/scriptlet.nl?script=1792&deploy=1&idpo=${currentRecordId}`

            context.form.addButton({
                id: "custpage_ticket", 
                label: "ECD Receiving",
                functionName: `window.open('${printSuitelet1}');`
            })
        }
        
        //context.form.clientScriptModulePath = "./sdr_cs_purchaseorder.js";
    }

    function beforeSubmit(context) {
        
       
    }

    return {
        beforeLoad: beforeLoad
       // beforeSubmit: beforeSubmit
    }
})

