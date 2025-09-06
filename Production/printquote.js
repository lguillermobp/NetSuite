        /**
         * @NApiVersion 2.x
         * @NScriptType Suitelet
         */
        define(['N/render', 'N/record'], function(render, record) {
            function onRequest(context) {
                if (context.request.method === 'GET') {
                    var estimateId = Number(context.request.parameters.estimateid); // Get estimate ID from URL parameter
                    var templateId = 244; // Replace with your template's internal ID
                    var estimateRecord = record.load({
                        type: record.Type.ESTIMATE,
                        id: estimateId
                    });
                    log.audit('Estimate ID', estimateId);
                    var pdfFile = render.transaction({
                        entityId: estimateId,
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