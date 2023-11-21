define(['N/search','N/ui/serverWidget','N/log', 'N/file', 'N/record', "/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/MasterLabels/Tools/masterlabeltools.js"],
	function (s, ui, log, file, record, GENERALTOOLS, MLTOOLS) {
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
	 * @NScriptId customscript_Dashboard_wo
	 *
	 */
	var exports= {};
	var i = 0;
	var nodelete=false;
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
	var paramWO;
	var paramSO;
	var paramITEM;
	var validinf="T";
	var WOID;
	function onRequest(context) {

		WOID = context.request.parameters.idwo;
		paramWO = GENERALTOOLS.get_WO_value(WOID);



		context.response.writePage({
			pageObject: renderList(translate(findCases()))
		});
	}
	/*function createAndSaveFile() {
		log.debug("datatocsv",datatocsv);
		var fileObj = file.create({
			name: 'BOM.csv',
			fileType: file.Type.CSV,
			contents: datatocsv
		});
		fileObj.folder = 126377;
		var id = fileObj.save();
		fileObj = file.load({
			id: id
		});
	}*/
	function renderList(results) {



		custbodytotalboxes= paramWO.data.getValue({fieldId: "custbodytotalboxes"});
		custbodytotalpallets= paramWO.data.getValue({fieldId: "custbodytotalpallets"});
		custbodycasespermasterbox= paramWO.data.getValue({fieldId: "custbodycasespermasterbox"});
		custbodyboxesperpallet= paramWO.data.getValue({fieldId: "custbodyboxesperpallet"});
		custbody_bkmn_wo_cust_po_num= paramWO.data.getValue({fieldId: "custbody_bkmn_wo_cust_po_num"});
		entityname= paramWO.data.getValue({fieldId: "entityname"});
		enddate= paramWO.data.getValue({fieldId: "enddate"});
		startdate= paramWO.data.getValue({fieldId: "startdate"});
		custbody_bkmn_wo_cust_po_num= paramWO.data.getValue({fieldId: "custbody_bkmn_wo_cust_po_num"});
		assemblyitem= paramWO.data.getValue({fieldId: "assemblyitem"});
		tranid= paramWO.data.getValue({fieldId: "tranid"});
		log.debug("assemblyitem",assemblyitem);
		paramITEM = GENERALTOOLS.get_item_value(assemblyitem);
		log.debug("paramITEM",paramITEM);
		assembly= paramITEM.data.getValue({fieldId: "itemid"});
		assemblydesc= paramITEM.data.getValue({fieldId: "invt_salesdesc"});

		woquantity= paramWO.data.getValue({fieldId: "quantity"});

		var SOID= paramWO.data.getValue({fieldId: "createdfrom"});
		if (!SOID) {SOID= paramWO.data.getValue({fieldId: "custbody_so_manual"});}

		paramSO = GENERALTOOLS.get_SO_value(SOID);
		entity = paramWO.data.getValue({fieldId: "entity"});
		var paramcust=GENERALTOOLS.get_customer_value (entity)
		var formsscc= paramcust.data.getValue({fieldId: "custentity_formforsscc"});

		var caseData = s.lookupFields({
			type: "customrecord_formsscc",
			id: formsscc,
			columns: [
				"custrecord_sscc_last"
			]
		});
		log.debug("caseData",caseData.length);
		var wstartsscc=0;

			var lastsscc = caseData.custrecord_sscc_last;

			if (lastsscc.length == 20) {
				wstartsscc = parseInt(lastsscc.substring(11, 19))+1;
			}


		var shippingAddressSubrecord = paramSO.data.getSubrecord({fieldId : 'shippingaddress'});
		shipcity= shippingAddressSubrecord.getValue({fieldId: "city"});
		shipstate= shippingAddressSubrecord.getValue({fieldId: "state"});

		var paramrec = GENERALTOOLS.get_param_value(9);
		var vendorssccparam= paramrec.data.getValue({fieldId: "custrecordparams_value"});


		var list = ui.createForm({title:"Master Box Labels for Work Order"});

		list.clientScriptModulePath = "./DashboardClient_wo.js";

		if (custbodycasespermasterbox.length==0 || custbodyboxesperpallet.length==0) {validinf="F";}

		if (validinf=="T") {

			if (results.length != -888) {
				var bdelete = list.addButton({

					id: 'custpage_buttongenerate', //always prefix with 'custpage_'

					label: 'Generate', //label of the button

					functionName: 'onButtonClick'
				});
			} else {
				var bdelete = list.addButton({

					id: 'custpage_buttongenerate', //always prefix with 'custpage_'

					label: 'Delete MLs', //label of the button

					functionName: 'deleteML'
				});
				if (nodelete == true) {
					bdelete.isDisabled = true;
				}

			}
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
		saleorder.updateLayoutType({
			layoutType: ui.FieldLayoutType.STARTROW
		});
		saleorder.updateDisplayType({
			displayType: ui.FieldDisplayType.HIDDEN
		});
		saleorder.defaultValue = SOID;

		let workorder = list.addField({
			id: "custpage_workorder",
			type: ui.FieldType.INTEGER,
			label: "Work Order",
			container : 'fieldgroupid1'
		});

			workorder.updateDisplayType({
			displayType: ui.FieldDisplayType.HIDDEN
		});
			workorder.defaultValue = WOID;


		let workorderno = list.addField({
			id: "custpage_workorderno",
			type: ui.FieldType.TEXT,
			label: "Work Order",
			container : 'fieldgroupid1'
		});

		workorderno.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		workorderno.defaultValue = tranid;


		let ponro = list.addField({
			id: "custpage_ponro",
			type: ui.FieldType.TEXT,
			label: "PO",
			container : 'fieldgroupid1'

		});
			ponro.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
			ponro.defaultValue = custbody_bkmn_wo_cust_po_num;

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



		let startdateml = list.addField({
			id: "custpage_startdateml",
			type: ui.FieldType.DATE,
			label: "Start Date",
			container : 'fieldgroupid1'

		});

		startdateml.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		startdateml.defaultValue = startdate;


		let enddateml = list.addField({
			id: "custpage_enddateml",
			type: ui.FieldType.DATE,
			label: "End Date",
			container : 'fieldgroupid1'

		});

		enddateml.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		enddateml.defaultValue = enddate;

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

		let quantity = list.addField({
			id: "custpage_quantity",
			type: ui.FieldType.INTEGER,
			label: "quantity",
			container : 'fieldgroupid1'

		});
		quantity.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		quantity.defaultValue = woquantity;


		let casespormasterbox = list.addField({
			id: "custpage_casespermasterbox",
			type: ui.FieldType.INTEGER,
			label: "Cases per Master Box",
			container : 'fieldgroupid1'

		});
		casespormasterbox.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		casespormasterbox.defaultValue = custbodycasespermasterbox;



		let totalboxes = list.addField({
			id: "custpage_totalboxes",
			type: ui.FieldType.INTEGER,
			label: "Total Boxes",
			container : 'fieldgroupid1'

		});
		totalboxes.defaultValue = custbodytotalboxes;
		totalboxes.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});

		let boxesperpallet = list.addField({
			id: "custpage_boxesperpallet",
			type: ui.FieldType.INTEGER,
			label: "Boxes per Pallet",
			container : 'fieldgroupid1'

		});
		boxesperpallet.defaultValue = custbodyboxesperpallet;
		boxesperpallet.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});


		let totalpallets = list.addField({
			id: "custpage_totalpallets",
			type: ui.FieldType.INTEGER,
			label: "Total Pallets",
			container : 'fieldgroupid1'

		});
		totalpallets.defaultValue = custbodytotalpallets;
		totalpallets.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});

		let assembly_item = list.addField({
			id: "assembly_item",
			type: ui.FieldType.TEXT,
			label: "assembly",
			container : 'fieldgroupid1'

		});
		assembly_item.defaultValue = assembly;
		assembly_item.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});

		let assembly_desc = list.addField({
			id: "assembly_desc",
			type: ui.FieldType.TEXTAREA,
			label: "Assembly Description",
			container : 'fieldgroupid1'

		});
		assembly_desc.defaultValue = assemblydesc;
		assembly_desc.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});

		let startsscc = list.addField({
			id: "custpage_startsscc",
			type: ui.FieldType.TEXT,
			label: "SSCC Start no",
			container : 'fieldgroupid2'

		});
		startsscc.updateLayoutType({
			layoutType: ui.FieldLayoutType.STARTROW
		});
		if (wstartsscc!=0) {
			startsscc.defaultValue = parseInt(wstartsscc);
		}




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
		startcases.defaultValue = 1;


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
		sublistml.addField({
			id: "custrecordml_id",
			type: ui.FieldType.INTEGER,
			label:'ID'
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
			sublistml.setSublistValue({
				id: 'custrecordml_id',
				line: counter,
				value: result1.custrecordml_id
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

		return list;

	}


	function findCases() {
		var pagedatas=[];

		var fsearch = s.create({
			type: "customrecordmasterlabels",
			filters:
				[
					["custrecordml_workorder","equalto",WOID]
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
					"custrecordml_workorder",
					"internalid"
				]
		});

		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});



		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});

			nodelete=false;

			page.data.forEach(function (fresult) {
				if (fresult.getValue({name: "custrecordml_status"})!="1")
					{	// nodelete=true;
						log.debug("ustrecordml_ssccnumber",fresult.getValue({name: "custrecordml_ssccnumber"}));
					}
				 pagedatas[i] = {
					"custrecordml_ssccnumber": fresult.getValue({name: "custrecordml_ssccnumber"}),
					"custrecordml_validchecker": fresult.getValue({name: "custrecordml_validchecker"}),
					"custrecordml_product": fresult.getText({name: "custrecordml_product"}),
					"custrecordml_productdes": fresult.getValue({name: "salesdescription",
						join: "CUSTRECORDML_PRODUCT"}),
					"custrecordml_casenumber": fresult.getValue({name: "custrecordml_casenumber"}),
					"custrecordml_caseqty": fresult.getValue({name: "custrecordml_caseqty"}),
					"custrecordml_palletid": fresult.getValue({name: "custrecordml_palletid"}),
					"custrecordml_palletnumber": fresult.getValue({name: "custrecordml_palletnumber"}),
					"custrecordml_status": fresult.getText({name: "custrecordml_status"}),
					 "custrecordml_id": fresult.getValue({name: "internalid"})
				}


				i++;

			})
		});
		//createAndSaveFile();
		return pagedatas;
	}

	function findCases1() {
		var pagedatas=[];

		var fsearch = s.create({
			type: "customrecordmasterlabels",
			filters:
				[
					["custrecordml_workorder","equalto",WOID]
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
		//createAndSaveFile();
		return pagedatas;
	}

	function resultToObject(results) {


		return {
			custrecordml_ssccnumber: results.custrecordml_ssccnumber,
			custrecordml_validchecker: results.custrecordml_validchecker,
			custrecordml_casenumber: results.custrecordml_casenumber,
			custrecordml_caseqty: results.custrecordml_caseqty,
			custrecordml_palletid: results.custrecordml_palletid,
			custrecordml_palletnumber: results.custrecordml_palletnumber,
			custrecordml_status: results.custrecordml_status,
			custrecordml_id: results.custrecordml_id


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