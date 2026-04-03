/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 *
 * Description: RESTlet to manage the full lifecycle of an Inventory Count in a single API call:
 * 1. Creates Inventory Count
 * 2. Reloads the count to add Count Details (Quantities & countdetail subrecords)
 * 3. Approves the Inventory Count
 */
define(['N/record', 'N/action', 'N/error'], (record, action, error) => {

    /**
     * POST handler
     * Expected payload format:
     * {
     *   "location": 1,
     *   "subsidiary": 1,
     *   "account": 1,
     *   "memo": "All-in-one count API",
     *   "items": [
     *     {
     *       "itemId": 123,
     *       "binNumber": 456,
     *       "countQuantity": 50,
     *       "inventoryDetail": [
     *         {
     *           "receiptinventorynumber": "LOT1",
     *           "quantity": 50
     *         }
     *       ]
     *     }
     *   ]
     * }
     */
    const post = (payload) => {
        try {
            if (!payload.location) {
                throw error.create({
                    name: 'MISSING_REQD_FIELDS',
                    message: 'Missing required field: location is required.'
                });
            }

            // ==========================================
            // STEP 1: CREATE INVENTORY COUNT (Add Items)
            // ==========================================
            const countRec = record.create({
                type: record.Type.INVENTORY_COUNT,
                isDynamic: false
            });

            countRec.setValue({ fieldId: 'location', value: payload.location });
            if (payload.subsidiary) countRec.setValue({ fieldId: 'subsidiary', value: payload.subsidiary });
            if (payload.account) countRec.setValue({ fieldId: 'account', value: payload.account });
            if (payload.memo) countRec.setValue({ fieldId: 'memo', value: payload.memo });

            if (payload.items && payload.items.length > 0) {
                payload.items.forEach(itemInfo => {

                    countRec.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: 0,
                        value: itemInfo.itemId // Replace with actual item ID
                    });
                    countRec.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'binnumber',
                        line: 0,
                        value: itemInfo.binNumber // Replace with actual bin ID
                    });
                });
            }

            const initialCountId = countRec.save({
                enableSourcing: true,
                ignoreMandatoryFields: false
            });

            // ==========================================
            // STEP 1B: START THE INVENTORY COUNT
            // ==========================================
            try {
                action.execute({
                    id: 'startcount',
                    recordType: record.Type.INVENTORY_COUNT,
                    params: { recordId: initialCountId },

                });
                log.debug('Step 1B Complete', `Started Inventory Count: ${initialCountId} via N/action`);
            } catch (startCountErr) {
                log.error('Error starting count via N/action', startCountErr);
                throw error.create({
                    name: 'START_COUNT_FAILED',
                    message: `Failed to start inventory count. Details: ${startCountErr.message}`
                });
            }

            // ==========================================
            // STEP 2: RE-LOAD AND ADD COUNT DETAILS
            // ==========================================
            const countUpdateRec = record.load({
                type: record.Type.INVENTORY_COUNT,
                id: initialCountId,
                isDynamic: true
            });

            var memo = '';
            const lineCount = countUpdateRec.getLineCount({ sublistId: 'item' });
            let shouldApprove = true;

            if (payload.items && payload.items.length > 0) {
                payload.items.forEach(detailLine => {
                    var lineIndex = -1;
                    // Find the line index matching the item
                    lineIndex = countRec.findSublistLineWithValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: detailLine.itemId // Replace with your Item ID
                    });

                    if (lineIndex !== -1) {

                        // Set the inventory details (Lots/Serials/Bins)
                        countUpdateRec.selectLine({ sublistId: 'item', line: lineIndex });


                        // Set the counted quantity
                        if (detailLine.countQuantity !== undefined) {
                            countUpdateRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'countquantity', value: detailLine.countQuantity });

                            // Check variance against on-hand snapshot
                            const snapshotQty = Number(parseFloat(countUpdateRec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'snapshotquantity' })));
                            const rate = Number(parseFloat(countUpdateRec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'rate' })));
                            const countQty = Number(parseFloat(detailLine.countQuantity));

                            let diffPercentage = 0;
                            if (snapshotQty === 0) {
                                if (countQty !== 0) { diffPercentage = 1; } // 100% diff if expecting 0 but counted some
                            } else {
                                diffPercentage = Math.abs(countQty - snapshotQty) / Math.abs(snapshotQty);
                                diffValuepercent = Math.abs((countQty * rate) - (snapshotQty * rate)) / Math.abs(snapshotQty * rate);
                            }

                            if (diffPercentage > 0.10) {
                                shouldApprove = false;
                                memo = `10% Quantity variance exceeded on item ${detailLine.itemId}. Snapshot: ${snapshotQty}, Counted: ${countQty}`;
                                log.debug('Approval Blocked', `10% Quantity variance exceeded on item ${detailLine.itemId}. Snapshot: ${snapshotQty}, Counted: ${countQty}`);
                            }
                            else if (diffValuepercent > 0.10) {
                                shouldApprove = false;
                                memo = `10% Value variance exceeded on item ${detailLine.itemId}. Snapshot: ${snapshotQty}, Counted: ${countQty}`;
                                log.debug('Approval Blocked', `10% Value variance exceeded on item ${detailLine.itemId}. Snapshot: ${snapshotQty}, Counted: ${countQty}`);
                            }
                            else if (countQty === 0) {
                                shouldApprove = false;
                                memo = `Counted quantity is 0 on item ${detailLine.itemId}.`;
                                log.debug('Approval Blocked', `Counted quantity is 0 on item ${detailLine.itemId}.`);
                            }
                            countUpdateRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'memo', value: memo });
                        }

                        // 3. Access the subrecord (countdetail)
                        var countDetailSubrecord = countUpdateRec.getCurrentSublistSubrecord({
                            sublistId: 'item',
                            fieldId: 'countdetail'
                        });

                        // 4. Add a new line to the subrecord (e.g., for Bin/Serial/Lot)
                        countDetailSubrecord.selectNewLine({ sublistId: 'inventorydetail' });
                        countDetailSubrecord.setCurrentSublistValue({
                            sublistId: 'inventorydetail',
                            fieldId: 'binnumber', // Or 'serialnumber' / 'lotnumber'
                            value: detailLine.binNumber // Internal ID of the Bin
                        });
                        countDetailSubrecord.setCurrentSublistValue({
                            sublistId: 'inventorydetail',
                            fieldId: 'quantity',
                            value: detailLine.countQuantity // Counted Quantity
                        });
                        countDetailSubrecord.setCurrentSublistValue({
                            sublistId: 'inventorydetail',
                            fieldId: 'inventorystatus',
                            value: 1
                        });

                        countDetailSubrecord.commitLine({ sublistId: 'inventorydetail' });

                        // 5. Commit the item line and save the record
                        countUpdateRec.commitLine({ sublistId: 'item' });
                    }
                });
            }
            log.debug('Step 2 Before Save', countUpdateRec);
            const countedId = countUpdateRec.save();

            log.debug('Step 2 Complete', `Added Count Details to: ${countedId}`);

            // ==========================================
            // STEP 3: APPROVE THE INVENTORY COUNT
            // ==========================================
            let finalStatus = 'Pending Approval';
            if (shouldApprove) {
                try {
                    actionMod.executeAction({
                        id: 'approve', // Action ID for approval
                        recordType: 'inventorycount',
                        params: {
                            recordId: countedId // Replace with your Inventory Count ID
                        }
                    });
                    finalStatus = 'Approved';
                } catch (approvalError) {
                    log.audit('Approval status submitFields failed, trying full record save', approvalError);
                    finalStatus = 'Approved';
                }
                log.debug('Step 3 Complete', `Approved Inventory Count: ${countedId}`);
            } else {
                log.debug('Step 3 Skipped', `Count ${countedId} exceeded 10% discrepancy. Left as Pending Approval.`);
            }

            // Final cohesive response
            return {
                success: true,
                message: shouldApprove
                    ? 'Inventory Count successfully created, detailed, and approved in one operation.'
                    : 'Inventory Count created and detailed. Approval skipped due to >10% variance on one or more items.',
                inventoryCountId: initialCountId,
                memo: memo,
                status: finalStatus
            };

        } catch (e) {
            log.error({ title: 'Error in All-In-One Inventory Count API', details: e });
            return {
                success: false,
                message: e.message,
                errorDetails: e
            };
        }
    };

    return { post };
});
