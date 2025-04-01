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

               const CUSTOMER = Number(context.request.parameters.customer);

               var fsearch = search.load({
               id: "customsearch_ecdcustomerstatement",
               });
          
               fsearch.filters.push(search.createFilter({
            
                     name: "formulanumeric",
                     operator: "equalto",
                     values: CUSTOMER,
                     formula: "CASE WHEN ({type} in('ECD Transaction')) THEN {custbody_customer.internalid} ELSE {customer.internalid} END",
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
                var xmlTemplateFile = file.load('/SuiteScripts/Form ECD/CustomerStatement.xml');
                
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