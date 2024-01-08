/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(['N/config',"N/runtime","N/ui/serverWidget", "N/search", "N/file", "N/error",  "/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/Modules/LoDash.js", "/SuiteScripts/Modules/qrious.js", "/SuiteScripts/Modules/qrious.min.js"],
	/**
	 *
	 * @param serverWidget
	 * @param search
	 * @param file
	 * @param error
	 * @param base
	 * @param _
	 */
	function (config, runtime,serverWidget, search, file, error,  GENERALTOOLS, _) {
		/**
		 *
		 * @param context
		 */
		function onRequest(context) {
			if (context.request.method !== "GET") {
				throw error.create({
					name: "BAD_REQUEST_METHOD",
					message: "Only GET is allowed."
				});
			}


			let form = serverWidget.createForm({
				title: `Interface MainFreight`
			});
			form.clientScriptModulePath = '/SuiteScripts/mainfreight/DashboardClient_mf.js';

			form.addButton({
				id: "custpage_Import",
				label: "Import",
				functionName: `process()`
			});

			let fieldfilename = form.addField({
				id: "custpage_file_name",
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
			//sublistpm.addMarkAllButtons();
	
	
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
		}

		return {
			onRequest: onRequest
		};
	});
