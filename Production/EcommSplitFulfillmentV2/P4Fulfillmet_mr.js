/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@NModuleScope Public
 */

define(['SuiteScripts/fulfillment/Fulfillment.js', 'N/log'],
    function (DAO, log) {


        var totrec=0;
        var getInputData = function getInputData(context) {
            //var recordsToProcess=DAO.searchPendingCustomFulFillOrdersP4;
            var recordsToProcess1=DAO.searchPendingCustomFulFillOrdersP4new;
            result = recordsToProcess1();

            //const obj = JSON.parse(result);

            return result;
        };

        var map = function map(context) {

            var customFulfillRecordId = context.key;
            var customFulfillRecord = JSON.parse(context.value);
            context.write(customFulfillRecordId, customFulfillRecord);
            return totrec;
        };

        var reduce = function reduce(context) {

            var ojson=context;

            var customFulfillOrdersRecord = JSON.parse(context.values[0]);
            var ending=DAO.createItemFulfillmentnew(customFulfillOrdersRecord);

            context.write(context.key, customFulfillOrdersRecord);


        };

        var summarize = function summarize(summary) {
            log.debug('Summary Time','Total Seconds: '+summary.seconds);
            log.debug('Summary Usage', 'Total Usage: '+summary.usage);
            log.debug('Summary Yields', 'Total Yields: '+summary.yields);

            log.debug('Input Summary: ', JSON.stringify(summary.inputSummary));
            log.debug('Map Summary: ', JSON.stringify(summary.mapSummary));
            log.debug('Reduce Summary: ', JSON.stringify(summary.reduceSummary));

        };

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });