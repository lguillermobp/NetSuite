/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(["N/runtime","N/currentRecord", "N/error",'N/log', "/SuiteScripts/Modules/generaltoolsv1.js"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (runtime,currentRecord, error,log, GENERALTOOLS) {
        function pageInit() {
        }

        function process() {
            var currRec = currentRecord.get();

            var fieldfilename = currRec.getText({
                fieldId: "custpage_file_name"
            });
        
            // call RenderPriorityPrintPDF.js (1941)
            var url = "/app/site/hosting/scriptlet.nl?script=1941&deploy=1";
            url += "&fieldfilename=" + fieldfilename;
           
            //window.open(url, "_blank")
        }


        
        return {
            pageInit: pageInit,
            process: process
        }
    })
