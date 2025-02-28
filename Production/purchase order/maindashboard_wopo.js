/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search','N/ui/serverWidget','N/log','N/url', 'N/redirect',"N/ui/message","N/runtime", "/SuiteScripts/Modules/generaltoolsv1.js"],
    function (s,serverWidget, log, url, redirect,message, runtime, GENERALTOOLS) {
    const onRequest = (scriptContext) => {
        if (scriptContext.request.method === 'GET') {
            let form = serverWidget.createForm({
                title: 'Create Purchase Orders from Manufacturing Order'
            });

            var userObj = runtime.getCurrentUser();
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
            customersselected=paramemp.data.getValue({fieldId: "custentity_customerssalected"});
            sectionsselected=paramemp.data.getValue({fieldId: "custentity_sectionsselected"});
            vendorsselected=paramemp.data.getValue({fieldId: "custentity_vendorsselected"});

            form.clientScriptModulePath = '/SuiteScripts/purchase order/mainDashboardClient_wopo.js';

            let field = form.addField({
                id: 'workorder',
                type: serverWidget.FieldType.TEXT,
                label: 'Manufacturing Order'
            });

            let userid = form.addField({
                id: "custpage_userid",
                label: "User ID",
                type: serverWidget.FieldType.TEXT,
            });

            userid.defaultValue = userObj.id;

            userid.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            form.addSubmitButton({
                label: 'Submit'
            });


            scriptContext.response.writePage(form);
        } 
    }
  
    return {onRequest}
});