/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 * @NScriptId customscript_sdr_journalentry
 */

define(["N/record", "N/search", "N/runtime","N/log", "/SuiteScripts/Modules/generaltoolsv1.js"], function (record, search, runtime, log, GENERALTOOLS) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {
        log.debug("bscontext",  context);
        var customerRecord = context.newRecord;

        var itemIndex = 0;
        var itemCount = customerRecord.getLineCount({
            "sublistId": "item"
        });
        log.debug("itemCount",  itemCount);
        while (itemIndex < itemCount) {
            customerRecord.selectLine({
                "sublistId": "item",
                "line": itemIndex
            });

            var externalid = order.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_aftershipexternalid'
            });
            log.debug("bsexternalid",  externalid);
            var quantityreceived = order.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantityreceived'
            });
            log.debug("bsquantityreceived",  quantityreceived);
            itemIndex++
        }

    }

    function afterSubmit(context) {
        log.debug("ascontext",  context);
        var customerRecord = context.newRecord;

        var itemIndex = 0;
        var itemCount = customerRecord.getLineCount({
            "sublistId": "item"
        });

        while (itemIndex < itemCount) {
            customerRecord.selectLine({
                "sublistId": "item",
                "line": itemIndex
            });

            var externalid = order.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_aftershipexternalid'
            });
            log.debug("asexternalid",  externalid);
            var quantityreceived = order.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantityreceived'
            });
            log.debug("asquantityreceived",  quantityreceived);
            itemIndex++
        }

    }

    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit,
    }
})
