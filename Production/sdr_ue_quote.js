/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/log','N/ui/serverWidget'], function(record, log,serverWidget) {
    
    /**
     * Function triggered before a record is submitted.
     * @param {Object} context - The context object containing information about the record being processed.
     * @param {Record} context.newRecord - The new record being submitted.
     * @param {Record} context.oldRecord - The old record before being edited.
     * @param {string} context.type - The operation type (create, edit, delete, xedit, approve, reject, cancel, pack, ship, invoice, reassign, editforecast, revalue, editord, editapprove, reestimatetotal, reestimateresource, reschedule, editcancelled, editrejected).
     */
    function beforeLoad(context) {
        log.debug("context",context);

        if (context.type === context.UserEventType.VIEW) {
            var entity = context.newRecord.getValue({fieldId: 'entity'});
            var id = context.newRecord.getValue({fieldId: 'id'});

            const printSuitelet = "/app/site/hosting/scriptlet.nl?script=1618&deploy=1&customer=" + entity;

            context.form.addButton({
                id: "custpage_gml",
                label: "Customer Statement",
                functionName: "window.open('" + printSuitelet + "');"
            })

            
        }


        
        // Your code logic here
    }
    
    /**
     * Function triggered after a record is submitted.
     * @param {Object} context - The context object containing information about the record being processed.
     * @param {Record} context.newRecord - The new record after being submitted.
     * @param {Record} context.oldRecord - The old record before being edited.
     * @param {string} context.type - The operation type (create, edit, delete, xedit, approve, reject, cancel, pack, ship, invoice, reassign, editforecast, revalue, editord, editapprove, reestimatetotal, reestimateresource, reschedule, editcancelled, editrejected).
     */
    function afterSubmit(context) {
        // Your code logic here
    }
    
    
    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
    };
});
