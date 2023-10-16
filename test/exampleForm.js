/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'], (serverWidget) => {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            let form = serverWidget.createForm({
                title: 'Simple Form'
            });
            let field = form.addField({
                id: 'custpage_text',
                type: serverWidget.FieldType.TEXT,
                label: 'Text'
            });
            field.layoutType = serverWidget.FieldLayoutType.NORMAL;
            field.updateBreakType({
                breakType: serverWidget.FieldBreakType.STARTCOL
            });
            form.addField({
                id: 'custpage_date',
                type: serverWidget.FieldType.DATE,
                label: 'Date'
            });
            form.addField({
                id: 'custpage_currencyfield',
                type: serverWidget.FieldType.CURRENCY,
                label: 'Currency'
            });
            let select = form.addField({
                id: 'custpage_selectfield',
                type: serverWidget.FieldType.SELECT,
                label: 'Select'
            });
            select.addSelectOption({
                value: 'a',
                text: 'Albert'
            });
            select.addSelectOption({
                value: 'b',
                text: 'Baron'
            });
            let sublist = form.addSublist({
                id: 'sublist',
                type: serverWidget.SublistType.INLINEEDITOR,
                label: 'Inline Editor Sublist'
            });
            sublist.addField({
                id: 'sublist1',
                type: serverWidget.FieldType.DATE,
                label: 'Date'
            });
            sublist.addField({
                id: 'sublist2',
                type: serverWidget.FieldType.TEXT,
                label: 'Text'
            });
            form.addSubmitButton({
                label: 'Submit Button'
            });
            context.response.writePage(form);
        } else {
            const delimiter = /\u0001/;
            let textField = context.request.parameters.textfield;
            let dateField = context.request.parameters.datefield;
            let currencyField = context.request.parameters.currency
            field;
            let selectField = context.request.parameters.selectfield;
            let sublistData = context.request.parameters.sublistda
            ta.split(delimiter);
            let sublistField1 = sublistData[0];
            let sublistField2 = sublistData[1];
            context.response.write('You have entered: ' + textField
                + ' ' + dateField + ' '
                + currencyField + ' ' + selectField + ' ' + sublistField1 + ' ' + sublistField2);
        }
    }
    return {
        onRequest: onRequest
    };
});