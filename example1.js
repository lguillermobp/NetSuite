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
        var list = ui.createList({title:"High Priority Cases"});

        list.addButton({
            id: "Custpage btn nextcase",
            label: "Go to Next Case"
        });

        list.addColumn({
            id: "casenumber",
            type: ui.FieldType.TEXT,
            label:'Case Number'
        });
        list.addColumn({
            id: "status",
            type: ui.FieldType.TEXT,
            label:'Status'
        }); list.addColumn({
            id: "priority",
            type: ui.FieldType.TEXT,
            label:'Priority'
        }); list.addColumn({
            id: "title",
            type: ui.FieldType.TEXT,
            label:'Subject'
        });

        list.addRows({rows:results});
        return list;

    }
        function findCases() {
            log.audit({title: "Finding Cases"});

            return s.create({
                type: s.Type.SUPPORT_CASE,
                filters: [  ["status", s.Operator.NONEOF, ["5"] ], "and", // Not Closed
                            ["priority", s.Operator.ANYOF, ["1"] ] // High Priority
                ],
                columns: [
                    "casenumber",
                    "status",
                    "priority",
                    "title"
                ]

            }).run().getRange({start: 0, end: 20});
        }
        function resultToObject(results) {
        return {
            casenumber: results.getValue({name: "casenumber"}),
            status: results.getText({name: "status"}),
            priority: results.getText({name: "priority"}),
            title: results.getValue({name: "title"})


        };

        }
    function translate(results) {
        return results.map(resultToObject);
    }
    exports.onRequest = onRequest;
    return exports;

});