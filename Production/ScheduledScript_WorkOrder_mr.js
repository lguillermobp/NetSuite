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
                type: "purchaseorder",
                filters:
                    [
                        ["type","anyof","PurchOrd"],
                        "AND",
                        ["mainline","is","F"],
                        "AND",
                        ["status","anyof","PurchOrd:B","PurchOrd:D","PurchOrd:E","PurchOrd:A"],
                        "AND",
                        ["vendor.entityid","startswith",""],
                        "AND",
                        ["item.type","noneof","@NONE@"],
                        "AND",
                        ["max(formulanumeric: CASE WHEN {applyingtransaction.type} = 'Work Order'  THEN {applyingtransaction.internalid} ELSE NULL END)","isnotempty",""]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "trandate",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "mainname",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "tranid",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "shipdate",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "statusref",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "formulatext",
                            summary: "GROUP",
                            formula: "CASE     WHEN {quantityshiprecv} = 0 THEN 'Not Received'     WHEN {quantity} = {quantityshiprecv} THEN 'Fully Received'     WHEN {quantityshiprecv} < ABS({quantity}) THEN 'Partially Received'     WHEN {quantityshiprecv} >ABS({quantity}) THEN 'Over Received'END"
                        }),
                        search.createColumn({
                            name: "formulatext",
                            summary: "GROUP",
                            formula: "CASE   WHEN {quantitybilled} = 0 THEN 'Not Billed'   WHEN {quantitybilled} < {quantity} THEN 'Partially Billed'   WHEN {quantitybilled} = ABS({quantity}) THEN 'Fully Billed'   WHEN {quantitybilled} > ABS({quantity}) THEN 'Over Billed' END"
                        }),
                        search.createColumn({
                            name: "item",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "formulatext",
                            summary: "GROUP",
                            formula: "NVL({item.description}, {item.purchasedescription})"
                        }),
                        search.createColumn({
                            name: "quantitybilled",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "quantityshiprecv",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "custcol_bkms_po_item_exp_ship_date",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "effectiverate",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "custbody_fam_specdeprjrn_rate",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "expectedreceiptdate",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "formulatext",
                            summary: "MAX",
                            formula: "CASE WHEN {applyingtransaction.type} = 'Work Order'  THEN {applyingtransaction.number} ELSE NULL END"
                        }),
                        search.createColumn({
                            name: "formulatext",
                            summary: "MAX",
                            formula: "CASE WHEN {applyingtransaction.type} = 'Work Order'  THEN {applyingtransaction.status} ELSE NULL END"
                        }),
                        search.createColumn({
                            name: "formulanumeric",
                            summary: "MAX",
                            formula: "CASE WHEN {applyingtransaction.type} = 'Work Order'  THEN {applyingtransaction.internalid} ELSE NULL END"
                        })
                    ]
            });




            return fsearch;
        };

        var map = function map(context) {

            log.debug('context.map', context);

            var customFulfillRecordId = context.key;
            var customFulfillRecord = JSON.parse(context.value);
            context.write(customFulfillRecordId, customFulfillRecord);
        };

        var reduce = function reduce(context) {

            var fresult = JSON.parse(context.values[0]);


            var customFulfillOrdersRecord = JSON.parse(context.values[0]);

            internalid=fresult.values["MAX(formulanumeric)"];
            expdate=fresult.values["GROUP(custcol_bkms_po_item_exp_ship_date)"];


            try
            {

            var d = new Date(expdate);

            }
            catch(e) {
                log.error({
                    title: "error",
                    details: "Error Name: " + String(e.name) + " | Error Message: " + String(e.message)
                });
            }

            log.debug('internalid', internalid);
            log.debug('expdate', expdate);
            log.debug('d', d);

            try
            {
                rec = record.load({
                    type: record.Type.WORK_ORDER,
                    id: internalid,
                    isDynamic: true
                })
            }
            catch(e) {
                log.error({
                    title: "error",
                    details: "Error Name: " + String(e.name) + " | Error Message: " + String(e.message)
                });
            }
            try
            {
            rec.setValue({
                fieldId: 'trandate',
                value: d
            });
            }
            catch(e) {
                log.error({
                    title: "error",
                    details: "Error Name: " + String(e.name) + " | Error Message: " + String(e.message)
                });
            }



            try {

                rec.save({enableSourcing: true});
            }
            catch(e) {
                log.error({
                    title: "error",
                    details: "Error Name: " + String(e.name) + " | Error Message: " + String(e.message)
                });
            }



                rec.save({enableSourcing: true});


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


