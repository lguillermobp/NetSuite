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





            var fsearch = search.create({
                type: "assemblyitem",
                filters:
                    [
                        ["isinactive","is","F"],
                        "AND",
                        ["type","anyof","Assembly"],
                        "AND",
                        ["max(assemblyitembillofmaterials.default)","is","F"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "itemid",
                            summary: "GROUP",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "salesdescription",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "type",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "billofmaterials",
                            join: "assemblyItemBillOfMaterials",
                            summary: "MAX"
                        }),
                        search.createColumn({
                            name: "default",
                            join: "assemblyItemBillOfMaterials",
                            summary: "MAX"
                        }),
                        search.createColumn({
                            name: "billofmaterialsid",
                            join: "assemblyItemBillOfMaterials",
                            summary: "MAX"
                        })
                    ]
            });

            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });



            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});

                page.data.forEach(function (fresult) {

                    internalid=fresult.getValue({name: "billofmaterialsid",
                        join: "assemblyItemBillOfMaterials",
                        summary: "MAX"});


                        log.debug('fresult', fresult);

                           rec = record.load({
                              type: "bom",
                              id: internalid,
                              isDynamic: true
                          })
                        log.debug('rec', rec);

                    var lineNumber = rec.findSublistLineWithValue({
                        sublistId: 'assembly',
                        fieldId: 'masterdefault',
                        value: false
                    });


                    rec.selectLine({
                        "sublistId": "assembly",
                        "line": lineNumber
                    });

                    rec.setCurrentSublistValue({
                        sublistId: 'assembly',
                        fieldId: 'masterdefault',
                        value: true,
                        ignoreFieldChange: true
                    });

                    rec.commitLine({sublistId: "assembly"});

                            rec.save({enableSourcing: true});



                })
            })

        }




return {    execute: execute };

});
