/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */

define(['N/ui/serverWidget'], function(serverWidget) {

    function onRequest(context) {
        try {
            if (context.request.method == 'GET') {
                var form = serverWidget.createForm({ title: 'LCC POC' });

                form.addField({
                    id: 'custpage_location',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Location',
                    source: 'location'
                });

                form.addField({
                    id: 'custpage_vendor',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Vendor',
                    source: 'vendor'
                });

                form.clientScriptModulePath = './lcc_cs_filter_select_field.js';
                context.response.writePage(form);
            } else {

            }

        } catch(e) {
            log.debug('onRequest:error',e);
        }
    }

    return {
        onRequest: onRequest
    };


});