/**
 * @NApiVersion 2.x
 * @NScriptType WorkAction
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/log'], function(record, log) {
    
    function onAction(context) {
        try {
            var workflowRecord = context.workflowRecord;
            var recordId = workflowRecord.id;
            var recordType = workflowRecord.type;
            
            log.debug({
                title: 'Work Action Triggered',
                details: 'Record: ' + recordType + ' ID: ' + recordId
            });
            
            // Add your business logic here
            
            return true;
        } catch (error) {
            log.error({
                title: 'Error in Work Action',
                details: error.message
            });
            return false;
        }
    }
    
    return {
        onAction: onAction
    };
});