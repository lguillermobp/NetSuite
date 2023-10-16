/**
 *
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 * @NScriptId customscript_sml_renderpdf_formp1
 */

define(["N/log",'N/render',"N/http", "N/file", "N/record"],
    /**
     *
     * @param http
     * @param base
     */
    function (log, render,http, file, record) {
        function onRequest(context) {
            log.debug("context",context);
            if (context.request.method === http.Method.GET) {
                const idso = Number(context.request.parameters.idso);
                log.debug("idso",idso);

                if (idso>0)
                {
                    function renderRecordToPdfWithTemplate() {
                        var xmlTemplateFile = file.load('/SuiteScripts/MasterLabels/Form/templatesoforp1.xml');
                        log.debug("xmlTemplateFile",xmlTemplateFile);
                        var renderer = render.create();
                        renderer.templateContent = xmlTemplateFile.getContents();

                        renderer.addRecord('record', record.load({
                            type: 'salesorder',
                            id: idso
                        }));
                        
                        context.response.writeFile(renderer.renderAsPdf(), true);
                    }
                    renderRecordToPdfWithTemplate();
                }


            }

           

        }

        return {onRequest: onRequest}
    })