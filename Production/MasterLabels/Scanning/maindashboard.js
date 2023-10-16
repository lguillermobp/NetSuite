/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search','N/ui/serverWidget','N/log','N/url', 'N/redirect'],
    function (s,serverWidget, log, url, redirect) {
    const onRequest = (scriptContext) => {
        if (scriptContext.request.method === 'GET') {
            let form = serverWidget.createForm({
                title: 'Scanning Master Box'
            });

            let field = form.addField({
                id: 'saleorder',
                type: serverWidget.FieldType.INTEGER,
                label: 'saleorder '
            });


            form.addSubmitButton({
                label: 'Submit'
            });

            scriptContext.response.writePage(form);
        } else {
            var script = 'customscript_dashboard_scanning';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });
            var retval=get_SO_internalID(scriptContext.request.parameters.saleorder);
            var idso=retval.internalid;
            var lastnumberpallet=get_PN_last(idso);
            if (!lastnumberpallet) {lastnumberpallet=0}
            var pallet=retval.palletidl;
            var startnumberpallet=retval.startnumberpallet;
            if (lastnumberpallet==0) {
                suiteletURL += "&idso=" + idso + "&palletid=" + pallet + "&palletno=" + startnumberpallet;
            }
            else {
                suiteletURL += "&idso=" + idso + "&palletid=" + pallet + "&palletno=" + lastnumberpallet;
            }

            log.debug("suiteletURL",suiteletURL);
            redirect.redirect({ url: suiteletURL });


        }
    }
        function get_SO_internalID(so) {

            var internalid;

            var fsearch = s.create({
                type: "salesorder",
                filters:
                    [
                        ["number","equalto",so],
                        "AND",
                        ["type","anyof","SalesOrd"],
                        "AND",
                        ["mainline","is","T"]
                    ],
                columns:
                    [
                        "mainline",
                        "tranid",
                        "internalid",
                        "custbodypalletletter",
                        "custbody_prefixidpallet",
                        "custbody_startnumberpallet"
                    ]
            });



            var pagedData = fsearch.runPaged({
                "pageSize": 1000
            });


            pagedData.pageRanges.forEach(function (pageRange) {

               var page = pagedData.fetch({index: pageRange.index});

               page.data.forEach(function (fresult) {

                    internalid = fresult.getValue({name: "internalid"});
                    palletidl= fresult.getValue({name: "custbodypalletletter"});
                    palletidp= fresult.getValue({name: "custbody_prefixidpallet"});
                    startnumberpallet= fresult.getValue({name: "custbody_startnumberpallet"});

                    retval = {
                       "internalid": internalid,
                       "palletidl": palletidl,
                       "palletidp": palletidp,
                       "startnumberpallet":startnumberpallet
                   }

                });

            })

            return retval;
        }

        function get_WO_internalID(wo) {

            var internalid;

            var fsearch = s.create({
                type: "salesorder",
                filters:
                    [
                        ["number","equalto",wo],
                        "AND",
                        ["type","anyof","SalesOrd"],
                        "AND",
                        ["mainline","is","T"]
                    ],
                columns:
                    [
                        "mainline",
                        "tranid",
                        "internalid"
                    ]
            });



            var pagedData = fsearch.runPaged({
                "pageSize": 1000
            });


            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});

                page.data.forEach(function (fresult) {

                    internalid = fresult.getValue({name: "internalid"});

                });

            })

            return internalid;
        }

        function get_PN_last(idso) {

            var lastnumberpallet;

            var fsearch = s.create({
                type: "customrecordmasterlabels",
                filters:
                    [
                        ["custrecordml_saleorder","equalto",idso]
                    ],
                columns:
                    [
                        s.createColumn({
                            name: "custrecordml_saleorder",
                            summary: "GROUP"
                        }),
                        s.createColumn({
                            name: "custrecordml_palletnumber",
                            summary: "MAX"
                        })
                    ]
            });



            var pagedData = fsearch.runPaged({
                "pageSize": 1000
            });


            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});

                page.data.forEach(function (fresult) {

                    lastnumberpallet= fresult.getValue({name: "custrecordml_palletnumber",
                        summary: "MAX"});



                });

            })

            return lastnumberpallet;
        }

    return {onRequest}
});

