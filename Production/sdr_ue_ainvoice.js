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
        const currentRecordId = context.newRecord.id;

        if (context.type === context.UserEventType.VIEW) {
            var entity = context.newRecord.getValue({fieldId: 'custrecord_ai_customer'});

            const printSuitelet = "/app/site/hosting/scriptlet.nl?script=1618&deploy=1&customer=" + entity;

            context.form.addButton({
                id: "custpage_gml",
                label: "Customer Statement",
                functionName: "window.open('" + printSuitelet + "');"
            })

            const printSuitelet1 = "/app/site/hosting/scriptlet.nl?script=2106&deploy=1&id="+currentRecordId

                context.form.addButton({
                    id: "custpage_print", 
                    label: "PRINT",
                    functionName: "window.open('" + printSuitelet1 + "');"
                })
            

        }
        if(context.type == "edit") 
            {

            
            var form = context.form;
            
            form.clientScriptModulePath = "./sdr_cs_ainvoice.js";

            sublist = form.getSublist({id: 'customrecord_aid'});
            log.debug("sublist",sublist);

            if (sublist) {
                sublist.addButton({
                    id: 'custpage_refresh',
                    label: 'Copy from Statement',
                    functionName: 'copystatement()'
                });
            }
            
            
            
           
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
