/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@NModuleScope Public
 */

define(['../fulfillment/Fulfillment', 'N/log'],
    function (DAO, log) {


        var totrec=0;
        var getInputData = function getInputData(context) {
            var recordsToProcess=DAO.searchPendingCustomFulFillOrders;
            log.debug('Total Records: ', recordsToProcess());

            return recordsToProcess();
        };

        var map = function map(context) {
            var customFulfillRecordId = context.key;
            var customFulfillRecord = JSON.parse(context.value);
            context.write(customFulfillRecordId, customFulfillRecord);
            return totrec;
        };

        var reduce = function reduce(context) {

          	var ojson=context;
            log.debug('ojson: ', ojson);
            var customFulfillOrdersRecord = JSON.parse(context.values[0]);

            DAO.createItemFulfillment(customFulfillOrdersRecord);

            context.write(context.key, customFulfillOrdersRecord);
        };

        var summarize = function summarize(context) {

        };

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });