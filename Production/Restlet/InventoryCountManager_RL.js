/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 *
 * Description: RESTlet to manage the full lifecycle of an Inventory Count via API:
 * 1. Create Inventory Count
 * 2. Add Count Details (Quantities & Inventory/Count detail subrecords)
 * 3. Approve Inventory Count
 */
define(['N/record', 'N/error', 'N/action'], (record, error, action) => {

    /**
     * POST handler
     * Expected payload format:
     * {
     *   "actionType": "create" | "updateDetail" | "approve",
     *   "payload": { ... } // Varies based on actionType
     * }
     */
    const post = (requestBody) => {
        try {
            const { actionType, payload } = requestBody;

            if (!actionType) {
                throw error.create({
                    name: 'MISSING_ACTION',
                    message: 'Missing actionType. Must be "create", "updateDetail", or "approve".'
                });
            }

            switch (actionType) {
                case 'create':
                    return createInventoryCount(payload);
                case 'updateDetail':
                    return addCountDetail(payload);
                case 'approve':
                    return approveInventoryCount(payload);
                default:
                    throw error.create({
                        name: 'INVALID_ACTION',
                        message: `Invalid actionType: ${actionType}`
                    });
            }
        } catch (e) {
            log.error({ title: 'Error in Inventory Count API', details: e });
            return {
                success: false,
                message: e.message,
                errorDetails: e
            };
        }
    };

    /**
     * Creates a new Inventory Count record and adds items to be counted.
     * @param {Object} payload 
     * @returns {Object} response
     */
    const createInventoryCount = (payload) => {
        const countRec = record.create({
            type: record.Type.INVENTORY_COUNT,
            isDynamic: true
        });

        if (payload.location) {
            countRec.setValue({ fieldId: 'location', value: payload.location });
        }
        if (payload.subsidiary) {
            countRec.setValue({ fieldId: 'subsidiary', value: payload.subsidiary });
        }
        if (payload.account) {
            countRec.setValue({ fieldId: 'account', value: payload.account });
        }
        if (payload.memo) {
            countRec.setValue({ fieldId: 'memo', value: payload.memo });
        }

        // Add items to the count
        if (payload.items && payload.items.length > 0) {
            payload.items.forEach(itemInfo => {
                countRec.selectNewLine({ sublistId: 'item' });
                countRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: itemInfo.itemId });
                
                if (itemInfo.binNumber) {
                    countRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'binnumber', value: itemInfo.binNumber });
                }

                countRec.commitLine({ sublistId: 'item' });
            });
        }

        const countId = countRec.save({
            enableSourcing: true,
            ignoreMandatoryFields: false
        });
        
        return {
            success: true,
            message: 'Inventory Count created successfully.',
            inventoryCountId: countId
        };
    };

    /**
     * Updates an existing Inventory Count to add counted quantities and inventory details (lots/serials/bins).
     * @param {Object} payload 
     * @returns {Object} response
     */
    const addCountDetail = (payload) => {
        if (!payload.inventoryCountId) {
            throw error.create({ name: 'MISSING_ID', message: 'inventoryCountId is required to complete the count.' });
        }

        const countRec = record.load({
            type: record.Type.INVENTORY_COUNT,
            id: payload.inventoryCountId,
            isDynamic: true
        });

        const lineCount = countRec.getLineCount({ sublistId: 'item' });
        
        if (payload.lines && payload.lines.length > 0) {
            payload.lines.forEach(detailLine => {
                // Match the line with the correct item ID
                let lineIndex = -1;
                for (let i = 0; i < lineCount; i++) {
                    const existingItem = countRec.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i });
                    if (String(existingItem) === String(detailLine.itemId)) {
                        lineIndex = i;
                        break;
                    }
                }

                if (lineIndex !== -1) {
                    countRec.selectLine({ sublistId: 'item', line: lineIndex });
                    
                    // Set counted quantity on the item line
                    if (detailLine.countQuantity !== undefined) {
                        countRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'countquantity', value: detailLine.countQuantity });
                    }

                    // Set subrecord for inventory detail (countdetail)
                    if (detailLine.inventoryDetail && Array.isArray(detailLine.inventoryDetail)) {
                        const inventoryDetailSubrec = countRec.getCurrentSublistSubrecord({
                            sublistId: 'item',
                            fieldId: 'inventorydetail'
                        });
                        
                        detailLine.inventoryDetail.forEach(invDet => {
                            inventoryDetailSubrec.selectNewLine({ sublistId: 'inventoryassignment' });
                            
                            if (invDet.receiptinventorynumber) {
                                inventoryDetailSubrec.setCurrentSublistValue({ sublistId: 'inventoryassignment', fieldId: 'receiptinventorynumber', value: invDet.receiptinventorynumber });
                            }
                            if (invDet.issueinventorynumber) {
                                inventoryDetailSubrec.setCurrentSublistValue({ sublistId: 'inventoryassignment', fieldId: 'issueinventorynumber', value: invDet.issueinventorynumber });
                            }
                            if (invDet.binnumber) {
                                inventoryDetailSubrec.setCurrentSublistValue({ sublistId: 'inventoryassignment', fieldId: 'binnumber', value: invDet.binnumber });
                            }
                            inventoryDetailSubrec.setCurrentSublistValue({ sublistId: 'inventoryassignment', fieldId: 'quantity', value: invDet.quantity });
                            
                            inventoryDetailSubrec.commitLine({ sublistId: 'inventoryassignment' });
                        });
                    }
                    
                    countRec.commitLine({ sublistId: 'item' });
                }
            });
        }

        const updatedId = countRec.save({
            enableSourcing: true,
            ignoreMandatoryFields: false
        });
        
        return {
            success: true,
            message: 'Count Details added successfully.',
            inventoryCountId: updatedId
        };
    };

    /**
     * Approves the Inventory Count.
     * @param {Object} payload 
     * @returns {Object} response
     */
    const approveInventoryCount = (payload) => {
        if (!payload.inventoryCountId) {
            throw error.create({ name: 'MISSING_ID', message: 'inventoryCountId is required.' });
        }

        // Approach 1: Try using standard submitFields for Approval Status if that's the setup
        // 2 represents Approved in standard Next Level Approvals setup
        try {
            const updatedId = record.submitFields({
                type: record.Type.INVENTORY_COUNT,
                id: payload.inventoryCountId,
                values: {
                    approvalstatus: 2
                },
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                }
            });

            return {
                success: true,
                message: 'Inventory Count approved successfully via submitFields.',
                inventoryCountId: updatedId
            };
        } catch (e) {
            log.audit('Approval via submitFields failed, attempting N/action', e);
            
            // Approach 2: Use N/action API if proper buttons or workflow actions are configured
            // action.execute({
            //     recordType: record.Type.INVENTORY_COUNT,
            //     id: payload.inventoryCountId,
            //     action: 'approve'
            // });

            // Approach 3: Load, mark approved field and save
            const countRec = record.load({
                type: record.Type.INVENTORY_COUNT,
                id: payload.inventoryCountId,
                isDynamic: true
            });
            
            // Modify these field IDs based on the Custom Form in use if needed
            countRec.setValue({ fieldId: 'approvalstatus', value: 2 });
            const savedId = countRec.save();
            
            return {
                success: true,
                message: 'Inventory Count approved successfully via record save.',
                inventoryCountId: savedId
            };
        }
    };

    return {
        post: post
    };
});
