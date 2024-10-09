/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/runtime",'N/record','N/log','N/ui/serverWidget'], function(runtime,record, log,serverWidget) {
    
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
        var userObj = runtime.getCurrentUser();
		var userID = userObj.id;
		var userPermission = userObj.getPermission({	name : 'TRAN_JOURNALAPPRV'	});
		autAB= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;
        

        if (context.type === context.UserEventType.VIEW) {
           
            

        }
        if(context.type == "create") 
            {
                log.debug("context.type",context.type);
                log.debug("autAB",autAB);
                if (autAB=="FULL") {
                    context.newRecord.setValue({fieldId: 'approved', value: true});
                }
                else {
                    context.newRecord.setValue({fieldId: 'approved', value: false});
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
