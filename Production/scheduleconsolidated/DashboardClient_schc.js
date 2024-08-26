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
        
            var productionline= currRec.getValue({ fieldId: 'custpage_taskconsolidated'});
            // call RenderPriorityPrintPDF.js (1941)
            var url = "/app/site/hosting/scriptlet.nl?script=2104&deploy=1";
            url += "&productionline=" + productionline;
            
           
            window.open(url, "_self")
        }

      
  /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
    function fieldChanged(context) {

        var currentRecord = context.currentRecord;
        var fieldId = context.fieldId;

        log.debug("fieldId", fieldId);
        console.log("fieldId",fieldId);

        var productionline= currentRecord.getValue({ fieldId: 'custpage_productionline'});

        if (fieldId === 'custpage_productionline') {

            log.debug("productionline", productionline);
            console.log("productionline",productionline);

        }


    }
    function changenext(id,sts) {
        var currRec = currentRecord.get();
        console.log("id",id);
        console.log("sts",sts);
    }
  
        return {
            pageInit: pageInit,
            process: process,
            fieldChanged: fieldChanged,
            changenext: changenext
        }
    })
