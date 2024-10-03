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

                const ADVINV = Number(context.request.parameters.id);
                var rs = search.create({
                  type: "customrecord1556",
                  filters:
                  [
                     ["internalid","anyof",ADVINV]
                  ],
                  columns:
                  [
                     "name",
                     "custrecord_ai_amount",
                     "custrecord_ai_customer",
                     "custrecord_ai_date",
                     "custrecord_ai_memo",
                     "custrecord_memo1",
                     "custrecord_memo2",
                     "custrecord_ai_description",
                     search.createColumn({
                        name: "custrecord158",
                        join: "CUSTRECORD158"
                     }),
                     search.createColumn({
                        name: "custrecord_aid_description",
                        join: "CUSTRECORD158"
                     }),
                     search.createColumn({
                        name: "custrecord_aid_amount",
                        join: "CUSTRECORD158"
                     })
                  ]
                    }).run();

                var results = rs.getRange(0, 1000);
                log.debug("results",results);
                var xmlTemplateFile = file.load('/SuiteScripts/Form ECD/AdvanceInvoice.xml');
                
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