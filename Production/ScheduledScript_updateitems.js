/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/search','N/log','N/record'],

    function(search, log, record) {

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
                type: "inventoryitem",
                filters:
                [
                   ["type","anyof","InvtPart"], 
                   "AND", 
                   ["preferredbin","is","F"], 
                   "AND", 
                   ["binnumber","isnotempty",""]
                ],
                columns:
                [
                   "internalid",
                   search.createColumn({
                      name: "itemid",
                      sort: search.Sort.ASC
                   }),
                   "displayname",
                   "salesdescription",
                   "type",
                   "baseprice",
                   "binnumber",
                   "preferredbin",
                   "preferredlocation",
                   search.createColumn({
                      name: "usesbins",
                      join: "preferredLocation"
                   })
                ]
            });

            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });



            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});

                page.data.forEach(function (fresult) {

                    internalid=fresult.getValue({name: "internalid"});


                        log.debug('fresult', fresult);

                           rec = record.load({
                              type: "inventoryitem",
                              id: internalid,
                              isDynamic: true
                          })
                    
                          var lineCount = rec.getLineCount({
                            sublistId: 'binnumber'
                            });

                        if (lineCount>0)
                        {
                            log.debug('lineCount', lineCount);
                            for (var i = 0; i < lineCount; i++)
                            {
                                rec.selectLine({
                                    sublistId: "binnumber",
                                    line: i
                                });
                               
                                rec.setCurrentSublistValue({
                                        sublistId: 'binnumber',
                                        fieldId: 'preferredbin',
                                        value: true,
                                        ignoreFieldChange: true
                                    });
                               
                                
                                    rec.commitLine({
                                    sublistId: 'binnumber'
                                });
                            }
                        }
                        

                        var saverec = rec.save();
                        log.debug('saverec', saverec);



                })
            })

        }




return {    execute: execute };

});
