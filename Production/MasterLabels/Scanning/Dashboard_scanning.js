define(["N/runtime",'N/search','N/ui/serverWidget','N/log', 'N/file', "/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/MasterLabels/Tools/masterlabeltools.js"],
	function (runtime,s, ui, log, file, GENERALTOOLS, MLTOOLS) {
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
	 * @NScriptId customscript_Dashboard_scanning (2344)
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
	var parampalletid;
	var parampalletno;
	var autAB;
	function onRequest(context) {
		var userObj = runtime.getCurrentUser();
		var userID = userObj.id;
		var userPermission = userObj.getPermission({	name : 'TRAN_BUILD'	});
		autAB= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;

		SOID = context.request.parameters.idso;
		parampalletid = context.request.parameters.palletid;
		parampalletno = context.request.parameters.palletno;
		paramSO = GENERALTOOLS.get_SO_value(SOID);



		context.response.writePage({
			pageObject: renderList(translate(findCases()))
		});
	}

	function renderList(results) {

		paramSO = GENERALTOOLS.get_SO_value(SOID);

		otherrefnum= paramSO.data.getValue({fieldId: "otherrefnum"});
		entityname= paramSO.data.getValue({fieldId: "entityname"});
		palletidl= paramSO.data.getValue({fieldId: "custbodypalletletter"});
		palletidp= paramSO.data.getValue({fieldId: "custbody_prefixidpallet"});
		ponumberSO= paramSO.data.getValue({fieldId: "otherrefnum"});
		SONo= paramSO.data.getValue({fieldId: "tranid"});
		var shippingAddressSubrecord = paramSO.data.getSubrecord({fieldId : 'shippingaddress'});
		shipcity= shippingAddressSubrecord.getValue({fieldId: "city"});
		shipstate= shippingAddressSubrecord.getValue({fieldId: "state"});

		var paramrec = GENERALTOOLS.get_param_value(9);
		var vendorssccparam= paramrec.data.getValue({fieldId: "custrecordparams_value"});
		log.debug({title: 'SONo' , details: SONo });

		var list = ui.createForm({title:"Scanning Master Box"});

		list.clientScriptModulePath = "./DashboardClient_scanning.js";


	/*	if (results.length!= 0) {



			list.addSubmitButton({

				id: 'custpage_buttonscanning', //always prefix with 'custpage_'

				label: 'Scan' //label of the button

			});
		}

	 */

		list.addButton({

			id: 'custpage_buttonchange', //always prefix with 'custpage_'

			label: 'Change Pallet ID', //label of the button

			functionName: 'changepalletid'
		});
		list.addButton({
			id: 'custpage_buttonback', //always prefix with 'custpage_'
			label: 'Dashboard', //label of the button
			functionName: 'godashboard'
		});
		list.addButton({
			id: 'custpage_buttonhelp', //always prefix with 'custpage_'
			label: 'HELP', //label of the button
			functionName: 'gohelp'
		});

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

		let saleorderno = list.addField({
			id: "custpage_saleorderno",
			type: ui.FieldType.TEXT,
			label: "sale Order",
			container : 'fieldgroupid1'
		});
		saleorderno.updateLayoutType({
			layoutType: ui.FieldLayoutType.STARTROW
		});
		saleorderno.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		saleorderno.defaultValue = SONo;


		let ponro = list.addField({
			id: "custpage_ponro",
			type: ui.FieldType.TEXT,
			label: "PO",
			container : 'fieldgroupid1'

		});
		ponro.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		ponro.updateLayoutType({
			layoutType: ui.FieldLayoutType.MIDROW
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


		let palletid = list.addField({
			id: "custpage_palletid",
			type: ui.FieldType.TEXT,
			label: "Pallet ID",
			container : 'fieldgroupid2'

		});
		palletid.updateLayoutType({
			layoutType: ui.FieldLayoutType.STARTROW,
		});
		palletid.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		//startsscc.defaultValue = custbodytotalpallets;


		palletid.defaultValue = parampalletid;



		let palletno = list.addField({
			id: "custpage_palletno",
			type: ui.FieldType.INTEGER,
			label: "Pallet no",
			container : 'fieldgroupid2'

		});
		palletno.updateLayoutType({
			layoutType: ui.FieldLayoutType.MIDROW
		});
		palletno.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		palletno.defaultValue = parampalletno;

		let htmlField1 = list.addField({
			id: "custpage_html1",
			label: "html",
			type: ui.FieldType.INLINEHTML,
		});
		htmlField1.updateLayoutType({
			layoutType: ui.FieldLayoutType.ENDROW
		});
		htmlField1.defaultValue = '<div id="MyPalletId" style="width: 100%;background-color: #757575;text-align: center;line-height: 30px; font-size: 20px;	color: white;">Starting... </div>';




		let boxesinpallet = list.addField({
			id: "custpage_boxesinpallet",
			type: ui.FieldType.INTEGER,
			label: "boxes in pallet",
			container : 'fieldgroupid2'

		});
		boxesinpallet.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED
		});
		boxesinpallet.updateLayoutType({
			layoutType: ui.FieldLayoutType.STARTROW
		});


		let tboxesinpallet = list.addField({
			id: "custpage_tboxesinpallet",
			type: ui.FieldType.INTEGER,
			label: "boxes total in pallet",
			container : 'fieldgroupid2'

		});
		tboxesinpallet.updateDisplayType({
			displayType: ui.FieldDisplayType.DISABLED,
		});
		tboxesinpallet.updateLayoutType({
			layoutType: ui.FieldLayoutType.MIDROW
		});

		if (ponumberSO=='418235-96') {tboxesinpallet.defaultValue = 24;}
		else {tboxesinpallet.defaultValue = 12;}


		let htmlField = list.addField({
			id: "custpage_html",
			label: "html",
			type: ui.FieldType.INLINEHTML,
		});
		htmlField.updateLayoutType({
			layoutType: ui.FieldLayoutType.ENDROW
		});
		htmlField.defaultValue = '<div id="myProgress" style="width: 100%;background-color: #757575;"><div id="myBar" style="width: 0%;	height: 30px;background-color: #9e5d20;	text-align: center;	line-height: 30px; font-size: 20px;	color: white;">0%</div>	  </div>';


		var sublistpm = list.addSublist({
			id: 'custpage_palletpm',
			type : ui.SublistType.INLINEEDITOR,
			label: 'Master Labels in Pallet',

		});



		sublistpm.addField({
			id: "custrecordml_ssccnumber",
			type: ui.FieldType.TEXT,
			label:'SSCC No.'
		});

		sublistpm.addField({
			id: "custrecordml_workorder",
			type: ui.FieldType.TEXT,
			label:'Work Order(ID)'
		});

		sublistpm.addField({
			id: "custrecordml_product",
			type: ui.FieldType.TEXT,
			label:'ITEM'
		});

		sublistpm.addField({
			id: "custrecordml_casenumber",
			type: ui.FieldType.INTEGER,
			label:'Case No'
		});
		sublistpm.addField({
			id: "custrecordml_caseqty",
			type: ui.FieldType.INTEGER,
			label:'Case Qty'
		});
		sublistpm.addField({
			id: "custrecordml_palletid",
			type: ui.FieldType.TEXT,
			label:'Pallet ID'
		});
		sublistpm.addField({
			id: "custrecordml_palletnumber",
			type: ui.FieldType.INTEGER,
			label:'Pallet No'
		});
		sublistpm.addField({
			id: "custrecordml_status",
			type: ui.FieldType.TEXT,
			label:'Status'
		});
		sublistpm.addField({
			id: "custrecordml_id",
			type: ui.FieldType.INTEGER,
			label:'ID'
		});


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
		sublistsm.addMarkAllButtons();

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
			label:'Work Order(ID)'
		});
		sublistsm.addField({
			id: "custrecordml_casenumbermin",
			type: ui.FieldType.INTEGER,
			label:'Case No First'
		});
		sublistsm.addField({
			id: "custrecordml_casenumbermax",
			type: ui.FieldType.INTEGER,
			label:'Case No Last'
		});
		sublistsm.addField({
			id: "custrecordml_ssccnumbermin",
			type: ui.FieldType.TEXT,
			label:'SSCC No First'
		});
		sublistsm.addField({
			id: "custrecordml_ssccnumbermax",
			type: ui.FieldType.TEXT,
			label:'SSCC No Last'
		});




		if (results.length> 0) {

			var wpalletid = "PL." + parampalletid+ "." + parampalletno + "." + SOID;
			var paramrec=GENERALTOOLS.findassembly(wpalletid);

			sublistpm.addButton({
				id: 'custpage_print',
				label: 'Print',
				functionName: "print()"
			});
			if (paramrec.sts==true && autAB=="FULL") {
				var bdelete =sublistpm.addButton({
					id: 'custpage_deletepallet',
					label: 'Delete Pallet',
					functionName: "deletepallet('"+wpalletid +"')"
				});

			}
		}


		if (parampalletid || parampalletno)
		{
		var resultspt= findCases1(parampalletid,parampalletno);


		var counter = 0;

		resultspt.forEach(function(result1) {


			sublistpm.setSublistValue({
				id: 'custrecordml_ssccnumber',
				line: counter,
				value: result1.custrecordml_ssccnumber
			});


			sublistpm.setSublistValue({
				id: 'custrecordml_casenumber',
				line: counter,
				value: result1.custrecordml_casenumber
			});
			sublistpm.setSublistValue({
				id: 'custrecordml_workorder',
				line: counter,
				value: result1.custrecordml_workorder
			});
			sublistpm.setSublistValue({
				id: 'custrecordml_product',
				line: counter,
				value: result1.custrecordml_product
			});
			sublistpm.setSublistValue({
				id: 'custrecordml_caseqty',
				line: counter,
				value: result1.custrecordml_caseqty
			});
			sublistpm.setSublistValue({
				id: 'custrecordml_palletid',
				line: counter,
				value: result1.custrecordml_palletid+" "
			});
			sublistpm.setSublistValue({
				id: 'custrecordml_palletnumber',
				line: counter,
				value: 0+result1.custrecordml_palletnumber
			});
			sublistpm.setSublistValue({
				id: 'custrecordml_status',
				line: counter,
				value: result1.custrecordml_status
			});
			sublistpm.setSublistValue({
				id: 'custrecordml_id',
				line: counter,
				value: result1.custrecordml_id
			});

			counter++;
			return true;
		})

		}

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
			label:'Work Order(ID)'
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
				functionName: "printml()"
			});
		}



		var counter = 0;

		results.forEach(function(result1) {

			//var ssccformated = GENERALTOOLS.formatsscc18(result1.custrecordml_ssccnumber);
			sublistml.setSublistValue({
				id: 'custrecordml_ssccnumber',
				line: counter,
				value: result1.custrecordml_ssccnumber
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
			sublistml.setSublistValue({
				id: 'custrecordml_id',
				line: counter,
				value: result1.custrecordml_id
			});

			counter++;
			return true;
		})
		var counter = 0;

		var resultspt= findCases2();


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

		var resultssm= findCases3();


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
					"custrecordml_workorder",
					"internalid"
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
					"custrecordml_status": fresult.getText({name: "custrecordml_status"}),
					"custrecordml_id": fresult.getValue({name: "internalid"})
				}


				i++;

			})
		});

		return pagedatas;
	}

	function findCases1(parmpalletid, parmpalletno) {
		var pagedatas=[];

		var fsearch = s.create({
			type: "customrecordmasterlabels",
			filters:
				[
					["custrecordml_saleorder","equalto",SOID],
					"AND",
					["custrecordml_palletid","is",parmpalletid],
					"AND",
					["custrecordml_palletnumber","equalto",parmpalletno]
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
					"custrecordml_workorder",
					"internalid"
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
					"custrecordml_status": fresult.getText({name: "custrecordml_status"}),
					"custrecordml_id": fresult.getValue({name: "internalid"})
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
						name: "custrecordml_ssccnumber",
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

					"custrecordml_casenumber": fresult.getValue({name: "custrecordml_ssccnumber",
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



	function findCases3() {
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
			custrecordml_status: results.custrecordml_status,
			custrecordml_id: results.custrecordml_id


		};

	}



	function translate(results) {
		return results.map(resultToObject);
	}



	exports.onRequest = onRequest;
	return exports;

});