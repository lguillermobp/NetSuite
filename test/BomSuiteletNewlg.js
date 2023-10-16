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
            pageObject: renderList(translate(findCases2(findCases1())))
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
            id: "displayname",
            type: ui.FieldType.TEXT,
            label:'displayname'
        }); list.addColumn({
            id: "salesdescription",
            type: ui.FieldType.TEXT,
            label:'salesdescription'
        }); list.addColumn({
            id: "type",
            type: ui.FieldType.TEXT,
            label:'type'
        }); list.addColumn({
            id: "billofmaterialsid",
            type: ui.FieldType.TEXT,
            label:'billofmaterialsid'
        }); list.addColumn({
            id: "billofmaterials",
            type: ui.FieldType.TEXT,
            label:'billofmaterials'
        }); list.addColumn({
            id: "default",
            type: ui.FieldType.TEXT,
            label:'default'
        });


        list.addRows({rows:results});
        return list;

    }
        function findCases1() {
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

            }).run().getRange({start: 0, end: 20});

            return fsearch;
        }

    function findCases2() {

        var billofm=results.getText({name: "billofmaterials",
            join: "assemblyItemBillOfMaterials"})

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
        }).run().getRange({start: 0, end: 20});

        log.debug('ssearch', ssearch);


        return fsearch;
    }



        function resultToObject(results) {
            log.debug('results', results);

        return {
            itemid: results.getValue({name: "itemid"}),
            displayname: results.getText({name: "displayname"}),
            salesdescription: results.getValue({name: "salesdescription"}),
            type: results.getValue({name: "type"}),
            billofmaterialsid: results.getValue({name: "billofmaterialsid",
                join: "assemblyItemBillOfMaterials"}),
            billofmaterials: results.getText({name: "billofmaterials",
                join: "assemblyItemBillOfMaterials"}),
            default: results.getValue({name: "default",
                join: "assemblyItemBillOfMaterials"})


        };

        }
    function translate(results) {
        return results.map(resultToObject);
    }
    exports.onRequest = onRequest;
    return exports;

});