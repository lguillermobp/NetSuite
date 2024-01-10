/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(['N/file','N/redirect',"N/runtime","N/ui/serverWidget", "N/search", "N/file", "N/error",'N/log',  "/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/Modules/LoDash.js", "/SuiteScripts/Modules/qrious.js", "/SuiteScripts/Modules/qrious.min.js"],
	/**
	 *
	 * @param serverWidget
	 * @param search
	 * @param file
	 * @param error
	 * @param base
	 * @param _
	 */
	function (file, redirect, runtime,serverWidget, search, file, error,log,  GENERALTOOLS, _) {
		/**
		 *
		 * @param context
		 */
        function onRequest(context) {

            if (context.request.method === 'GET') {
        
                let form = serverWidget.createForm({
                    title: `Interface MainFreight`
                });
                form.clientScriptModulePath = '/SuiteScripts/mainfreight/DashboardClient_mf.js';

                form.addSubmitButton({
                    label: 'Import'
                });
    
                let fieldfilename = form.addField({
                    id: "custpage_file",
                    type: serverWidget.FieldType.FILE,
                    label: "File Name (CSV)",
                });
                
                fieldfilename.isMandatory = true;
    
                let htmlField = form.addField({
                    id: "custpage_html",
                    label: "html",
                    type: serverWidget.FieldType.INLINEHTML,
                });
                htmlField.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.ENDROW
                });
                htmlField.defaultValue = '<div> testing  </div>';
    
    
                var sublistpm = form.addSublist({
                    id: 'custpage_records',
                    type : serverWidget.SublistType.LIST,
                    label: 'Records Imported to be processed',
        
                });
        
        
                sublistpm.addField({
                    id: "custrecordml_internalid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Internal ID'
                });
    
                sublistpm.addField({
                    id: "custrecordml_recordtype",
                    type: serverWidget.FieldType.TEXT,
                    label:'Record Type'
                });
                sublistpm.addField({
                    id: "custrecordml_transformto",
                    type: serverWidget.FieldType.TEXT,
                    label:'Transform TO'
                });
                sublistpm.addField({
                    id: "custrecordml_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'Item ID'
                });
                sublistpm.addField({
                    id: "custrecordml_qty",
                    type: serverWidget.FieldType.TEXT,
                    label:'Quantity'
                });
                sublistpm.addField({
                    id: "custrecordml_lot",
                    type: serverWidget.FieldType.TEXT,
                    label:'Lot'
                });
                sublistpm.addField({
                    id: "custrecordml_bin",
                    type: serverWidget.FieldType.TEXT,
                    label:'Bin Location ID'
                });
                sublistpm.addField({
                    id: "custrecordml_exdate",
                    type: serverWidget.FieldType.DATE,
                    label:'Expiration Date'
                });
    
                //if (results.length> 0) {
    
                    sublistpm.addButton({
                        id: 'custpage_process',
                        label: 'Process',
                        functionName: "process()"
                    });
                    
                //}
        
                var userObj = runtime.getCurrentUser();
                var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
                var initials=paramemp.data.getValue({fieldId: "initials"});
                
                log.debug("userObj",userObj);
                
                context.response.writePage(form);
            } else {
              var fileObj = context.request.files.custpage_file;
              fileObj.name = "mainfreight.csv";
              fileObj.folder = 2744736; //replace with own folder ID
              var id = fileObj.save();

              redirect.toSuitelet({
                scriptId: 'customscript_dashboard_mf',
                deploymentId: 'customdeploy1'
            });
            
            }
    }

    return {
        onRequest: onRequest
    };
});