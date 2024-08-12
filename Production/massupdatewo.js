/**
 * @NApiVersion 2.0
 * @NScriptType MassUpdateScript
 */
define(['N/record','N/log','N/search'],
    function(record, log, search) {
        
        function each(params) {
            var rec = record.load({
                type: params.type,
                id: params.id,
                isDynamic: true
            });
            var assemblyitem = rec.getValue({fieldId: 'assemblyitem'});
            var recfrom;
            var internalidfrom = mocopyrecords(assemblyitem);

            if (internalidfrom!=0) {

                recfrom = record.load({
                type: "workorder",
                id: internalidfrom,
                isDynamic: true
                });

            }

            log.debug("recfrom",recfrom);

            if (recfrom) {

                shipcrelines(rec);

                
                var lineCount = recfrom.getLineCount('item');
                log.debug("lineCount",lineCount);
                for(var i = 0; i < lineCount; i++) {
                    recfrom.selectLine({
                        sublistId: 'item',
                        line: i
                    });


                    var item = recfrom.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item'
                    });
                    var quantity = recfrom.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity'
                    });
                    log.debug("item",item);

                    newLine = rec.selectNewLine({
                        sublistId: 'item'
                    });

                    rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: item
                    });

                    rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        value: quantity
                    });

                    rec.commitLine({
                        sublistId: 'item'
                    });

                }
            }


            var lineNumber = rec.findSublistLineWithValue({
                sublistId: 'item',
                fieldId: 'item',
                value: "17845"
            });

            try {  
            var saverec = rec.save();
            log.debug({
                title: 'EACH',
                details: saverec,
            });
        } catch (e) {
            log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});

        }    
        }

        function shipcrelines(rec)
        {
        var lineCount = rec.getLineCount('item');
        log.debug("lineCount",lineCount);
        for(var i = lineCount-1; i > -1; i--) {

            var lineNum = rec.selectLine({
                sublistId: 'item',
                line: i
            });

            try {

                rec.removeLine({
                    sublistId: 'item',
                    line: i
                });
                
                // rec.commitLine({
                //     sublistId: 'item'
                // });

            } catch (e) {
                log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});

            }
            }

        }

        function mocopyrecords(assemblyitem) {

            log.debug("assemblyitem",assemblyitem);

            var fsearch = search.load({
                id: "customsearch_wotobecopied"
            });

            fsearch.filters.push(search.createFilter({
                name: "item",
                operator: "anyof",
                values: [assemblyitem]
            }));
            log.debug("fsearch",fsearch);
            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });
            log.debug("pagedData",pagedData);
            var internalidfrom=0;
            pagedData.pageRanges.forEach(function (pageRange) {
    
                var page = pagedData.fetch({index: pageRange.index});

                page.data.forEach(function (fresult) {

                    internalidfrom = fresult.getValue({name: "internalid"});
                    log.debug("internalidfrom",internalidfrom);
    
                })
            });

            
    
            return internalidfrom;
           
            }

        return {
            each: each,
            shipcrelines:shipcrelines,
            mocopyrecords:mocopyrecords
        };
    }
);