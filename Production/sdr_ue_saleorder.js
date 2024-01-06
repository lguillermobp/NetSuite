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
        if(context.type == "edit") {
            var record1 = context.oldRecord;
            log.debug("record1",record1);
            var record2 = context.newRecord;
            log.debug("record2",record2);
            var form = context.form;
            
            form.clientScriptModulePath = "./sdr_cs_saleorder.js";

            sublist = form.getSublist({id: 'customsublist420'});
            
            sublist.addButton({
                id: 'custpage_refresh1',
                label: 'Create Schedule',
                functionName: 'refreshSchedule()'
            });

            sublist1 = form.getSublist({id: 'recmachcustrecord_cd_sc'});
            log.debug("sublist1.type",sublist1.type);
            
            sublist1.addButton({
                id: 'custpage_refresh2',
                label: 'Create Crib Design',
                functionName: 'refreshCrib()'
            });
            



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
