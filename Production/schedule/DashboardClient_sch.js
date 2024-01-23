/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(["N/runtime","N/currentRecord", "N/error",'N/log', "N/record", "N/search","N/ui/message"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (runtime,currentRecord, error,log,record, s,message) {
        function pageInit() {
        }

        function process() {
            var currRec = currentRecord.get();
            var htmltext = currRec.getValue({
                fieldId: "custpage_html"
            });
        
            console.log("htmltext",htmltext);
        
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
