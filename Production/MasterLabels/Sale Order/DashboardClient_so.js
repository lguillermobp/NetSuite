/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(["N/currentRecord", "N/error"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (currentRecord, error) {
        function pageInit() {
        }

        function onButtonClick() {
            var currRec = currentRecord.get();

            var saleorder = currRec.getValue({
                fieldId: "custpage_saleorder"
            });
            var totalboxes = currRec.getText({
                fieldId: "custpage_totalboxes"
            });
            var startsscc = currRec.getText({
                fieldId: "custpage_startsscc"
            });
            var startcases = currRec.getValue({
                fieldId: "custpage_startcases"
            });

            if (startcases.length>0 || startsscc.length>0) {

            var totalboxes1 = parseFloat(totalboxes.replace(/,/g, ''));
            currRec.setValue({
                fieldId: "custpage_endcases",
                value: parseInt(startcases) + parseInt(totalboxes1) - 1
            });
            currRec.setValue({
                fieldId: "custpage_endsscc",
                value: parseInt(startsscc) + parseInt(totalboxes1) - 1
            });


                // call GenerateMasterLabels.js (2068)
                var url = "/app/site/hosting/scriptlet.nl?script=2068&deploy=1";
                url += "&saleorder=" + workorder;
                url += "&startsscc=" + startsscc;
                url += "&startcases=" + startcases;
                window.open(url, "_blank");

                var id = setInterval(function () {
                    if (window.location.href.indexOf(url) < 0) {
                        clearInterval(id);
                        //ready to close the window.
                    }
                }, 500);
            }
        }

        function print() {
            var currRec = currentRecord.get();

            var saleorder = currRec.getValue({
                fieldId: "custpage_saleorder"
            });

            // call RenderMLPrintPDF.js (2069)
            var url = "/app/site/hosting/scriptlet.nl?script=2069&deploy=1";
            url += "&saleorder=" + saleorder;

            window.open(url, "_blank");


        }

        return {
            pageInit: pageInit,
            onButtonClick: onButtonClick,
            print: print
        }
    })
