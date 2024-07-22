/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/search', 'N/record'],
    function (log, search, record) {

        var y=0;
        var irec=0;
        var getInputData = function getInputData(context) {

            var fsearch = search.create({
                type: "workorder",
            settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
            filters:
            [
                [[["formulatext: CASE WHEN  NVL({item.quantityavailable}, 0)<{quantity}- NVL({quantitycommitted}, 0) THEN 'YES'  ELSE 'NO' END","contains","YES"],"AND",["type","anyof","WorkOrd"],"AND",["mainline","is","F"],"AND",["status","anyof","WorkOrd:B","WorkOrd:D","WorkOrd:A"]],"OR",[["custbody_totalitemsbo","greaterthan","0"],"AND",["mainline","is","T"]]]
            ],
            columns:
            [
                search.createColumn({
                    name: "tranid",
                    summary: "GROUP"
                }),
                search.createColumn({
                    name: "altname",
                    join: "customerMain",
                    summary: "GROUP"
                }),
                search.createColumn({
                    name: "item",
                    summary: "COUNT"
                }),
                search.createColumn({
                    name: "internalid",
                    summary: "GROUP"
                }),
                search.createColumn({
                    name: "formulanumeric",
                    summary: "SUM",
                    formula: "CASE WHEN  {mainline}='*' THEN 0  ELSE 1 END"
                }),
                search.createColumn({
                   name: "custbody_totalitemsbo",
                   summary: "GROUP"
                })
            ]
            });


            return fsearch;
        };

        var map = function map(context) {


            var customFulfillRecordId = context.key;
            var customFulfillRecord = JSON.parse(context.value);
            context.write(customFulfillRecordId, customFulfillRecord);
        };

        var reduce = function reduce(context) {

            var fresult = JSON.parse(context.values[0]);


            var customFulfillOrdersRecord = JSON.parse(context.values[0]);

            totalbo=fresult.values["GROUP(custbody_totalitemsbo)"];
            internalidV=fresult.values["GROUP(internalid)"];
            internalid=internalidV.value;
            boqty=fresult.values["SUM(formulanumeric)"];

            if (boqty!=totalbo)
                {
                log.debug('internalid', internalid);
                log.debug('boqty', boqty);
                rec = record.load({
                    type: record.Type.WORK_ORDER,
                    id: internalid,
                    isDynamic: true
                    })
            
                rec.setValue({
                    fieldId: 'custbody_totalitemsbo',
                    value: boqty
                });

                rec.save({enableSourcing: true});
                }
            
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


