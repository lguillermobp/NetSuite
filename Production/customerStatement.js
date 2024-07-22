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
                    settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                    filters:
                    [
                        ["type","anyof","CustDep","SalesOrd","Journal"], 
                        "AND", 
                        [[["type","anyof","SalesOrd"],"AND",["mainline","is","F"]],"OR",[["type","anyof","CustDep","Journal"],"AND",["mainline","is","T"]]],
                        "AND", 
                        [["name","anyof",CUSTOMER]], 
                        "AND", 
                        ["amount","notequalto","0.00"]
                    ],
                    columns:
                    [
                        search.createColumn({
                            name: "type",
                            summary: "GROUP"
                         }),
                         search.createColumn({
                            name: "tranid",
                            summary: "GROUP"
                         }),
                         search.createColumn({
                            name: "mainname",
                            summary: "GROUP"
                         }),
                         search.createColumn({
                            name: "billaddress",
                            summary: "GROUP"
                         }),
                         search.createColumn({
                            name: "createdby",
                            summary: "GROUP"
                         }),
                         search.createColumn({
                            name: "trandate",
                            summary: "GROUP"
                         }),
                         search.createColumn({
                            name: "memomain",
                            summary: "GROUP"
                         }),
                         search.createColumn({
                            name: "creditamount",
                            summary: "SUM"
                         }),
                         search.createColumn({
                            name: "entity",
                            summary: "GROUP"
                         }),
                        search.createColumn({
                            name: "altname",
                            join: "customer",
                            summary: "GROUP"
                        }),
                         search.createColumn({
                            name: "debitamount",
                            summary: "SUM"
                         }),
                         search.createColumn({
                            name: "formulacurrency",
                            summary: "SUM",
                            formula: "CASE WHEN {type}='Sales Contract'  THEN {amount}  ELSE {amount}*-1  END"
                         }),
                         search.createColumn({
                            name: "type",
                            join: "item",
                            summary: "GROUP"
                         }),
                         search.createColumn({
                            name: "formulatext",
                            summary: "GROUP",
                            formula: "CASE WHEN {type}='Sales Contract' THEN CASE WHEN  {item.type} = 'Service' then 'Upgrade' ELSE 'Sales Contract' END ELSE  {memo} END"
                         })
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