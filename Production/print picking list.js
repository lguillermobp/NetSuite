/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(["N/render", "N/log"],
    /**
     *
     * @param {search} search
     * @param {file} file
     * @param {render} render
     * @param {runtime} runtime
     * @param {format} format
     * @param {xml} xml
     * @param {LoDash} _
     * @returns {{onRequest: onRequest}}
     */
    function ( render, log) {
        
        function onRequest(context) {
            const pdf1 = String(context.request.parameters.pdf);

            var pdf = file.load({id: "/SuiteScripts/bomPDF.xml"}).getContents();

            console.log("printpl",currentRec);

            pdf = pdf.replace("[PRINTED_BY]", runtime.getCurrentUser().name);
            pdf = pdf.replace("[DATE_TIME]", format.format({
                value: new Date(),
                type: format.Type.DATETIME,
                timezone: format.Timezone.AMERICA_NEW_YORK
            }));

            // context.response.write(String(pdf));
            context.response.renderPdf({xmlString: pdf})
        }

        return {
            onRequest: onRequest
        }
    }
)