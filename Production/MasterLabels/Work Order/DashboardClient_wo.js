/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(['N/url',"N/currentRecord", "N/error",'N/log'],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (url,currentRecord, error, log) {
        function pageInit() {
        }

        function onButtonClick() {
            var currRec = currentRecord.get();
            log.debug("currRec",currRec);

            var workorder = currRec.getValue({
                fieldId: "custpage_workorder"
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
            if (startsscc.length==20) {
                result = startsscc.substring(11, 19);
                currRec.setValue({
                    fieldId: "custpage_startsscc",
                    value: result
                });
                startsscc= result;
            }
            log.debug("startcases",startcases);
            log.debug("startsscc",startsscc);

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

            var script = 'customscript_generatemasterlabels_wo';
            var deployment = 'customdeploy1';
            var parameters = "";
            log.debug("script",script);

                currRec.getField("custpage_buttongenerate").isDisabled = true;

                // call GenerateMasterLabels_wo.js (2342)
                var url = "/app/site/hosting/scriptlet.nl?script=2342&deploy=1";
                url += "&workorder=" + workorder;
                url += "&startsscc=" + startsscc;
                url += "&startcases=" + startcases;
                log.debug("url",url);
                window.open(url, "_blank");

                var id = setInterval(function () {
                    if (window.location.href.indexOf(url) < 0) {
                        clearInterval(id);
                        //ready to close the window.
                    }
                }, 500);
            }
        }

        function deleteML() {
            var currRec = currentRecord.get();
            log.debug("currRec",currRec);

            var workorder = currRec.getValue({
                fieldId: "custpage_workorder"
            });
            

           

           
            var script = 'customscriptscheduleddeleteml_wo';
            var deployment = 'customdeploy1';
            var parameters = "";
            log.debug("script",script);

            
                // call DeleteMasterLabels_wo.js (2392)
                var url = "/app/site/hosting/scriptlet.nl?script=2392&deploy=1";
                url += "&workorder=" + workorder;
                log.debug("url",url);
                window.open(url, "_blank");

                var id = setInterval(function () {
                    if (window.location.href.indexOf(url) < 0) {
                        clearInterval(id);
                        //ready to close the window.
                    }
                }, 500);
           
        }

        function print() {

            var currRec = currentRecord.get();
            var itemCount = currRec.getLineCount({ sublistId: 'custpage_masterlabels' });
            var workorder = currRec.getValue({
                fieldId: "custpage_workorder"
            });
            var mlidsall = [];
            var mlids = [];
            for (var line = 0; line < itemCount; line++) {

                var checkb= currRec.getSublistValue({ sublistId: 'custpage_masterlabels', fieldId: 'custpage_rec_process', line: line })

                if (checkb)
                {
                    mlids.push(currRec.getSublistValue({sublistId: 'custpage_masterlabels',fieldId: 'custrecordml_id',line: line}));


                }
                mlidsall.push(currRec.getSublistValue({sublistId: 'custpage_masterlabels',fieldId: 'custrecordml_id',line: line}));
            }
            if (mlids.length==0) {mlids=mlidsall;}

            var saleorder = currRec.getValue({
                fieldId: "custpage_saleorder"
            });


            var script = 'customscript_renderptprintpdf_scanning';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });


            var urlclient = suiteletURL;


            urlclient += "&idso=" + saleorder;
            urlclient += "&idwo=" + workorder;
            urlclient += "&palletid=";
            urlclient += "&palletno=";
            urlclient += "&palletletter=";
            urlclient += "&totalpallets=";
            urlclient += "&mlids=" + mlids;

            window.open(urlclient, "_blank");


            log.debug({title: 'mlids' , details: mlids });




        }

        return {
            pageInit: pageInit,
            onButtonClick: onButtonClick,
            deleteML: deleteML,
            print: print
        }
    })
