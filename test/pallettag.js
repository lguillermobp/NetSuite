/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 */

define(["N/file", "N/render", "N/search", "N/runtime", "N/record"], function(file, render, search, runtime, record) {
    function onRequest(context) {
        var lotInfo = " <table> <tr> <td colspan=\"3\" align=\"center\" font-size=\"72px\"> [LOT] </td> </tr> <tr> <td colspan=\"3\" align=\"center\"> <barcode codetype=\"code128\" showtext=\"false\" value=\"[LOTBARCODE]\" bar-width=\"2.5\"/> </td> </tr> </table> <p></p>";

        var palletTicketPdfString = " <pdf> <head> <link name=\"NotoSans\" type=\"font\" subtype=\"truetype\" src=\"${nsfont.NotoSans_Regular}\" src-bold=\"${nsfont.NotoSans_Bold}\" src-italic=\"${nsfont.NotoSans_Italic}\" src-bolditalic=\"${nsfont.NotoSans_BoldItalic}\" bytes=\"2\" /> <style type=\"text/css\"> * {font-family: NotoSans, sans-serif;} table {border-collapse: collapse; width: 100%;} table, tr, td {border: 1px solid black;} </style> </head> <body padding=\"0.5in 0.5in 0.5in 0.5in\" size=\"Letter\"> <table> <tr> <td colspan=\"3\" align=\"center\" font-size=\"72px\"> [ITEM] </td> </tr> <tr> <td colspan=\"3\" align=\"center\"> <barcode codetype=\"code128\" showtext=\"false\" value=\"[ITEMBARCODE]\" bar-width=\"2.5\"/> </td> </tr> <tr> <td colspan=\"3\" align=\"center\"> [DESCRIPTION] </td> </tr> <tr> <td colspan=\"3\" font-size=\"72\" align=\"center\"> [QTY] </td> </tr> </table> <p></p><p></p> [LOTINFO] <table> <tr> <td> Posted By: </td> <td> </td> <td> </td> </tr> <tr> <td> Printed By:</td> <td> [EMPLOYEE]</td> <td> [SYSDATETIME]</td> </tr> </table> </body> </pdf> ";

        var palletTickets = "";

        var pdf = file.load({
            id: "./PalletTicketPdf.xml"
        }).getContents();

        var itemReceipt = record.load({
            id: context.request.parameters.id,
            type: context.request.parameters.type
        });

        var itemReceiptLineCount = itemReceipt.getLineCount({
            sublistId: "item"
        });


        if (itemReceiptLineCount >= 1) {
            for (var i = 0; i < itemReceiptLineCount; i++) {
                if (itemReceipt.hasSublistSubrecord({
                    sublistId: "item",
                    fieldId: "inventorydetail",
                    line: i
                })) {
                    var inventoryDetail = itemReceipt.getSublistSubrecord({
                        sublistId: "item",
                        fieldId: "inventorydetail",
                        line: i
                    });

                    var inventoryDetailLineCount = inventoryDetail.getLineCount({
                        sublistId: "inventoryassignment"
                    });

                    for (var j = 0; j < inventoryDetailLineCount; j++) {
                        palletTickets = palletTickets + palletTicketPdfString;

                        palletTickets = palletTickets.replace("[ITEM]", itemReceipt.getSublistText({
                            sublistId: "item",
                            fieldId: "itemname",
                            line: i
                        }));
                        palletTickets = palletTickets.replace("[ITEMBARCODE]", itemReceipt.getSublistText({
                            sublistId: "item",
                            fieldId: "itemname",
                            line: i
                        }));

                        palletTickets = palletTickets.replace("[DESCRIPTION]",
                            itemReceipt.getSublistText({
                                sublistId: "item",
                                fieldId: "itemdescription",
                                line: i
                            })).replace(/&/g, "and");

                        if (inventoryDetail.getSublistText({
                            sublistId: "inventoryassignment",
                            fieldId: "receiptinventorynumber",
                            line: j
                        }) !== "") {
                            palletTickets = palletTickets.replace("[LOTINFO]", lotInfo);

                            palletTickets = palletTickets.replace("[LOT]", inventoryDetail.getSublistText({
                                sublistId: "inventoryassignment",
                                fieldId: "receiptinventorynumber",
                                line: j
                            }));
                            palletTickets = palletTickets.replace("[LOTBARCODE]", inventoryDetail.getSublistText({
                                sublistId: "inventoryassignment",
                                fieldId: "receiptinventorynumber",
                                line: j
                            }));
                        } else{
                            palletTickets = palletTickets.replace("[LOTINFO]", "");
                        }

                        palletTickets = palletTickets.replace("[QTY]", inventoryDetail.getSublistText({
                            sublistId: "inventoryassignment",
                            fieldId: "quantity",
                            line: j
                        }));
                    }
                } else {
                    palletTickets = palletTickets + palletTicketPdfString;
                    palletTickets = palletTickets.replace("[LOTINFO]", "");

                    palletTickets = palletTickets.replace("[ITEM]", itemReceipt.getSublistText({
                        sublistId: "item",
                        fieldId: "itemname",
                        line: i
                    }));
                    palletTickets = palletTickets.replace("[ITEMBARCODE]", "Test");

                    palletTickets = palletTickets.replace("[DESCRIPTION]",
                        itemReceipt.getSublistText({
                            sublistId: "item",
                            fieldId: "itemdescription",
                            line: i
                        })).replace(/&/g, "and");

                    palletTickets = palletTickets.replace("[QTY]", itemReceipt.getSublistText({
                        sublistId: "item",
                        fieldId: "quantity",
                        line: i
                    }));
                }
            }

            palletTickets = palletTickets.replace(/\[EMPLOYEE]/g, runtime.getCurrentUser().name);

            var now = new Date();
            now = now.getTime() + (now.getTimezoneOffset() * 60000);
            now = new Date(now + (3600000 * -5));
            now = now.toLocaleString("en-US");
            now = now.substring(0, now.length - 3);
            now = now + "EST";

            palletTickets = palletTickets.replace(/\[SYSDATETIME]/g, now);

            pdf = pdf.replace("[PDFs]", palletTickets);

            context.response.renderPdf({
                xmlString: pdf
            });
        } else {
            context.response.write("No items received on this Item Receipt. Maybe there were only expense items?");
        }
    }
    return {
        onRequest: onRequest
    };
});