/**
 * @NScriptName NetSuite Tools TS Test
 * @NScriptId _netsuite_tools_ts_test
 * @NScriptType UserEventScript
 * @NApiVersion 2.x
 */

define(['N/search', 'N/record'], function(search, record) {
    return Object.freeze({
        beforeLoad: function(context) {
            context.form.addField('custpage_myfield2', 'text', 'My field 2!').setDefaultValue('OMG');
            search.create({ type: record.Type.CUSTOMER }).run().each(function(result) {
                log.debug("Customer", result.id);
                return true;
            });
        }
    });
});