/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(['N/file', 'N/xml', 'N/runtime', 'N/format', 'N/https'], (file, xml, runtime, format) => {
	function onRequest(context) {
		if (context.request.method !== "GET") {
			throw error.create({
				message: "Only GET is allowed.",
				name: "BAD_HTTP_METHOD"
			});
		}

		const now = format.format({
			value: new Date(),
			type: format.Type.DATETIMETZ,
			timezone: format.Timezone.AMERICA_NEW_YORK
		}).toUpperCase() + " EST";

		let xmlString = file.load({
			id: '/SuiteScripts/PalletTag/PDF/PDF.xml'
		}).getContents();

		xmlString = xmlString.replace(/\[ITEM\]/g, xml.escape({xmlText: context.request.parameters.item}));
		xmlString = xmlString.replace(/\[BIN\]/g, xml.escape({xmlText: context.request.parameters.bin}));
		xmlString = xmlString.replace(/\[LOT\]/g, xml.escape({xmlText: context.request.parameters.lot}));
		xmlString = xmlString.replace(/\[QTY\]/g, xml.escape({xmlText: context.request.parameters.qty}));
		xmlString = xmlString.replace("[USER]", xml.escape({xmlText: runtime.getCurrentUser().name}));
		xmlString = xmlString.replace("[DATETIME]", xml.escape({xmlText: now}));
		xmlString = context.request.parameters.comments ? xmlString.replace("[COMMENTS]", xml.escape({xmlText: context.request.parameters.comments})) : xmlString.replace("[COMMENTS]", "");

		context.response.renderPdf({xmlString: xmlString});
	}

	return {onRequest: onRequest};
});
