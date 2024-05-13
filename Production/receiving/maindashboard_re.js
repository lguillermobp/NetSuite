/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search','N/ui/serverWidget','N/log','N/url', 'N/redirect',"N/ui/message"],
    function (s,serverWidget, log, url, redirect,message) {
    const onRequest = (scriptContext) => {
        if (scriptContext.request.method === 'GET') {
            let form = serverWidget.createForm({
                title: 'Picking Dashboard'
            });

            form.clientScriptModulePath = '/SuiteScripts/picking/mainDashboardClient.js';

            let field = form.addField({
                id: 'workorder',
                type: serverWidget.FieldType.TEXT,
                label: 'Manufacturing Order'
            });

            form.addSubmitButton({
                label: 'Submit'
            });

            scriptContext.response.writePage(form);
        } 
    }
  


    return {onRequest}
});

