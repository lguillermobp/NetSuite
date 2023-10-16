/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/search','N/log','N/record', "/SuiteScripts/Modules/generaltoolsv1.js"],

    function(search, log, record, GENERALTOOLS) {

        /**
         * Definition of the Scheduled script trigger point.
         *
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
         * @Since 2015.2
         */
        function execute(scriptContext) {

            findSaleOrder();

        }
var cont=0;

        function findSaleOrder() {


            var paramrec = GENERALTOOLS.get_param_value(4);
            var itemprom= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var paramrec = GENERALTOOLS.get_param_value(7);
            var startdate= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var paramrec = GENERALTOOLS.get_param_value(8);
            var enddate= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var paramrec = GENERALTOOLS.get_param_value(9);
            var autoff= paramrec.data.getValue({fieldId: "custrecordparams_value"});


            var fsearch = search.create({
                type: "salesorder",
                filters:
                    [
                        ["type","anyof","SalesOrd"],
                        "AND",
                        ["cseg_saleschann_new","anyof","7","2","9"],
                        "AND",
                        ["item","noneof","13852","14457","13857","13242","13871","34","13239","13241"],
                        "AND",
                        ["status","anyof","SalesOrd:B"],
                        "AND",
                        ["mainline","is","F"],
                        "AND",
                        ["tobefulfilled","is","T"],
                        "AND",
                        ["custbodystatusinterface","anyof","@NONE@","1"],
                        "AND",
                        ["trandate","onorafter",startdate]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "memomain",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "tranid",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "trandate",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "location",
                            summary: "COUNT"
                        }),
                        search.createColumn({
                            name: "location",
                            summary: "MAX"
                        }),
                        search.createColumn({
                            name: "formulanumeric",
                            summary: "MAX",
                            formula: "CASE WHEN {item}='B183STEPKIND-SAMPLE' THEN 1 else 0 end"
                        }),
                        search.createColumn({
                            name: "internalid",
                            join: "location",
                            summary: "MAX"
                        })
                    ]
            });

            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });



            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});
                var i;

                page.data.forEach(function (fresult) {

                    internalid=fresult.getValue({name: "internalid",summary: "GROUP"});
                    memo=fresult.getValue({name: "memomain",summary: "GROUP"});
                    trandate=fresult.getValue({name: "trandate",summary: "GROUP"});
                    locationid=fresult.getValue({name: "internalid",join: "location",summary: "MAX"});
                    locationsqt=fresult.getValue({name: "location",summary: "COUNT"});
                    itemdone=fresult.getValue({name: "formulanumeric",summary: "MAX"});

                    if (locationsqt!=0) {


                        log.debug('fresult', fresult);

                           rec = record.load({
                              type: record.Type.SALES_ORDER,
                              id: internalid,
                              isDynamic: true
                          })
                        var salechannel=rec.itemrec.getValue({fieldId: "cseg_saleschann_new"})
                        var location=rec.itemrec.getValue({fieldId: "location"})
                        var shipmethod=rec.itemrec.getValue({fieldId: "shipmethod"})

                        if (itemdone==0) {

                            if (enddate>=trandate) {
                                rec.selectNewLine({sublistId: "item"});
                                rec.setCurrentSublistValue({sublistId: "item", fieldId: "item", value: "17848"});
                                rec.setCurrentSublistValue({sublistId: "item", fieldId: "quantity", value: 1});
                                rec.setCurrentSublistValue({sublistId: "item", fieldId: "location", value: locationid});
                                rec.setCurrentSublistValue({sublistId: "item", fieldId: "amount", value: 0});
                                rec.commitLine({sublistId: "item"});
                            }

                        }
                            position = memo.search("shopifyCartToken");
                        if (position!=-1) {
                            let memonew = memo.substring(0, (position-1));
                            let shopydesc = memo.substring((position));

                            rec.setValue({
                                fieldId: 'memo',
                                value: memonew
                            });
                            rec.setValue({
                                fieldId: 'custbodyshopifycarttoken',
                                value: shopydesc
                            });
                        }

                            rec.setValue({
                            fieldId: 'custbodystatusinterface',
                            value: '2'
                            });
                            cont++;
                            log.debug('cont', cont);
                            rec.save({enableSourcing: true});



                        i++;
                    }
                })
            })

        }




return {    execute: execute };

});
