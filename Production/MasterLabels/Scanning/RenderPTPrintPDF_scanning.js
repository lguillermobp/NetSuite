/**
 *
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 * @NScriptId customscript_sml_renderptprintpdf
 */

define(["N/http", "N/xml",  "./Base_scanning.js"],
    /**
     *
     * @param http
     * @param base
     */
    function (http, xml, base) {
        function onRequest(context) {
            if (context.request.method === http.Method.GET) {
                const idso = Number(context.request.parameters.idso);
                if (context.request.parameters.mlids.length>1)
                {
                    var mlids  = context.request.parameters.mlids.split(',');
                }
                else
                {
                    var mlids  = '';
                }

                const palletid = context.request.parameters.palletid;
                const palletno = Number(context.request.parameters.palletno);
                const palletletter = context.request.parameters.palletletter;
                const totalpallets = Number(context.request.parameters.totalpallets);



                if (palletid.length>0)
                {
                    let listML = base.getMasterLabelsData(idso,palletid,palletno);
                    if (listML.length > 1) {
                        var xmlString = base.createXmlStringForHTML2(listML);
                    } else {
                        var xmlString = base.createXmlStringForHTML(listML);
                    }
                    if (idso==11) {
                        base.createLicensePlate(listML);
                    }
                    context.response.write({ output: xmlString });
                }
                if (mlids.length!=0)
                {
                    let listML = base.getMasterLabelsData1(idso,mlids);
                    var xmlString = base.createXmlStringForHTML1(idso,listML);
                    context.response.write({ output: xmlString });
                }
                if (totalpallets>0)
                {
                    var xmlString = base.createXmlStringForTAG(idso,palletletter,totalpallets);
                    context.response.write({ output: xmlString });
                }


            }

        }

        return {onRequest: onRequest}
    })