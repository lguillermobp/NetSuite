define(['N/search','N/ui/serverWidget','N/log', 'N/file', "/SuiteScripts/Modules/generaltoolsv1.js"], function (s, ui, log, file, GENERALTOOLS) {
	/**
	 * Example 1; calc
	 * @export suitelet-results
	 *
	 * @author Luis Barrios
	 *
	 * @requires N/search
	 * @requires N/ui/serverWidget
	 * @requires N/log
	 *
	 * @NApiVersion 2.1
	 * @ModuleScope SameAccount
	 * @NScriptType Suitelet
	 *
	 */
	var exports= {};
	var i = 0;
	/**
	 * <code>onRequest</code> event handler
	 *
	 * @governance @
	 *
	 * @param context
	 *        {Object}
	 * @param context.request
	 *        {ServerRequest} The incoming request object
	 * @param context.response
	 *        {ServerResponse} The outgoing response object
	 *
	 * @return {void}
	 *
	 * @static
	 * @function onRequest
	 */

	var paramSO;
	var paramITEM;
	var SOID;
	function onRequest(context) {


		context.response.writePage({
			pageObject: renderList()
		});
	}

	function renderList(results) {


		var list = ui.createForm({title:"Fulfillment eCommerce"});

		list.clientScriptModulePath = "./DashboardClientff.js";


			list.addButton({

				id: 'custpage_buttongenerate', //always prefix with 'custpage_'

				label: 'FulFill', //label of the button

				functionName: 'onButtonClick'
			});


		var fieldgroup1 = list.addFieldGroup({
			id : 'fieldgroupid1',
			label : 'Main'
		});


		let daterun = list.addField({
			id: "custpage_daterun",
			type: ui.FieldType.DATE,
			label: "Date",
			container : 'fieldgroupid1'
		});

		let datetran = list.addField({
			id: "custpage_datetran",
			type: ui.FieldType.DATE,
			label: "Transaction Date",
			container : 'fieldgroupid1'
		});




		return list;

	}


	exports.onRequest = onRequest;
	return exports;

});