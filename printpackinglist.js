/**
 * @author Luis Barrios
 *
 * @NApiVersion 2.0
 * @ModuleScope SameAccount
 * @NScriptType Suitelet
 */

define(["N/file", "N/render", "N/record"], function(file, render,  record) {
    function onRequest(context) {
        var text = " <p> In Construction </p>";

        var packingListPdfString = " <pdf> <head> <link name=\"test\" type=\"font\" subtype=\"truetype\"" +
            " src=\"${nsfont.NotoSans_Regular}\" src-bold=\"${nsfont.NotoSans_Bold}\"" +
            " src-italic=\"${nsfont.NotoSans_Italic}\" src-bolditalic=\"${nsfont.NotoSans_BoldItalic}\" bytes=\"2\"" +
            " /> <style type=\"text/css\"> * {font-family: NotoSans, sans-serif;} table {border-collapse: collapse;" +
            " width: 100%;} table, tr, td {border: 1px solid black;} </style> </head> <body padding=\"1.0in 0.5in" +
            " 0.5in 1.5in\" size=\"Letter\"> In Construction </p>  </body> </pdf> ";

        var packingList = "";

        var pdf = file.load({
            id: "./PackingListPdf.xml"
        }).getContents();

        var itemReceipt = record.load({
            id: context.request.parameters.id,
            type: context.request.parameters.type
        });


            pdf = pdf.replace("[PDFs]", packingListPdfString);

            context.response.renderPdf({
                xmlString: pdf
            });

    }
    return {
        onRequest: onRequest
    };
});