/**
 *
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 * @NScriptId customscript_customerstatement
 */

define(["N/log",'N/render',"N/http", "N/file", "N/record","N/search"],
    /**
     *
     * @param http
     * @param base
     */
    function (log, render,http, file, record,search) {
        function onRequest(context) {
            var request = context.request;
            var response = context.response;

            log.debug("context",context);
            
            if (context.request.method === http.Method.GET) {

                const ID = Number(context.request.parameters.id);
                var rs = search.create({
                    type: "transaction",
                    settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                    filters:
                    [
                       ["internalid","anyof",ID], 
                       "AND", 
                       ["formulanumeric: {quantity}-{quantityshiprecv}","notequalto","0"], 
                       "AND", 
                       ["tobereceived","is","T"], 
                       "AND", 
                       ["closed","is","F"]
                    ],
                    columns:
                    [
                       search.createColumn({
                          name: "mainline",
                          summary: "GROUP"
                       }),
                       search.createColumn({
                          name: "trandate",
                          summary: "GROUP"
                       }),
                       search.createColumn({
                          name: "type",
                          summary: "GROUP"
                       }),
                       search.createColumn({
                          name: "tranid",
                          summary: "GROUP"
                       }),
                       search.createColumn({
                          name: "entity",
                          summary: "GROUP"
                       }),
                       search.createColumn({
                          name: "memo",
                          summary: "GROUP"
                       }),
                       search.createColumn({
                          name: "amount",
                          summary: "GROUP"
                       }),
                       search.createColumn({
                          name: "item",
                          summary: "GROUP",
                          sort: search.Sort.ASC
                       }),
                       search.createColumn({
                          name: "custcol_notes",
                          summary: "GROUP"
                       }),
                       search.createColumn({
                          name: "quantity",
                          summary: "GROUP"
                       }),
                       search.createColumn({
                          name: "quantityshiprecv",
                          summary: "GROUP"
                       }),
                       search.createColumn({
                          name: "formulanumeric",
                          summary: "GROUP",
                          formula: "{quantity}-{quantityshiprecv}"
                       }),
                       search.createColumn({
                          name: "binnumber",
                          join: "item",
                          summary: "MAX"
                       }),
                        search.createColumn({
                            name: "formulatext",
                            summary: "MAX",
                            formula: "{mainname}"
                        }),
                        search.createColumn({
                           name: "formulatext",
                           summary: "GROUP",
                           formula: "{item}"
                        }),
                        search.createColumn({
                           name: "memomain",
                           summary: "GROUP"
                        })

                    ]
                    }).run();

                var results = rs.getRange(0, 1000);
                log.debug("results",results);
                log.debug("ID",ID);
                log.debug("rs",rs);
                var xmlTemplateFile = file.load('/SuiteScripts/Form ECD/receivenote.xml');
                
                var renderer = render.create();
                renderer.templateContent = xmlTemplateFile.getContents();
                
                renderer.addSearchResults({
                    templateName: 'results', 
                    searchResult: results
                });
                    
                context.response.writeFile(renderer.renderAsPdf(), true);

            }

        }

        return {onRequest: onRequest}
    })