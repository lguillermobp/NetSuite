define(['N/search','N/ui/serverWidget','N/log'], function (s, ui, log) {
    /**
     * Example 1; calc
     * @export suitelet-results
     *
     * @author Luis Barrios
     *
     * @requires N/search
     * @requires N/ui/serverWidget
     * @requires N/log
     *
     * @NApiVersion 2.0
     * @ModuleScope SameAccount
     * @NScriptType Suitelet
     *
     */
    var exports= {};

    /**
     * <code>onRequest</code> event handler
     *
     * @governance @
     *
     * @param context
     *        {Object}
     * @param context.request
     *        {ServerRequest} The incoming request object
     * @param context.response
     *        {ServerResponse} The outgoing response object
     *
     * @return {void}
     *
     * @static
     * @function onRequest
     */
    function onRequest(context) {
        log.audit({title: "Calc example"});

        context.response.writePage({
            pageObject: renderList(translate(findCases()))
        });
    }
    function renderList(results) {
        var list = ui.createList({title:"Advanced Bom Listings"});



        list.addButton({
            id: "Custpage btn nextcase",
            label: "Go to Next Case",
            functionName: "goToNextCase"
        });

        list.addColumn({
            id: "itemid",
            type: ui.FieldType.TEXT,
            label:'Item Id'
        });
        list.addColumn({
            id: "billofmaterials",
            type: ui.FieldType.TEXT,
            label:'billofmaterials'
        }); list.addColumn({
            id: "revisionname",
            type: ui.FieldType.TEXT,
            label:'revisionname'
        }); list.addColumn({
            id: "component",
            type: ui.FieldType.TEXT,
            label:'component'
        }); list.addColumn({
            id: "bomquantity",
            type: ui.FieldType.TEXT,
            label:'bomquantity'
        }); list.addColumn({
            id: "baseunits",
            type: ui.FieldType.TEXT,
            label:'baseunits'
        });


        list.addRows({rows:results});
        return list;

    }
    function findCases() {
        var fsearch= s.create({
            type: "item",
            filters:
                [
                    ["type","anyof","Assembly"],
                    "AND",
                    ["assemblyitembillofmaterials.default","is","T"]


                ],


            columns:
                [
                    s.createColumn({
                        name: "itemid",
                        sort: s.Sort.ASC
                    }),
                    "displayname",
                    "salesdescription",
                    "type",
                    s.createColumn({
                        name: "billofmaterialsid",
                        join: "assemblyItemBillOfMaterials"
                    }),
                    s.createColumn({
                        name: "billofmaterials",
                        join: "assemblyItemBillOfMaterials"
                    }),
                    s.createColumn({
                        name: "default",
                        join: "assemblyItemBillOfMaterials"
                    })
                ]

        });

        var pagedData = fsearch.runPaged({
            "pageSize" : 100
        });

        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});
            log.debug("page",page);
            page.data.forEach(function (fresult) {



                log.debug("fresult",fresult);
                billofm=fresult.getText({name: "billofmaterials",
                    join: "assemblyItemBillOfMaterials"});

                sresult=functionssearch(fresult);
                log.debug("sresult",sresult);
            })
        })
        return sresult;
    }
    function resultToObject(results) {
        log.debug('results', results);


        return {
            itemid: results.itemid,
            billofmaterials: results.billofmaterials,
            revisionname: results.revisionname,
            component: results.component,
            bomquantity: results.bomquantity,
            baseunits: results.baseunits

        };

    }

    function functionssearch(fresult) {

        billofm=fresult.getText({name: "billofmaterials",
            join: "assemblyItemBillOfMaterials"});

        var ssearch = s.create({
            type: "bomrevision",
            filters:
                [
                    ["billofmaterials.name","startswith",billofm]
                ],
            columns:
                [
                    s.createColumn({
                        name: "internalid",
                        sort: s.Sort.ASC
                    }),
                    s.createColumn({
                        name: "name",
                        join: "billOfMaterials"
                    }),
                    s.createColumn({
                        name: "item",
                        join: "component"
                    }),
                    s.createColumn({
                        name: "bomquantity",
                        join: "component"
                    }),
                    s.createColumn({
                        name: "baseunits",
                        join: "component"
                    }),
                    s.createColumn({
                        name: "restricttoassemblies",
                        join: "billOfMaterials"
                    }),
                    s.createColumn({
                        name: "internalid",
                        join: "billOfMaterials"
                    }),
                    s.createColumn({
                        name: "revisionname",
                        join: "billOfMaterials"
                    })
                ]
        });
        var sresult1 = [];
        var i = 0
        var result = ssearch.runPaged().count;
        log.debug("result",result);
        ssearch.run().each(function(sresult) {


            sresult1[i] = {
                "itemid": fresult.getValue({name: "itemid"}),
                "billofmaterials": fresult.getText({name: "billofmaterials",
                    join: "assemblyItemBillOfMaterials"}),
                "revisionname": sresult.getValue({name: "revisionname",
                    join: "billOfMaterials"}),
                "component": sresult.getText({name: "item",
                    join: "component"}),
                "bomquantity": sresult.getValue({name: "bomquantity",
                    join: "component"}),
                "baseunits": sresult.getValue({name: "baseunits",
                    join: "component"})
            };
            i++;

            // .run().each has a limit of 4,000 results
            return true;
        })

        return sresult1;
    }



    function translate(results) {
        return results.map(resultToObject);
    }
    exports.onRequest = onRequest;
    return exports;

});