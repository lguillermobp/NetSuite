/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search','N/ui/serverWidget','N/log','N/url', 'N/redirect',"N/ui/message"],
    function (s,serverWidget, log, url, redirect,message) {
    const onRequest = (scriptContext) => {
        if (scriptContext.request.method === 'GET') {
            let form = serverWidget.createForm({
                title: 'PPD Purchase Order Generator'
            });

            form.clientScriptModulePath = '/SuiteScripts/purchase order/mainDashboardClient_poo.js';

            var ppdid = form.addField({
                id: "custpage_ppdid",
                type: serverWidget.FieldType.SELECT,
                label: "PPD ID",
                source: "customlist_ppdid"
                });

            form.addSubmitButton({
                label: 'Submit'
            });

            scriptContext.response.writePage(form);
        } 
    }
  
    return {onRequest}
});