/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope Public
 */

define(['N/search', 'N/currentRecord'], function(search,currentRecord) {
    var record = currentRecord.get();

    function fieldChanged(context) {
        if(context.fieldId == 'custpage_location') {
            var location = record.getValue('custpage_location');

            if(location == '') return;

            var vendorSearch = search.create({
                type: 'vendor',
                filters: [['custentity_location','is',location]],
                columns: ['entityid']
            });

            var vendorSearchResults = vendorSearch.run().getRange({ start: 0, end: 1000 });

            var vendfield = record.getField('custpage_vendor');
            vendfield.removeSelectOption({value : null});
            if(vendorSearchResults.length != 0) {
                for(var i in vendorSearchResults) {
                    vendfield.insertSelectOption({
                        value : vendorSearchResults[i].id,
                        text : vendorSearchResults[i].getValue('entityid')
                    });
                }
            }
        }
    }

    return { fieldChanged : fieldChanged };

});