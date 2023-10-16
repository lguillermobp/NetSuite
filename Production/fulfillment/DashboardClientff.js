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

            var daterun = currRec.getValue({
                fieldId: "custpage_daterun"
            });
            var datetran = currRec.getValue({
                fieldId: "custpage_datetran"
            });


            if (daterun.length>0 ) {

                var url = "/app/site/hosting/scriptlet.nl?script=2068&deploy=1";
                url += "&daterun=" + daterun;
                url += "&datetran=" + datetran;
                window.open(url, "_blank");

            }
        }


        return {
            pageInit: pageInit,
            onButtonClick: onButtonClick

        }
    })
