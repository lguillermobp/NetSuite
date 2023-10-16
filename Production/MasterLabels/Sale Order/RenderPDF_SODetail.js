/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NScriptId customscript_RenderPDF_SODetail
 */
// This sample shows how to render search results into a PDF file.
define(["N/log",'N/render', 'N/search', "N/file","N/http"], function(log,render, search, file,http) {
    function onRequest(options) {
        var request = options.request;
        var response = options.response;
        if (options.request.method === http.Method.GET) {
            const idso = Number(options.request.parameters.idso);
            woids=findWO(idso);
            log.debug("woids",woids);
            var xmlTemplateFile = file.load('/SuiteScripts/MasterLabels/Form/templatebdpo.html');


            var rs = search.create({
                type: "workorder",
                filters:
                [
                   ["type","anyof","WorkOrd"], 
                   "AND", 
                   ["internalid","anyof",woids]
                ],
                columns:
                [
                   "trandate",
                   "type",
                   "tranid",
                   "statusref",
                   "entity",
                   "memo",
                   "amount",
                   "item",
                   "quantity",
                   "quantitycommitted",
                   "quantityshiprecv",
                   search.createColumn({
                      name: "formulanumeric",
                      formula: "CASE  WHEN {status}='Built'  OR {mainline}='*' THEN 0 ELSE  NVL({quantitycommitted}, 0)-{quantity}+{quantityshiprecv} END"
                   }),
                   search.createColumn({
                      name: "internalid",
                      join: "createdFrom"
                   }),
                    search.createColumn({
                        name: "otherrefnum",
                        join: "createdFrom"
                    }),
                   search.createColumn({
                      name: "tranid",
                      join: "createdFrom"
                   }),
                    search.createColumn({
                        name: "trandate",
                        join: "createdFrom"
                    }),
                    search.createColumn({
                        name: "custbodytotalboxes",
                        join: "createdFrom"
                    }),
                    search.createColumn({
                        name: "custbodytotalpallets",
                        join: "createdFrom"
                    }),
                   "location",
                   "custbody_spacialcondition",
                   "custbodyboxesperpallet",
                   "custbodycasespermasterbox",
                   search.createColumn({
                      name: "mainname",
                      join: "createdFrom"
                   }),
                   "itemtype",
                   "shipaddress",
                   search.createColumn({
                      name: "shipaddressee",
                      join: "createdFrom"
                   }),
                   search.createColumn({
                      name: "salesdescription",
                      join: "item"
                   }),
                   "mainline"
                ]
            }).run();

            var results = rs.getRange(0, 1000);
            log.debug("results",results);
            var renderer = render.create();
            log.debug("xmlTemplateFile",xmlTemplateFile);
            renderer.templateContent = xmlTemplateFile.getContents();
            renderer.addSearchResults({
                templateName: 'results',
                searchResult: results
            });


            options.response.writeFile(renderer.renderAsPdf(), true);



    }
}
    function findWO(SOID) {
        var fsearch = search.create({
            type: "salesorder",
            filters:
                [
                    ["type","anyof","SalesOrd"],
                    "AND",
                    ["applyingtransaction.type","anyof","WorkOrd"],
                    "AND",
                    ["internalid","anyof",SOID]
                ],
            columns:
                [
                    "tranid",
                    "statusref",
                    "trandate",
                    "item",
                    search.createColumn({
                        name: "internalid",
                        join: "applyingTransaction"
                    }),
                    search.createColumn({
                        name: "statusref",
                        join: "applyingTransaction"
                    }),
                    search.createColumn({
                        name: "trandate",
                        join: "applyingTransaction"
                    }),
                    search.createColumn({
                        name: "tranid",
                        join: "applyingTransaction"
                    }),
                    "otherrefnum",
                    "internalid"
                ]
        });

        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });
        var woids=[];

        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});

            page.data.forEach(function (fresult1) {
                woid= fresult1.getValue({name: "internalid",
                    join: "applyingTransaction"});

                woids.push(woid);

            })
        })

        return woids;
    }
    return {
        onRequest: onRequest
    };
});