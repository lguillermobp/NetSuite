/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(["N/ui/serverWidget", "N/search", "N/file", "N/error", "./Base.js", "/SuiteScripts/Modules/LoDash.js"],
	/**
	 *
	 * @param serverWidget
	 * @param search
	 * @param file
	 * @param error
	 * @param base
	 * @param _
	 */
	function (serverWidget, search, file, error, base, _) {
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

			const LOCATION_ID = base.validateLocationId(context.request.parameters.location);
			const LOCATION_REGION = base.getLocationAttributeFromId(LOCATION_ID, "region");

			let form = serverWidget.createForm({
				title: `${LOCATION_REGION} Ecomm Dashboard`
			});
			form.clientScriptModulePath = '/SuiteScripts/EcommSplitFulfillment/DashboardClient.js';

			form.addButton({
				id: "custpage_print_next_orders_in_priority",
				label: "Print Priority Orders",
				functionName: `printPriorityOrders(${LOCATION_ID})`
			});

			let fieldStartingAtDocumentNumber = form.addField({
				id: "custpage_starting_document_number",
				type: serverWidget.FieldType.TEXT,
				label: "Starting At Document Number",
			});
			fieldStartingAtDocumentNumber.defaultValue = 1;
			fieldStartingAtDocumentNumber.isMandatory = true;

			let fieldPrintNextNumberOfOrdersInPriority = form.addField({
				id: "custpage_number_of_priority_orders",
				type: serverWidget.FieldType.INTEGER,
				label: "Print Next Number of Orders In Priority",
			});
			fieldPrintNextNumberOfOrdersInPriority.defaultValue = LOCATION_ID === 30 ? 250 : 50;
			fieldPrintNextNumberOfOrdersInPriority.isMandatory = true;

			let fieldAllowPartialShipping = form.addField({
				id: "custpage_allow_partial_shipping",
				type: serverWidget.FieldType.CHECKBOX,
				label: "To include BackOrders?",
			});

			context.response.writePage(form);
		}

		return {
			onRequest: onRequest
		};
	});
