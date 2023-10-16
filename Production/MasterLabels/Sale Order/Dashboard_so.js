define(['N/search','N/ui/serverWidget','N/log', 'N/file', "/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/MasterLabels/Tools/masterlabeltools.js"],
	function (s, ui, log, file, GENERALTOOLS, MLTOOLS) {
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

		SOID = context.request.parameters.idso;
		paramSO = GENERALTOOLS.get_SO_value(SOID);



		context.response.writePage({
			pageObject: renderList(translate(findCases()))
		});
	}

	function renderList(results) {

		paramSO = GENERALTOOLS.get_SO_value(SOID);

		otherrefnum= paramSO.data.getValue({fieldId: "otherrefnum"});
		entityname= paramSO.data.getValue({fieldId: "entityname"});
		ponumberSO= paramSO.data.getValue({fieldId: "otherrefnum"});
		var shippingAddressSubrecord = paramSO.data.getSubrecord({fieldId : 'shippingaddress'});
		shipcity= shippingAddressSubrecord.getValue({fieldId: "city"});
		shipstate= shippingAddressSubrecord.getValue({fieldId: "state"});

		var paramrec = GENERALTOOLS.get_param_value(9);
		var vendorssccparam= paramrec.data.getValue({fieldId: "custrecordparams_value"});


		var list = ui.createForm({title:"Master Box Labels for Sale Order"});

		list.clientScriptModulePath = "./DashboardClient.js";

		if (results.length== 0) {
			list.addButton({

				id: 'custpage_buttongenerate', //always prefix with 'custpage_'

				label: 'Generate', //label of the button

				functionName: 'onButtonClick'
			});
		}

		var fieldgroup1 = list.addFieldGroup({
			id : 'fieldgroupid1',
			label : 'Main'
		});
		var fieldgroup2 = list.addFieldGroup({
			id : 'fieldgroupid2',
			label : 'SSCC/CASES'
		});

		let saleorder = list.addField({
			id: "custpage_saleorder",
			type: ui.FieldType.INTEGER,
			label: "sale Order",
			container : 'fieldgroupid1'
		});

			saleorder.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
			saleorder.defaultValue = SOID;


		let ponro = list.addField({
			id: "custpage_ponro",
			type: ui.FieldType.TEXT,
			label: "PO",
			container : 'fieldgroupid1'

		});
			ponro.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
			ponro.defaultValue = ponumberSO;

		let entitynameml = list.addField({
			id: "custpage_entityname",
			type: ui.FieldType.TEXT,
			label: "Customer",
			container : 'fieldgroupid1'

		});
		entitynameml.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		entitynameml.defaultValue = entityname;


		let shipcityml = list.addField({
			id: "custpage_shipcityml",
			type: ui.FieldType.TEXT,
			label: "ship city",
			container : 'fieldgroupid1'

		});
		shipcityml.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		shipcityml.defaultValue = shipcity;

		let shipstateml = list.addField({
			id: "custpage_shipstateml",
			type: ui.FieldType.TEXT,
			label: "ship state",
			container : 'fieldgroupid1'

		});
		shipstateml.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		shipstateml.defaultValue = shipstate;




		let startsscc = list.addField({
			id: "custpage_startsscc",
			type: ui.FieldType.TEXT,
			label: "SSCC Start no",
			container : 'fieldgroupid2'

		});
		startsscc.updateLayoutType({
			layoutType: ui.FieldLayoutType.STARTROW
		});
		//startsscc.defaultValue = custbodytotalpallets;




		let endsscc = list.addField({
			id: "custpage_endsscc",
			type: ui.FieldType.INTEGER,
			label: "SSCC End no",
			container : 'fieldgroupid2'

		});
		endsscc.updateLayoutType({
			layoutType: ui.FieldLayoutType.MIDROW
		});
		endsscc.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		//endsscc.defaultValue = custbodytotalpallets;



		let startcases = list.addField({
			id: "custpage_startcases",
			type: ui.FieldType.TEXT,
			label: "Case Start no",
			container : 'fieldgroupid2'

		});
		startcases.updateLayoutType({
			layoutType: ui.FieldLayoutType.STARTROW
		});
		//startcases.defaultValue = custbodytotalpallets;


		let endcases = list.addField({
			id: "custpage_endcases",
			type: ui.FieldType.INTEGER,
			label: "Case End no",
			container : 'fieldgroupid2'

		});
		endcases.updateLayoutType({
			layoutType: ui.FieldLayoutType.MIDROW
		});
		endcases.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});

		let vendorsscc = list.addField({
			id: "custpage_vendorsscc",
			type: ui.FieldType.TEXT,
			label: "Vendor Code",
			container : 'fieldgroupid2'

		});

		vendorsscc.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		vendorsscc.defaultValue = vendorssccparam;


		var sublistml = list.addSublist({
			id: 'custpage_masterlabels',
			type: ui.SublistType.LIST,
			label: 'Master Labels',

		});




		sublistml.addField({
			id: "custrecordml_ssccnumber",
			type: ui.FieldType.TEXT,
			label:'SSCC No.'
		});

		sublistml.addField({
			id: "custrecordml_workorder",
			type: ui.FieldType.TEXT,
			label:'Work Order'
		});

		sublistml.addField({
			id: "custrecordml_product",
			type: ui.FieldType.TEXT,
			label:'ITEM'
		});

		sublistml.addField({
			id: "custrecordml_casenumber",
			type: ui.FieldType.INTEGER,
			label:'Case No'
		});
		sublistml.addField({
			id: "custrecordml_caseqty",
			type: ui.FieldType.INTEGER,
			label:'Case Qty'
		});
		sublistml.addField({
			id: "custrecordml_palletid",
			type: ui.FieldType.TEXT,
			label:'Pallet ID'
		});
		sublistml.addField({
			id: "custrecordml_palletnumber",
			type: ui.FieldType.INTEGER,
			label:'Pallet No'
		});
		sublistml.addField({
			id: "custrecordml_status",
			type: ui.FieldType.TEXT,
			label:'Status'
		});
		var printField = sublistml.addField({
			id: 'custpage_rec_process',
			label: 'Process',
			type: ui.FieldType.CHECKBOX
		});

		if (results.length> 0) {
			sublistml.addButton({
				id: 'custpage_print',
				label: 'Print',
				functionName: "print()"
			});
		}

		var sublistpt = list.addSublist({
			id: 'custpage_pallettag',
			type: ui.SublistType.LIST,
			label: 'Pallets Tag'
		});

		sublistpt.addField({
			id: "custrecordml_palletid",
			type: ui.FieldType.TEXT,
			label:'Pallet ID'
		});

		sublistpt.addField({
			id: "custrecordml_palletnumber",
			type: ui.FieldType.INTEGER,
			label:'Pallet No'
		});
		sublistpt.addField({
			id: "custrecordml_casenumber",
			type: ui.FieldType.INTEGER,
			label:'Cases'
		});
		sublistpt.addField({
			id: "custrecordml_caseqty",
			type: ui.FieldType.INTEGER,
			label:'Quantity'
		});



		var sublistsm = list.addSublist({
			id: 'custpage_summaryitems',
			type: ui.SublistType.LIST,
			label: 'Summary for ITEMS'
		});

		sublistsm.addField({
			id: "custrecordml_product",
			type: ui.FieldType.TEXT,
			label:'Product ID'
		});

		sublistsm.addField({
			id: "custrecordml_productdes",
			type: ui.FieldType.TEXT,
			label:'Description'
		});
		sublistsm.addField({
			id: "custrecordml_workorder",
			type: ui.FieldType.INTEGER,
			label:'Work Order'
		});
		sublistsm.addField({
			id: "custrecordml_casenumbermin",
			type: ui.FieldType.INTEGER,
			label:'Case No. First'
		});
		sublistsm.addField({
			id: "custrecordml_casenumbermax",
			type: ui.FieldType.INTEGER,
			label:'Case No. Last'
		});
		sublistsm.addField({
			id: "custrecordml_ssccnumbermin",
			type: ui.FieldType.TEXT,
			label:'SSCC No. First'
		});
		sublistsm.addField({
			id: "custrecordml_ssccnumbermax",
			type: ui.FieldType.TEXT,
			label:'SSCC No. Last'
		});



		var counter = 0;

		results.forEach(function(result1) {

			var ssccformated = MLTOOLS.formatsscc18(result1.custrecordml_ssccnumber);
			sublistml.setSublistValue({
				id: 'custrecordml_ssccnumber',
				line: counter,
				value: ssccformated
			});


			sublistml.setSublistValue({
				id: 'custrecordml_casenumber',
				line: counter,
				value: result1.custrecordml_casenumber
			});
			sublistml.setSublistValue({
				id: 'custrecordml_workorder',
				line: counter,
				value: result1.custrecordml_workorder
			});
			sublistml.setSublistValue({
				id: 'custrecordml_product',
				line: counter,
				value: result1.custrecordml_product
			});
			sublistml.setSublistValue({
				id: 'custrecordml_caseqty',
				line: counter,
				value: result1.custrecordml_caseqty
			});
			sublistml.setSublistValue({
				id: 'custrecordml_palletid',
				line: counter,
				value: result1.custrecordml_palletid+" "
			});
			sublistml.setSublistValue({
				id: 'custrecordml_palletnumber',
				line: counter,
				value: 0+result1.custrecordml_palletnumber
			});
			sublistml.setSublistValue({
				id: 'custrecordml_status',
				line: counter,
				value: result1.custrecordml_status
			});

			counter++;
			return true;
		})

		var counter = 0;

		var resultspt= findCases1();
		log.debug("resultspt",resultspt);

		resultspt.forEach(function(result1) {

			sublistpt.setSublistValue({
				id: 'custrecordml_palletid',
				line: counter,
				value: result1.custrecordml_palletid+" "
			});
			sublistpt.setSublistValue({
				id: 'custrecordml_palletnumber',
				line: counter,
				value: 0+result1.custrecordml_palletnumber
			});

			sublistpt.setSublistValue({
				id: 'custrecordml_casenumber',
				line: counter,
				value: result1.custrecordml_casenumber
			});
			sublistpt.setSublistValue({
				id: 'custrecordml_caseqty',
				line: counter,
				value: result1.custrecordml_caseqty
			});


			counter++;
			return true;
		})


		var counter = 0;

		var resultssm= findCases2();
		log.debug("resultssm",resultssm);

		resultssm.forEach(function(result2) {

			sublistsm.setSublistValue({
				id: 'custrecordml_product',
				line: counter,
				value: result2.custrecordml_product
			});
			sublistsm.setSublistValue({
				id: 'custrecordml_productdes',
				line: counter,
				value: result2.salesdescription
			});

			sublistsm.setSublistValue({
				id: 'custrecordml_workorder',
				line: counter,
				value: result2.custrecordml_workorder
			});
			sublistsm.setSublistValue({
				id: 'custrecordml_casenumbermin',
				line: counter,
				value: result2.custrecordml_casenumbermin
			});
			sublistsm.setSublistValue({
				id: 'custrecordml_casenumbermax',
				line: counter,
				value: result2.custrecordml_casenumbermax
			});

			var ssccformatedmin = MLTOOLS.formatsscc18(result2.custrecordml_ssccnumbermin);
			var ssccformatedmax = MLTOOLS.formatsscc18(result2.custrecordml_ssccnumbermax);
			sublistsm.setSublistValue({
				id: 'custrecordml_ssccnumbermin',
				line: counter,
				value: ssccformatedmin
			});
			sublistsm.setSublistValue({
				id: 'custrecordml_ssccnumbermax',
				line: counter,
				value: ssccformatedmax
			});


			counter++;
			return true;
		})

		return list;

	}


	function findCases() {
		var pagedatas=[];

		var fsearch = s.create({
			type: "customrecordmasterlabels",
			filters:
				[
					["custrecordml_saleorder","equalto",SOID]
				],
			columns:
				[
					"custrecordml_casenumber",
					"custrecordml_palletid",
					"custrecordml_caseqty",
					"custrecordml_palletnumber",
					"custrecordml_product",
					s.createColumn({
						name: "salesdescription",
						join: "CUSTRECORDML_PRODUCT"
					}),
					"custrecordml_ssccnumber",
					"custrecordml_validchecker",
					"custrecordml_status",
					"custrecordml_saleorder",
					"custrecordml_workorder"
				]
		});

		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});



		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});



			page.data.forEach(function (fresult) {
				 pagedatas[i] = {
					"custrecordml_workorder": fresult.getValue({name: "custrecordml_workorder"}),
					 "custrecordml_ssccnumber": fresult.getValue({name: "custrecordml_ssccnumber"}),
					"custrecordml_validchecker": fresult.getValue({name: "custrecordml_validchecker"}),
					"custrecordml_product": fresult.getText({name: "custrecordml_product"}),
					"custrecordml_productdes": fresult.getValue({name: "salesdescription",
						join: "CUSTRECORDML_PRODUCT"}),
					"custrecordml_casenumber": fresult.getValue({name: "custrecordml_casenumber"}),
					"custrecordml_caseqty": fresult.getValue({name: "custrecordml_caseqty"}),
					"custrecordml_palletid": fresult.getValue({name: "custrecordml_palletid"}),
					"custrecordml_palletnumber": fresult.getValue({name: "custrecordml_palletnumber"}),
					"custrecordml_status": fresult.getText({name: "custrecordml_status"})
				}


				i++;

			})
		});

		return pagedatas;
	}

	function findCases1() {
		var pagedatas=[];

		var fsearch = s.create({
			type: "customrecordmasterlabels",
			filters:
				[
					["custrecordml_saleorder","equalto",SOID]
				],
			columns:
				[
					s.createColumn({
						name: "custrecordml_palletid",
						summary: "GROUP"
					}),
					s.createColumn({
						name: "custrecordml_palletnumber",
						summary: "GROUP"
					}),
					s.createColumn({
						name: "custrecordml_caseqty",
						summary: "SUM"
					}),
					s.createColumn({
						name: "custrecordml_casenumber",
						summary: "COUNT"
					})
				]
		});

		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});



		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});



			page.data.forEach(function (fresult) {
				 pagedatas[i] = {

					"custrecordml_casenumber": fresult.getValue({name: "custrecordml_casenumber",
						summary: "COUNT"}),
					"custrecordml_caseqty": fresult.getValue({name: "custrecordml_caseqty",
						summary: "SUM"}),
					"custrecordml_palletid": fresult.getValue({name: "custrecordml_palletid",
						summary: "GROUP"}),
					"custrecordml_palletnumber": fresult.getValue({name: "custrecordml_palletnumber",
						summary: "GROUP"}),

				}


				i++;

			})
		});

		return pagedatas;
	}



	function findCases2() {
		var pagedatas=[];

		var fsearch = s.create({
			type: "customrecordmasterlabels",
			filters:
				[
					["custrecordml_saleorder","equalto",SOID]
				],
			columns:
				[
					s.createColumn({
						name: "custrecordml_product",
						summary: "GROUP"
					}),
					s.createColumn({
						name: "salesdescription",
						join: "CUSTRECORDML_PRODUCT",
						summary: "GROUP"
					}),
					s.createColumn({
						name: "custrecordml_workorder",
						summary: "GROUP"
					}),
					s.createColumn({
						name: "custrecordml_casenumber",
						summary: "MIN"
					}),
					s.createColumn({
						name: "custrecordml_casenumber",
						summary: "MAX"
					}),
					s.createColumn({
						name: "custrecordml_ssccnumber",
						summary: "MIN"
					}),
					s.createColumn({
						name: "custrecordml_ssccnumber",
						summary: "MAX"
					})
				]
		});

		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});



		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});



			page.data.forEach(function (fresult) {
				pagedatas[i] = {

					"custrecordml_product": fresult.getText({name: "custrecordml_product",
						summary: "GROUP"}),
					"salesdescription": fresult.getValue({name: "salesdescription",
						join: "CUSTRECORDML_PRODUCT",
						summary: "GROUP"}),
					"custrecordml_workorder": fresult.getValue({name: "custrecordml_workorder",
						summary: "GROUP"}),
					"custrecordml_casenumbermin": fresult.getValue({name: "custrecordml_casenumber",
						summary: "MIN"}),
					"custrecordml_casenumbermax": fresult.getValue({name: "custrecordml_casenumber",
						summary: "MAX"}),
					"custrecordml_ssccnumbermin": fresult.getValue({name: "custrecordml_ssccnumber",
						summary: "MIN"}),
					"custrecordml_ssccnumbermax": fresult.getValue({name: "custrecordml_ssccnumber",
						summary: "MAX"}),

				}


				i++;

			})
		});

		return pagedatas;
	}

	function resultToObject(results) {


		return {
			custrecordml_ssccnumber: results.custrecordml_ssccnumber,
			custrecordml_workorder: results.custrecordml_workorder,
			custrecordml_product: results.custrecordml_product,
			custrecordml_validchecker: results.custrecordml_validchecker,
			custrecordml_casenumber: results.custrecordml_casenumber,
			custrecordml_caseqty: results.custrecordml_caseqty,
			custrecordml_palletid: results.custrecordml_palletid,
			custrecordml_palletnumber: results.custrecordml_palletnumber,
			custrecordml_status: results.custrecordml_status


		};

	}



	function translate(results) {
		return results.map(resultToObject);
	}

	function getBaseUrl() {
		return url.resolveRecord({
			recordType: s.Type.SUPPORT_CASE
		});
	}

	exports.onRequest = onRequest;
	return exports;

});