/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record'], function(record) {
  function createBinTransferFromWorkOrder(context) {
    if (context.type === context.UserEventType.CREATE) {
      var newRecord = context.newRecord;

      // Get the line count of the work order
      var lineCount = newRecord.getLineCount({
        sublistId: 'item'
      });

      // Create a new inventory transfer record
      var transferRecord = record.create({
        type: record.Type.INVENTORY_TRANSFER
      });

      // Set the subsidiary and other relevant fields
      transferRecord.setValue({
        fieldId: 'subsidiary',
        value: newRecord.getValue('subsidiary')
      });
      // Set other fields as needed

      // Loop through the work order lines and add them to the transfer record
      for (var i = 0; i < lineCount; i++) {
        var item = newRecord.getSublistValue({
          sublistId: 'item',
          fieldId: 'item',
          line: i
        });
        var quantity = newRecord.getSublistValue({
          sublistId: 'item',
          fieldId: 'quantity',
          line: i
        });

        // Add the line to the transfer record
        transferRecord.selectNewLine({
          sublistId: 'inventory'
        });
        transferRecord.setCurrentSublistValue({
          sublistId: 'inventory',
          fieldId: 'item',
          value: item
        });
        transferRecord.setCurrentSublistValue({
          sublistId: 'inventory',
          fieldId: 'quantity',
          value: quantity
        });
        // Set other line fields as needed
        transferRecord.commitLine({
          sublistId: 'inventory'
        });
      }

      // Save the transfer record
      var transferRecordId = transferRecord.save();

      log.debug('Transfer Record Created', 'Transfer Record ID: ' + transferRecordId);
    }
  }

  return {
    afterSubmit: createBinTransferFromWorkOrder
  };
});
