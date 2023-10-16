/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(['N/config',"N/runtime","N/ui/serverWidget", "N/search", "N/file", "N/error", "./Base.js", "/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/Modules/LoDash.js", "/SuiteScripts/Modules/qrious.js", "/SuiteScripts/Modules/qrious.min.js"],
	/**
	 *
	 * @param serverWidget
	 * @param search
	 * @param file
	 * @param error
	 * @param base
	 * @param _
	 */
	function (config, runtime,serverWidget, search, file, error, base, GENERALTOOLS, _) {
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
			form.clientScriptModulePath = '/SuiteScripts/EcommSplitFulfillmentV2/DashboardClient.js';

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


			let fieldMarkStatusPrinted = form.addField({
				id: "custpage_status_printed",
				type: serverWidget.FieldType.CHECKBOX,
				label: "Mark Status Printed?",
			});


			let batchLotCode = form.addField({
				id: "custpage_batch_lot_code",
				type: serverWidget.FieldType.TEXT,
				label: "Print batch code",
			});

			var userObj = runtime.getCurrentUser();
			var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
			var initials=paramemp.data.getValue({fieldId: "initials"});
			//var d = new Date();
			var d = getCompanyDate();
			var ydate=d.getFullYear();
			var mdate=d.getMonth()+1;
			var ddate=d.getDate();
			var hdate=d.getHours();
			var tdate=d.getMinutes();
			var sdate=d.getSeconds();
			var mdate=mdate < 10 ? '0'+mdate.toString() : mdate.toString();
			var ddate=ddate < 10 ? '0'+ddate.toString() : ddate.toString();
			var hdate=hdate < 10 ? '0'+hdate.toString() : hdate.toString();
			var tdate=tdate < 10 ? '0'+tdate.toString() : tdate.toString();
			var sdate=sdate < 10 ? '0'+sdate.toString() : sdate.toString();

			var fecha= ydate+mdate+ddate+hdate+tdate+sdate;
			var bachcode=initials+'_'+fecha;
			log.debug("userObj",userObj);
			log.debug("bachcode",bachcode);

			batchLotCode.defaultValue = bachcode;

			context.response.writePage(form);
		}

		function getCompanyDate(){
			var currentDateTime = new Date();
			var companyTimeZone = config.load({ type: config.Type.COMPANY_INFORMATION }).getText({ fieldId: 'timezone' });
			log.debug("companyTimeZone",companyTimeZone);
			var timeZoneOffSet = (companyTimeZone.indexOf('(GMT)') == 0) ? 0 : Number(companyTimeZone.substr(4, 6).replace(/\+|:00/gi, '').replace(/:30/gi, '.5'));
			log.debug("timeZoneOffSet",timeZoneOffSet);
			timeZoneOffSet ++;
			var UTC = currentDateTime.getTime() + (currentDateTime.getTimezoneOffset() * 60000);
			log.debug("UTC",UTC);
			var companyDateTime = UTC + (timeZoneOffSet * 60 * 60 * 1000);
			log.debug("companyDateTime",companyDateTime);

			return new Date(companyDateTime);
		}

		return {
			onRequest: onRequest
		};
	});
