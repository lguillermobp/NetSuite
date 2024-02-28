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
                    type: "customrecord_cd_sc",
                    filters:
                    [
                       ["custrecord_cd_sc.mainline","is","T"],
                       "AND", 
                       ["custrecord_cd_sc","anyof",ID]
                    ],
                    columns:
                    [
                       search.createColumn({
                          name: "internalid",
                          join: "CUSTRECORD_CD_SC_SPECIFICATION",
                          sort: search.Sort.ASC
                       }),
                       "custrecord_cd_sc_specification",
                       "custrecord_cd_sc",
                       "custrecord_cd_sc_detail",
                       search.createColumn({
                          name: "tranid",
                          join: "CUSTRECORD_CD_SC"
                       }),
                       search.createColumn({
                          name: "custbody_appf_make_ecd",
                          join: "CUSTRECORD_CD_SC"
                       }),
                       search.createColumn({
                          name: "custbody_appf_veh_model",
                          join: "CUSTRECORD_CD_SC"
                       }),
                       search.createColumn({
                          name: "custbody_cribdesigntemplate",
                          join: "CUSTRECORD_CD_SC"
                       }),
                       search.createColumn({
                          name: "formulatext",
                          formula: "{custrecord_cd_sc.custbody_appf_make_ecd}"
                       }),
                       search.createColumn({
                          name: "formulatext",
                          formula: "{custrecord_cd_sc.custbody_appf_veh_model}"
                       }),
                       search.createColumn({
                          name: "formulatext",
                          formula: "{custrecord_cd_sc.custbody_cribdesigntemplate}"
                       })
                    ]
                    }).run();

                var results = rs.getRange(0, 1000);
                log.debug("results",results);
                var xmlTemplateFile = file.load('/SuiteScripts/Form ECD/CribDesign.xml');
                
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