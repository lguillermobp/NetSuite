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

        
        const printSuitelet = `/app/site/hosting/scriptlet.nl?script=1788&deploy=1&id=${currentRecordId}`

        context.form.addButton({
            id: "custpage_print", 
            label: "Print Reception Note",
            functionName: `printrn('${printSuitelet}');`
        })

        context.form.clientScriptModulePath = "./sdr_cs_purchaseorder.js";   
        
    }

    function beforeSubmit(context) {
        
       
    }

    return {
        beforeLoad: beforeLoad
       // beforeSubmit: beforeSubmit
    }
})

