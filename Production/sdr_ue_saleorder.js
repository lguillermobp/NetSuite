/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/format', 'N/record', 'N/log', 'N/ui/serverWidget', "N/runtime", "/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/Modules/helptools.js"], function (format, record, log, serverWidget, runtime, GENERALTOOLS, HELPTOOLS) {

    /**
     * Function triggered before a record is submitted.
     * @param {Object} context - The context object containing information about the record being processed.
     * @param {Record} context.newRecord - The new record being submitted.
     * @param {Record} context.oldRecord - The old record before being edited.
     * @param {string} context.type - The operation type (create, edit, delete, xedit, approve, reject, cancel, pack, ship, invoice, reassign, editforecast, revalue, editord, editapprove, reestimatetotal, reestimateresource, reschedule, editcancelled, editrejected).
     */
    function beforeLoad(context) {
        log.debug("context", context);

        var userObj = runtime.getCurrentUser();
        var userID = userObj.id;
        var userPermission = userObj.getPermission({ name: 'TRAN_SALESORD' });
        autSO = userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;


        if (context.type === context.UserEventType.VIEW) {
            var entity = context.newRecord.getValue({ fieldId: 'entity' });
            var id = context.newRecord.getValue({ fieldId: 'id' });

            const printSuitelet = "/app/site/hosting/scriptlet.nl?script=2587&deploy=1&idso=" + id;

            context.form.addButton({
                id: "custpage_gml",
                label: "Sales Contract Statement",
                functionName: "window.open('" + printSuitelet + "');"
            })

            const printSuitelet1 = "/app/site/hosting/scriptlet.nl?script=1619&deploy=1&id=" + id;

            context.form.addButton({
                id: "custpage_scf",
                label: "Sale Contract form",
                functionName: "window.open('" + printSuitelet1 + "');"
            })
            if (autSO == "FULL") {
                log.audit({ title: "autSO", details: autSO });
                const printSuitelet3 = "/app/site/hosting/scriptlet.nl?script=2571&deploy=1&idso=" + id;

                context.form.addButton({
                    id: 'custpage_copysc',
                    label: 'Import from Sale Contract',
                    functionName: "window.open('" + printSuitelet3 + "');"
                });
            }

            const printSuitelet4 = "/app/accounting/transactions/custom.nl?customtype=104&soid=" + id;

            context.form.addButton({
                id: 'custpage_copydeposit',
                label: 'ECD Customer Deposit',
                functionName: "window.open('" + printSuitelet4 + "');"
            });
            var form = context.form;
            sublist1 = form.getSublist({ id: 'recmachcustrecord_cd_sc' });
            log.debug("sublist1.type", sublist1.type);

            const printSuitelet2 = "/app/site/hosting/scriptlet.nl?script=1620&deploy=1&id=" + id;

            sublist1.addButton({
                id: 'custpage_printcd',
                label: 'Print Crib Design',
                functionName: "window.open('" + printSuitelet2 + "');"
            });

            var paid = Number(context.newRecord.getValue({ fieldId: "custbody_ecd_amountpaid" }));
            var balance = Number(context.newRecord.getValue({ fieldId: "custbody_ecd_balance" }));
            var total = Number(balance - paid);
            var ppaid;
            if (total === 0) {
                ppaid = 0;
            } else {
                ppaid = Number(Math.abs((paid / total) * 100));
            }



            var fpaid = format.format({ value: paid, type: format.Type.CURRENCY });

            var fbalance = format.format({ value: balance, type: format.Type.CURRENCY });

            var ftotal = format.format({ value: total, type: format.Type.CURRENCY });

            var fppaid = format.format({ value: ppaid.toFixed(3), type: format.Type.PERCENT });
            // Code to be executed when the page loads

            ecdsummary = ' <style>#ecdsummary table  {  border: 1px solid black;  border-collapse: collapse} #ecdsummary th  {   font-size: 14px;   padding: 5px;   text-align:right;}#ecdsummary thead th {   font-size: 18px;   text-align:center;}#ecdsummary td  {  font-size: 14px;; padding: 5px;  text-align:right;}</style>'

            ecdsummary += '<table id="ecdsummary"> <thead> <tr> <th colspan="2" align="center" bgcolor="#000000" style="color: #F1E4E4" scope="col">ECD Summary</th> </tr></thead><tbody> <tr> <th width="47%" align="right" scope="row">ECD Total</th> <td width="53%" align="right">[TOTAL]</td> </tr><tr> <th align="right" scope="row">ECD Amount Paid</th> <td align="right">[PAID]</td> </tr> <tr> <th align="right" scope="row">% Paid</th> <td align="left">[PPAID]</td> </tr> <tr> <th align="right" scope="row">Final Balance Due</th> <td align="right">[BALANCE]</td> </tr> </tbody></table>';
            ecdsummary = ecdsummary.replace("[TOTAL]", ftotal);
            ecdsummary = ecdsummary.replace("[PAID]", fpaid);
            ecdsummary = ecdsummary.replace("[BALANCE]", fbalance);
            ecdsummary = ecdsummary.replace("[PPAID]", fppaid);

            context.newRecord.setValue("custbody_ecd_summary", ecdsummary);


        }


        if (context.type == "edit") {
            var record1 = context.oldRecord;
            log.debug("record1", record1);
            var record2 = context.newRecord;
            log.debug("record2", record2);
            var form = context.form;

            form.clientScriptModulePath = "./sdr_cs_saleorder.js";

            sublist = form.getSublist({ id: 'recmachcustrecord_salecontract' });

            context.form.addButton({
                id: 'custpage_refresh4',
                label: 'Create Schedule',
                functionName: 'refreshSchedule()'
            });

            sublist1 = form.getSublist({ id: 'recmachcustrecord_cd_sc' });
            log.debug("sublist1.type", sublist1.type);

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

        if (context.type != context.UserEventType.DELETE && context.type != 'xedit') {

            log.debug("context.type", context.type);
            var id;

            if (context.oldRecord) {
                oldamount = context.oldRecord.getValue({ fieldId: 'total' });
                id = context.oldRecord.getValue({ fieldId: 'id' });
                salescontract = context.oldRecord.getValue({ fieldId: 'transactionnumber' });
            }
            else {
                oldamount = 0;
            }

            if (context.newRecord) {
                newamount = context.newRecord.getValue({ fieldId: 'total' });
                id = context.newRecord.getValue({ fieldId: 'id' });
                salescontract = context.newRecord.getValue({ fieldId: 'transactionnumber' });
            }
            else {
                newamount = 0;
            }

            if (context.type === context.UserEventType.DELETE) {
                newamount = 0;
            }

            log.debug("newamount", newamount);
            log.debug("oldamount", oldamount);

            parambal = GENERALTOOLS.set_Balance(id, newamount, oldamount);
            if (newamount != oldamount) {

                log.debug({ title: 'salescontract', details: salescontract });
                var okg = HELPTOOLS.changesc(salescontract);

            }

        }
    }

    function beforeSubmit(context) {

        if (context.type === context.UserEventType.DELETE) {

            log.debug("context.type", context.type);
            var id = context.oldRecord.getValue({ fieldId: 'id' });
            oldamount = context.oldRecord.getValue({ fieldId: 'total' });
            newamount = 0;
            log.debug("newamount", newamount);
            log.debug("oldamount", oldamount);

            parambal = GENERALTOOLS.set_Balance(id, newamount, oldamount);
            ctc_id = context.oldRecord.getValue({ fieldId: "custbody_vecd_ctc_id" });

            if (ctc_id) {
                var opt = "UNSETSC";
                dataall = GENERALTOOLS.postViewECD(ctc_id, opt, 'NA')
            }
        }


        // Your code logic here
    }


    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit,
        beforeSubmit: beforeSubmit
    };
});
