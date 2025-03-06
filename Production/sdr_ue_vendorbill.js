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

