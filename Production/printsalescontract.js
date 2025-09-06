        /**
         * @NApiVersion 2.x
         * @NScriptType Suitelet
         */
        define(['N/render', 'N/record'], function(render, record) {
            function onRequest(context) {
                if (context.request.method === 'GET') {
                    var salescontractId = Number(context.request.parameters.salescontractid); // Get salescontract ID from URL parameter
                    var templateId = 232; // Replace with your template's internal ID
                    var salescontractRecord = record.load({
                        type: record.Type.SALES_ORDER,
                        id: salescontractId
                    });
                    log.audit('salescontract ID', salescontractId);
                    var pdfFile = render.transaction({
                        entityId: salescontractId,
                        formId: templateId,
                        isDynamic: true // Or true if you need dynamic rendering
                    });

                    context.response.writeFile({
                        file: pdfFile,
                        isInline: true // Set to false to download the file
                    });
                    

                }
            }
            return {
                onRequest: onRequest
            };
        });