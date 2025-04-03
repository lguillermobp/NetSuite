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

               const IDSO = Number(context.request.parameters.idso);

               var fsearch = search.load({
               id: "customsearch_ecdcustomerstatement",
               });
          
               fsearch.filters.push(search.createFilter({
            
                     name: "formulanumeric",
                     operator: "equalto",
                     values: IDSO,
                     formula: "CASE  WHEN {type}='Sales Contract'  THEN  {internalid} ELSE {custbody_quote_sc.internalid}  END",
                     isor: false,
                     isnot: false,
                     leftparens: 0,
                     rightparens: 0
               }));

               var results = fsearch.run().getRange({
                  start: 0,
                  end: 1000
              });

                log.debug("results",results);
                var xmlTemplateFile = file.load('/SuiteScripts/Form ECD/SalesContractStatement.xml');
                
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