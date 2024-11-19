/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search','N/ui/serverWidget','N/log','N/url', 'N/redirect',"N/ui/message","N/runtime", "/SuiteScripts/Modules/generaltoolsv1.js"],
    function (s,serverWidget, log, url, redirect,message, runtime, GENERALTOOLS) {
    const onRequest = (scriptContext) => {
        if (scriptContext.request.method === 'GET') {
            let form = serverWidget.createForm({
                title: 'PPD Generator'
            });

            var userObj = runtime.getCurrentUser();
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
            customersselected=paramemp.data.getValue({fieldId: "custentity_customerssalected"});
            sectionsselected=paramemp.data.getValue({fieldId: "custentity_sectionsselected"});
            vendorsselected=paramemp.data.getValue({fieldId: "custentity_vendorsselected"});

            form.clientScriptModulePath = '/SuiteScripts/purchase order/mainDashboardClient_po.js';

            var ppdid = form.addField({
                id: "custpage_ppdid",
                type: serverWidget.FieldType.SELECT,
                label: "PPD ID",
                source: "customlist_ppdid"
                });

                var vendor = form.addField({
                    id: "custpage_vendors",
                    type: serverWidget.FieldType.MULTISELECT,
                    label: "Vendors",
                    source: "Vendor"
                    });

                    vendor.defaultValue = vendorsselected;

                 
                 var customer = form.addField({
                    id: "custpage_customers",
                    type: serverWidget.FieldType.MULTISELECT,
                    label: "Customers",
                    source: "Customer"
                    });

                customer.defaultValue = customersselected;

                var sections = form.addField({
                    id: "custpage_section",
                    type: serverWidget.FieldType.TEXT,
                    label: "Sections",
                    source: "customrecord_section"
                    });

                sections.defaultValue = sectionsselected;

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