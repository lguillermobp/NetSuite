/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 *
 * Version    Date               Author              Remarks
 * 1.00       27th Oct 2025      Darian Saldaña      Case: #6609998 Initial commit
 */

define(['N/record', 'N/runtime', 'N/ui/serverWidget'], (record, runtime, serverWidget) => {

    function afterSubmit(context) {
        try {
            const { newRecord, type } = context;

            if (![context.UserEventType.CREATE, context.UserEventType.EDIT].includes(type)) {
                return;
            }

            const recId = newRecord.id;
            const recType = newRecord.type;

            const relatedWo = newRecord.getValue('custbody_mo');
            const tobecommitted = newRecord.getValue('custbody_tobe_committed');
            const location = newRecord.getValue('transferlocation');
            if (tobecommitted) {return;}

            log.debug('AfterSubmit Triggered', {
                recordType: recType,
                recordId: recId,
                relatedWorkOrder: relatedWo,
                location: location
            });

            if (!relatedWo) {
                log.debug('No related WO', 'Skipping allocation process.');
                return;
            }

            const inventoryCount = newRecord.getLineCount({ sublistId: 'inventory' });
            if (inventoryCount <= 0) {
                log.debug('No inventory lines', 'Skipping.');
                return;
            }

            const itemDataMap = extractInventoryLines(newRecord);

            if (Object.keys(itemDataMap).length === 0) {
                log.debug('No item data extracted', 'Skipping.');
                return;
            }

            // Load Work Order for SO reference
            const woRec = record.load({ type: 'workorder', id: relatedWo });
            const woId = relatedWo;

            if (!woId) {
                log.error('Missing SO', `WO ${relatedWo} does not have "Created From" value.`);
                return;
            }

            const allocationData = transformItemData(itemDataMap, woId, location);
            log.debug('Final Allocation Data', allocationData);

            // Run allocation per item
            allocationData.forEach(item => {
                const remaining = runAllocationProcess(item, item.quantity);
                if (remaining > 0) {
                    log.debug('Unallocated Qty', {
                        itemId: item.item,
                        remaining: remaining
                    });
                }
            });

        } catch (e) {
            log.error('Unexpected Error in afterSubmit', e);
        }
    }

    function extractInventoryLines(newRecord) {
        const itemData = {};
        const lineCount = newRecord.getLineCount({ sublistId: 'inventory' });

        for (let i = 0; i < lineCount; i++) {
            const item = newRecord.getSublistValue({ sublistId: 'inventory', fieldId: 'item', line: i });
            const qty = newRecord.getSublistValue({ sublistId: 'inventory', fieldId: 'adjustqtyby', line: i });
            const woLineId = newRecord.getSublistValue({ sublistId: 'inventory', fieldId: 'custcol_wo_line_id', line: i });

            if (!woLineId) continue;

            itemData[woLineId] = {
                itemId: item,
                quantity: qty
            };
        }

        return itemData;
    }

    function transformItemData(itemDataMap, woId, location) {
        return Object.keys(itemDataMap).map(key => ({
            woId: woId,
            item: itemDataMap[key].itemId,
            location: location,
            quantity: itemDataMap[key].quantity
        }));
    }

    function runAllocationProcess(itemData, qtyToAllocate) {
        try {

            const realloc = record.create({ type: 'reallocateitem', isDynamic: true });
            realloc.setValue('item', itemData.item);
            realloc.setValue('location', itemData.location);

            //const uncommitted = uncommitFromOldestSalesOrders(realloc, itemData.woId, qtyToAllocate);
            const uncommitted = qtyToAllocate;

            commitToCurrentSalesOrder(realloc, itemData.woId, uncommitted, qtyToAllocate);

            return Math.max(0, qtyToAllocate - uncommitted);

        } catch (e) {
            log.error('Error in runAllocationProcess', e);
            return qtyToAllocate;
        }
    }

    function uncommitFromOldestSalesOrders(realloc, currentwoId, qtyToAllocate) {
        let total = 0;
        const sublistId = 'order';
        const count = realloc.getLineCount({ sublistId });

        for (let i = 0; i < count && total < qtyToAllocate; i++) {
            realloc.selectLine({ sublistId, line: i });

            const woId = realloc.getCurrentSublistValue({ sublistId, fieldId: 'orderid' });
            const committed = realloc.getCurrentSublistValue({ sublistId, fieldId: 'quantitycommitted' });

            if (!committed || woId === currentwoId) continue;

            const uncommitQty = Math.min(qtyToAllocate - total, committed);

            realloc.setCurrentSublistValue({ sublistId, fieldId: 'commit', value: false });
            realloc.setCurrentSublistValue({ sublistId, fieldId: 'quantitycommitted', value: committed - uncommitQty });
            realloc.commitLine({ sublistId });

            total += uncommitQty;
        }

        return total;
    }

    function commitToCurrentSalesOrder(realloc, woId, uncommittedQty, qtyToAllocate) {
        if (uncommittedQty <= 0) return;

        const sublistId = 'order';
        let remainingCommit = Math.min(uncommittedQty, qtyToAllocate);
        const count = realloc.getLineCount({ sublistId });

        for (let i = 0; i < count && remainingCommit > 0; i++) {
            realloc.selectLine({ sublistId, line: i });
            const linewoId = realloc.getCurrentSublistValue({ sublistId, fieldId: 'orderid' });
            const commiton = realloc.getCurrentSublistValue({ sublistId, fieldId: 'commit' });

            if (linewoId != woId) continue;

            var qtyRemaining = Number(realloc.getCurrentSublistValue({ sublistId, fieldId: 'quantityremaining' }));
            var qtCommited = Number(realloc.getCurrentSublistValue({ sublistId, fieldId: 'quantitycommitted' }));
            if (qtyRemaining <= 0) continue;

            qtyRemaining = Math.min(remainingCommit, qtyRemaining);

            realloc.setCurrentSublistValue({ sublistId, fieldId: 'commit', value: true });
            realloc.setCurrentSublistValue({ sublistId, fieldId: 'quantitycommitted', value: (qtyRemaining + qtCommited) });
            realloc.commitLine({ sublistId });

            remainingCommit -= qtyRemaining;
        }

        realloc.save();
    }

    return { afterSubmit };
});