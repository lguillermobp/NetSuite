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
                var rs = search.create({
                    type: "transaction",
                    filters:
                    [
                       ["type","anyof","CustDep","SalesOrd"], 
                       "AND", 
                       [[["type","anyof","SalesOrd"],"AND",["mainline","is","F"]],"OR",[["type","anyof","CustDep"],"AND",["mainline","is","T"]]], 
                       "AND", 
                       [["mainname","anyof",CUSTOMER]]
                    ],
                    columns:
                    [
                       "mainline",
                       "type",
                       "tranid",
                       "mainname",
                       "billaddress",
                       "createdby",
                       "trandate",
                       "billeddate",
                       search.createColumn({
                          name: "datecreated",
                          sort: search.Sort.DESC
                       }),
                       "item",
                       "memo",
                       "quantity",
                       "rate",
                       "amount",
                       "quantitybilled",
                       "createdfrom",
                       "accounttype",
                       "custcol_saledescription"
                    ]
                    }).run();

                var results = rs.getRange(0, 1000);
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