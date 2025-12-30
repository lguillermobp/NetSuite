/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/runtime",'N/record','N/log','N/ui/serverWidget',"/SuiteScripts/Modules/generaltoolsv1.js"], function(runtime,record, log,serverWidget,GENERALTOOLS) {
    
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
        var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
        var supervisor=paramemp.data.getValue({fieldId: "supervisor"});
        log.debug({title: "supervisor", details: supervisor});

        if (context.type === "create" || context.type === context.UserEventType.EDIT) {
            var nextapproval = context.newRecord.getValue('nextapprover');
            if (nextapproval==-1 || nextapproval==null || nextapproval=='') {
                context.newRecord.setValue('nextapprover', supervisor);
                context.newRecord.setValue('memo', supervisor);
                log.debug({title: "Set nextapprover to supervisor", details: supervisor});
            }
        }
        

        if (context.type === context.UserEventType.VIEW || context.type === context.UserEventType.EDIT) {
                // Check if the bill needs approval (e.g., custom 'custbody_approval_status' field is 'Pending')
                const currentRecord = context.newRecord;
                const approvalStatus = currentRecord.getValue('statusRef'); // Your Custom Field
                 nextapproval = currentRecord.getValue('nextapprover'); 
   
                log.audit({title: "nextapproval", details: nextapproval});

                if (approvalStatus === 'pendingApproval' && nextapproval==userID) {
                    // Add the Approve button
                    const form = context.form;
                    form.addButton({
                        id: 'custpage_approve_bill_btn',
                        label: 'Approve Journal Entry',
                        functionName: 'approveJournalScript(currentRecord.id)' // Call a Client Script function
                    });

                    // Add a Client Script to handle the button click and submit changes
                    form.clientScriptModulePath = './sdr_cs_journal.js'; // Path to your Client Script
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
