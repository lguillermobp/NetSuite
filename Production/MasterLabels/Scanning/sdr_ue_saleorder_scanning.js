/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/log",'N/render', 'N/file','N/url',"N/record", "N/search", "N/runtime"], function (log,render, file,url,record, search, runtime) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {
        log.debug("context.mode", context.type);

        const currentRecordId = context.newRecord.id;
        var currRec = context.newRecord;

        if (context.type=="copy")
        {
            currRec.setValue({fieldId: "custbody_celigo_etail_auto_bill_exp", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_etail_bill_exp", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_etail_can_order_exp", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_etail_channel", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_etail_disc_total_var", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_etail_order_exported", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_etail_order_fulfilled", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_etail_order_id", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_etail_order_total_var", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_etail_refund_exp", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_etail_risk_analysis", value: "" });

            currRec.setValue({fieldId: "custbody_celigo_etail_risk_rating", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_etail_ship_total_var", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_etail_tax_total_var", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_etail_transaction_ids", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_order_cancel_shopify", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_pre_order_submit_data", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_shopify_discountcode", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_shopify_order_no", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_shopify_store", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_shopify_store_id", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_shpfy_ispickup", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_shpfy_transaction_ids", value: "" });
            currRec.setValue({fieldId: "custbody_celigo_shpfy_updatedtime", value: "" });
            log.debug("ending",context.type);
        }

        var totalpallets = currRec.getValue({
            fieldId: "custbodytotalpallets"
        });
        var palletletter = currRec.getValue({
            fieldId: "custbodypalletletter"
        });



        if (context.type === context.UserEventType.VIEW) {

            var script = 'customscript_Dashboard_scanning';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });


            var urlclient = suiteletURL;
            urlclient += "&idso=" + currentRecordId;

            context.form.addButton({
                id: "custpage_gml",
                label: "Scanning Master Labels",
                functionName: `window.open('${urlclient}');`
            })

            var script = 'customscriptrenderpdf_pslip';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });


            var urlclient = suiteletURL;
            urlclient += "&idso=" + currentRecordId;


            context.form.addButton({
                id: "custpage_pkl",
                label: "Packing Slip(QVC)",
                functionName: `window.open('${urlclient}');`
            })


            var script = 'customscript_sml_renderpdf_formp1';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });


            var urlclient = suiteletURL;
            urlclient += "&idso=" + currentRecordId;


            context.form.addButton({
                id: "custpage_ffp1",
                label: "HSN/QVC Worksheet",
                functionName: `window.open('${urlclient}');`
            })

            var script = 'customscript_RenderPDF_SODetail';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });


            var urlclient = suiteletURL;
            urlclient += "&idso=" + currentRecordId;


            context.form.addButton({
                id: "custpage_wroksheet",
                label: "Form for Production 1",
                functionName: `window.open('${urlclient}');`
            })



            var script = 'customscript_renderptprintpdf_scanning';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });


            var urlclient = suiteletURL;
            urlclient += "&idso=" + currentRecordId;
            urlclient += "&palletid=";
            urlclient += "&palletno=";
            urlclient += "&palletletter=" + palletletter;
            urlclient += "&totalpallets=" + totalpallets;
            urlclient += "&mlids= " ;

            context.form.addButton({
                id: "custpage_ppt",
                label: "Print Pallet Tag",
                functionName: `window.open('${urlclient}');`
            })
        }
    }


    function afterSubmit(context) {
        const currentRecordId = context.newRecord.id;
        var currRec = context.newRecord;
        log.debug("context.mode", context.mode);
        log.debug("context.newRecord.id", context.newRecord.id);
    }

    function beforeSubmit(context) {
        var currRec = context.newRecord;
        log.debug("type",context.type);

        if (context.type=="approve")
        {
            const internalid = context.newRecord.id;
            log.debug("internalid", internalid);

        }


    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit:beforeSubmit,
        afterSubmit: afterSubmit

    }
})
