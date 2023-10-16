/**
 * @NApiVersion 2.0
 * @NScriptType MassUpdateScript
 */
define(['N/record','N/log','N/search'],
    function(record, log, search ) {
        function each(params) {
            var rec = record.load({
                type: params.type,
                id: params.id
            });

            var item = rec.getText({
                fieldId: 'assemblyitem'
            });

            var assembly  = search.load({
                id: 'customsearchbom_item_implementation'
            });

            assembly.filters.push(search.createFilter({
                name: "name",
                operator: "anyof",
                values: [item]
            }));


            let pagedData = assembly.runPaged({
                pageSize: 2000
            });


            pagedData.pageRanges.forEach(function (pageRange) {
                var page = pagedData.fetch({index: pageRange.index});
                page.data.forEach(function (result) {
                    var billofmaterialId = result.getValue({name: "billofmaterialsid"});

                });
            });


            var bomrevision  = search.load({
                id: 'customsearchbomrevision_implementation'
            });
            var filterArray = [];
            filterArray.push(['billOfMaterialsRevision','anyof',  billofmaterialId]);
            bomrevision.filterExpression = filterArray;
            var filters = bomrevision.filterExpression;
            var arrResult = bomrevision.run();
            var arrResultSet = arrResult.getRange({	 start: 0 ,   end: 1});
            var billofmaterialRId = searchResult[0].getValue({name :  'internalId'	});


            rec.setValue({
                fieldId: 'billofmaterials',
                value: billofmaterialId,
            });

            rec.setValue({
                fieldId: 'billofmaterialsrevision',
                value: billofmaterialRId,
            });

            var saverec = rec.save();
            log.debug({
                title: 'EACH',
                details: saverec,
            });
        }
        return {
            each: each
        };
    }
);