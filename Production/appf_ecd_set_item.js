/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/search'], (search) => {
    function fieldChanged (context) {
      try {
        const recInvoice = context.currentRecord;
        const stCurrField = context.fieldId;
        const stCurrSublist = context.sublistId;
        // Get Model Make
        if (stCurrField === 'custbody_appf_veh_model') {
          const billingitem = recInvoice.getValue({
            fieldId: 'custbody_appf_veh_model'
          });
          // alert(billingitem);
          if (billingitem != '' && billingitem != null  ) {
          recInvoice.selectLine({
              sublistId: 'item',
              line: 0
          });
          recInvoice.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'item',
            value: billingitem,
            ignoreFieldChange: false,
          forceSyncSourcing: true
          });
          recInvoice.commitLine({
              sublistId: 'item'
  });
        
      }}
            if (stCurrSublist === 'item' && stCurrField === 'custcol_appf_bom') {
          const customBom = recInvoice.getCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'custcol_appf_bom'
          });
          recInvoice.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'item',
            value: customBom,
            ignoreFieldChange: true,
          forceSyncSourcing: false
          });
  
          
      }} catch (e) {
        alert(e);
      }
    }
    return {
      fieldChanged: fieldChanged
    };
  });