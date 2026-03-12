/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/log'], function (record, search, log) {

    /**
     * Defines the WorkflowAction script trigger point.
     * 
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
     * @param {string} scriptContext.type - Record type
     * @param {string} scriptContext.form - Form ID
     * @returns {number|string|boolean} - Return value corresponding to the return type defined in the custom action
     */
    function onAction(scriptContext) {
        log.debug({
            title: 'Workflow Action Triggered',
            details: 'Workflow ID: ' + scriptContext.workflowId
        });

        var newRecord = scriptContext.newRecord;
        var oldRecord = scriptContext.oldRecord;

        try {
            // Write your custom workflow action logic here...

            // Example:
            // var entityId = newRecord.getValue({ fieldId: 'entity' });

            // Return a value if the workflow action requires it 
            // (e.g., matching the parameter return-type configured in NetSuite)
            // return true; 

        } catch (error) {
            log.error({
                title: 'Error in Workflow Action Script',
                details: error.message
            });

            // throw error; // Optional depending on requirement
        }
    }

    return {
        onAction: onAction
    };
});
