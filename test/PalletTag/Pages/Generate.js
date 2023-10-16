/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(['N/ui/serverWidget', 'N/error', 'N/redirect'], (serverWidget, error, redirect) => {
	function onRequest(context) {
		if (context.request.method === "GET") {
			var form = serverWidget.createForm({
				title: 'Generate Pallet Tag'
			});

			form.addSubmitButton({
				label: 'Print',
			});

			var item = form.addField({
				id: 'custpage_bkm_item',
				label: 'Item',
				type: serverWidget.FieldType.TEXT
			});
			item.isMandatory = true;
			item.updateLayoutType({
				layoutType: serverWidget.FieldLayoutType.OUTSIDE
			});
			item.updateBreakType({
				breakType : serverWidget.FieldBreakType.STARTROW
			});

			var lot = form.addField({
				id: 'custpage_bkm_lot',
				label: 'Lot',
				type: serverWidget.FieldType.TEXT
			});
			lot.isMandatory = true;
			lot.updateLayoutType({
				layoutType: serverWidget.FieldLayoutType.OUTSIDE
			});
			lot.updateBreakType({
				breakType : serverWidget.FieldBreakType.STARTROW
			});

			var bin = form.addField({
				id: 'custpage_bkm_bin',
				label: 'Bin',
				type: serverWidget.FieldType.TEXT
			});
			bin.isMandatory = true;
			bin.updateLayoutType({
				layoutType: serverWidget.FieldLayoutType.OUTSIDE
			});
			bin.updateBreakType({
				breakType : serverWidget.FieldBreakType.STARTROW
			});

			var qty = form.addField({
				id: 'custpage_bkm_qty',
				label: 'Quantity',
				type: serverWidget.FieldType.INTEGER
			});
			qty.isMandatory = true;
			qty.updateLayoutType({
				layoutType: serverWidget.FieldLayoutType.OUTSIDE
			});
			qty.updateBreakType({
				breakType : serverWidget.FieldBreakType.STARTROW
			});

			var comments = form.addField({
				id: 'custpage_bkm_comments',
				label: 'Comments',
				type: serverWidget.FieldType.TEXTAREA
			});
			comments.maxLength = 140;

			context.response.writePage(form);
		} else if (context.request.method === "POST") {
			redirect.toSuitelet({
				scriptId: "customscript_bkm_pallet_tag_pdf",
				deploymentId: "customdeploy_bkm_pallet_tag_pdf",
				parameters: {
					item: context.request.parameters.custpage_bkm_item,
					bin: context.request.parameters.custpage_bkm_bin,
					lot: context.request.parameters.custpage_bkm_lot,
					qty: context.request.parameters.custpage_bkm_qty,
					comments: context.request.parameters.custpage_bkm_comments,
				}
			})
		} else {
			throw error.create({
				message: "Only GET and POST are allowed.",
				name: "BAD_HTTP_METHOD"
			});
		}
	}

	return {onRequest: onRequest};
});