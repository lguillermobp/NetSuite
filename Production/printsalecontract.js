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
                    type: "salesorder",
                    filters:
                    [
                        ["type","anyof","SalesOrd"], 
                        "AND", 
                        ["internalid","anyof",ID]
                    ],
                    columns:
                    [
                        search.createColumn({
                            name: "trandate",
                            sort: search.Sort.ASC
                        }),
                        "print",
                        "type",
                        search.createColumn({
                            name: "tranid",
                            sort: search.Sort.ASC
                        }),
                        "entity",
                        "otherrefnum",
                        "statusref",
                        "memo",
                        "custbody_appf_make_ecd",
                        "custbody_appf_veh_model",
                        "billaddress",
                        "amount",
                        "custcol_saledescription"
                  
                    ]
                    }).run();

                var results = rs.getRange(0, 1000);
                log.debug("results",results);
                var xmlTemplateFile = file.load('/SuiteScripts/Form ECD/SaleContract.xml');
                
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