/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/log','N/ui/serverWidget', "N/runtime"], function(record, log,serverWidget,runtime) {
    
    /**
     * Function triggered before a record is submitted.
     * @param {Object} context - The context object containing information about the record being processed.
     * @param {Record} context.newRecord - The new record being submitted.
     * @param {Record} context.oldRecord - The old record before being edited.
     * @param {string} context.type - The operation type (create, edit, delete, xedit, approve, reject, cancel, pack, ship, invoice, reassign, editforecast, revalue, editord, editapprove, reestimatetotal, reestimateresource, reschedule, editcancelled, editrejected).
     */
    function beforeLoad(context) {
        log.debug("context",context);

        var userObj = runtime.getCurrentUser();
		var userID = userObj.id;
		var userPermission = userObj.getPermission({	name : 'TRAN_SALESORD'	});
		autSO= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;
        

        if (context.type === context.UserEventType.VIEW) {
            var entity = context.newRecord.getValue({fieldId: 'entity'});
            var id = context.newRecord.getValue({fieldId: 'id'});

            const printSuitelet = "/app/site/hosting/scriptlet.nl?script=1618&deploy=1&customer=" + entity;

            context.form.addButton({
                id: "custpage_gml",
                label: "Customer Statement",
                functionName: "window.open('" + printSuitelet + "');"
            })

            const printSuitelet1 = "/app/site/hosting/scriptlet.nl?script=1619&deploy=1&id=" + id;

            context.form.addButton({
                id: "custpage_scf",
                label: "Sale Contract form",
                functionName: "window.open('" + printSuitelet1 + "');"
            })
            if (autSO=="FULL") 
                {
                    log.audit({title: "autSO", details: autSO});
                    const printSuitelet3 = "/app/site/hosting/scriptlet.nl?script=2571&deploy=1&idso=" + id;
                    
                    context.form.addButton({
                        id: 'custpage_copysc',
                        label: 'Import from Sale Contract',
                        functionName: "window.open('" + printSuitelet3 + "');"
                    });
                }

                const printSuitelet4 = "/app/accounting/transactions/custom.nl?customtype=104&soid=" + id;
                    
                context.form.addButton({
                    id: 'custpage_copysc',
                    label: 'ECD Customer Deposit',
                    functionName: "window.open('" + printSuitelet4 + "');"
                });
            var form = context.form;
            sublist1 = form.getSublist({id: 'recmachcustrecord_cd_sc'});
            log.debug("sublist1.type",sublist1.type);

            const printSuitelet2 = "/app/site/hosting/scriptlet.nl?script=1620&deploy=1&id=" + id;
            
            sublist1.addButton({
                id: 'custpage_printcd',
                label: 'Print Crib Design',
                functionName: "window.open('" + printSuitelet2 + "');"
            });


            

        }


        if(context.type == "edit") {
            var record1 = context.oldRecord;
            log.debug("record1",record1);
            var record2 = context.newRecord;
            log.debug("record2",record2);
            var form = context.form;
            
            form.clientScriptModulePath = "./sdr_cs_saleorder.js";

            sublist = form.getSublist({id: 'recmachcustrecord_salecontract'});
            
            context.form.addButton({
                id: 'custpage_refresh4',
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
