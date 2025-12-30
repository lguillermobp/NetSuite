/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/record", "N/search", "N/runtime","N/log", "/SuiteScripts/Modules/generaltoolsv1.js"], function (record, search, runtime,log, GENERALTOOLS) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {

        if (context.type === context.UserEventType.VIEW) 
            {
               


                const currentRecordId = context.newRecord.id;
                var paramer = GENERALTOOLS.get_billbalance(currentRecordId);
                log.audit({title: "context.oldRecord", details: context.oldRecord});
                log.audit({title: "paramer", details: paramer});
                log.audit({title: "paramer", details: paramer});
                amaountpaid=paramer.data.amaountpaid;
                amount=paramer.data.amount;
                fxamount=paramer.data.fxamount;
                fxamountpaid=paramer.data.fxamountpaid;
                
                log.audit({title: "amount", details: amount});
                log.audit({title: "amaountpaid", details: amaountpaid});

                log.audit({title: "fxamount", details: fxamount});
                log.audit({title: "fxamountpaid", details: fxamountpaid});

                var vendorBillRecord = record.load({
                    type: record.Type.VENDOR_BILL,
                    id: context.newRecord.id
                });
                
                

                if (fxamount)
                    {
                    balance=fxamount-fxamountpaid;
                    context.newRecord.setValue({fieldId: "custbody_billpaid", value: fxamountpaid});
                    vendorBillRecord.setValue({
                        fieldId: 'custbody_billpaid',
                        value: fxamountpaid
                    });
                    
                    }
                else
                    {
                    balance=amount-amaountpaid;
                    vendorBillRecord.setValue({
                        fieldId: 'custbody_billpaid',
                        value: amaountpaid
                    });
                    }
                vendorBillRecord.setValue({
                    fieldId: 'custbody_billbalance',
                    value: balance
                });
        //vendorBillRecord.save();

        

                log.audit({title: "balance", details: balance});

            }
            if (context.type === context.UserEventType.VIEW || context.type === context.UserEventType.EDIT) {
                // Check if the bill needs approval (e.g., custom 'custbody_approval_status' field is 'Pending')
                const currentRecord = context.newRecord;
                const approvalStatus = currentRecord.getValue('statusRef'); // Your Custom Field
                const nextapproval = currentRecord.getValue('nextapprover'); 
                const currentUser = runtime.getCurrentUser();
                const currentUserId = currentUser.id;
                log.audit({title: "currentUserId", details: currentUserId});
                log.audit({title: "nextapproval", details: nextapproval});

                if (approvalStatus === 'pendingApproval' && nextapproval==currentUserId) {
                    // Add the Approve button
                    const form = context.form;
                    form.addButton({
                        id: 'custpage_approve_bill_btn',
                        label: 'Approve Vendor Bill',
                        functionName: 'approveBillScript(currentRecord.id)' // Call a Client Script function
                    });

                    // Add a Client Script to handle the button click and submit changes
                    form.clientScriptModulePath = './sdr_cs_vendorbill.js'; // Path to your Client Script
                }
            }

   
    }

    function beforeSubmit(context) {
        // ================================================================================
        // Set Customer PO Number and Sales Order Requested Ship Date
        // ================================================================================
        const currentRecordId = context.newRecord.id;

        

       
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit
    }
})

