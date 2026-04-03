/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 *
 * Description: RESTlet to load an Inventory Count record and add an item to the count, 
 * including handling of Inventory Detail (countdetail) if applicable.
 */
define(['N/record', 'N/error'], (record, error) => {

    /**
     * GET handler
     * @param {Object} requestParams - URL parameters
     * @returns {string | Object} HTTP response body
     */
    const get = (requestParams) => {
        try {
            if (!requestParams.inventoryCountId) {
                throw error.create({
                    name: 'MISSING_REQD_FIELDS',
                    message: 'Missing required parameter: inventoryCountId'
                });
            }

            const inventoryCountRec = record.load({
                type: record.Type.INVENTORY_COUNT,
                id: requestParams.inventoryCountId,
                isDynamic: false
            });

            const lineCount = inventoryCountRec.getLineCount({
                sublistId: 'item'
            });

            const items = [];
            for (let i = 0; i < lineCount; i++) {
                const itemId = inventoryCountRec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    line: i
                });
                const countQuantity = inventoryCountRec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'countquantity',
                    line: i
                });
                const binNumber = inventoryCountRec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'binnumber',
                    line: i
                });
                const itemName = inventoryCountRec.getSublistText({
                    sublistId: 'item',
                    fieldId: 'item',
                    line: i
                });

                // Check for inventory detail
                let inventoryDetail = [];
                const hasDetail = inventoryCountRec.hasSublistSubrecord({
                    sublistId: 'item',
                    fieldId: 'inventorydetail',
                    line: i
                });

                if (hasDetail) {
                    const detailSubrec = inventoryCountRec.getSublistSubrecord({
                        sublistId: 'item',
                        fieldId: 'inventorydetail',
                        line: i
                    });

                    const detailLineCount = detailSubrec.getLineCount({ sublistId: 'inventoryassignment' });
                    for (let j = 0; j < detailLineCount; j++) {
                        inventoryDetail.push({
                            receiptinventorynumber: detailSubrec.getSublistValue({ sublistId: 'inventoryassignment', fieldId: 'receiptinventorynumber', line: j }),
                            issueinventorynumber: detailSubrec.getSublistValue({ sublistId: 'inventoryassignment', fieldId: 'issueinventorynumber', line: j }),
                            binnumber: detailSubrec.getSublistValue({ sublistId: 'inventoryassignment', fieldId: 'binnumber', line: j }),
                            quantity: detailSubrec.getSublistValue({ sublistId: 'inventoryassignment', fieldId: 'quantity', line: j }),
                            inventorystatus: detailSubrec.getSublistValue({ sublistId: 'inventoryassignment', fieldId: 'inventorystatus', line: j })
                        });
                    }
                }

                items.push({
                    line: i,
                    itemId: itemId,
                    itemName: itemName,
                    countQuantity: countQuantity,
                    binNumber: binNumber,
                    inventoryDetail: inventoryDetail
                });
            }

            return {
                success: true,
                inventoryCountId: requestParams.inventoryCountId,
                totalLines: lineCount,
                items: items
            };

        } catch (e) {
            log.error({ title: 'Error in GET Inventory Count', details: e });
            return {
                success: false,
                message: e.message,
                errorDetails: e
            };
        }
    };

    /**
     * POST handler
     * @param {Object} requestBody - The parsed JSON request body
     * @returns {string | Object} HTTP response body
     */
    const post = (requestBody) => {
        try {
            // Validate required parameters
            if (!requestBody.inventoryCountId || !requestBody.itemId) {
                throw error.create({
                    name: 'MISSING_REQD_FIELDS',
                    message: 'Missing required fields: inventoryCountId and itemId are required.'
                });
            }

            const {
                inventoryCountId,
                itemId,
                countQuantity,
                binNumber,
                inventoryDetail // Array of objects mapping to countdetail/inventorydetail lines
            } = requestBody;

            // Load the Inventory Count record
            const inventoryCountRec = record.load({
                type: record.Type.INVENTORY_COUNT,
                id: inventoryCountId,
                isDynamic: true
            });

            // Add new line to the 'item' sublist
            inventoryCountRec.selectNewLine({
                sublistId: 'item'
            });

            // Set the item ID
            inventoryCountRec.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                value: itemId
            });

            // Set the counted quantity if provided
            if (countQuantity !== undefined && countQuantity !== null) {
                inventoryCountRec.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'countquantity',
                    value: countQuantity
                });
            }

            // Set the bin number if provided on the line level
            if (binNumber) {
                inventoryCountRec.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'binnumber',
                    value: binNumber
                });
            }

            // Handle Inventory Detail (for serialized or lot-numbered items)
            if (inventoryDetail && Array.isArray(inventoryDetail) && inventoryDetail.length > 0) {
                const inventoryDetailSubrec = inventoryCountRec.getCurrentSublistSubrecord({
                    sublistId: 'item',
                    fieldId: 'inventorydetail'
                });

                for (let i = 0; i < inventoryDetail.length; i++) {
                    const detail = inventoryDetail[i];
                    
                    inventoryDetailSubrec.selectNewLine({
                        sublistId: 'inventoryassignment'
                    });

                    // receiptinventorynumber is used to set the lot/serial number
                    if (detail.receiptinventorynumber) {
                        inventoryDetailSubrec.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'receiptinventorynumber',
                            value: detail.receiptinventorynumber
                        });
                    }

                    // issueinventorynumber can be used depending on movement type
                    if (detail.issueinventorynumber) {
                        inventoryDetailSubrec.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'issueinventorynumber',
                            value: detail.issueinventorynumber
                        });
                    }

                    if (detail.binnumber) {
                        inventoryDetailSubrec.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'binnumber',
                            value: detail.binnumber
                        });
                    }

                    if (detail.status) {
                        // Inventory status (if feature is enabled)
                        inventoryDetailSubrec.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'inventorystatus',
                            value: detail.status
                        });
                    }

                    inventoryDetailSubrec.setCurrentSublistValue({
                        sublistId: 'inventoryassignment',
                        fieldId: 'quantity',
                        value: detail.quantity || countQuantity
                    });

                    inventoryDetailSubrec.commitLine({
                        sublistId: 'inventoryassignment'
                    });
                }
            }

            // Commit the item line
            inventoryCountRec.commitLine({
                sublistId: 'item'
            });

            // Save the Inventory Count record
            const updatedId = inventoryCountRec.save({
                enableSourcing: true,
                ignoreMandatoryFields: false
            });

            return {
                success: true,
                message: 'Successfully added item to Inventory Count.',
                inventoryCountId: updatedId
            };

        } catch (e) {
            log.error({
                title: 'Error in Inventory Count RESTlet',
                details: e
            });
            return {
                success: false,
                message: e.message,
                errorDetails: e
            };
        }
    };

    return {
        get: get,
        post: post
    };
});
