/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(["N/log","N/record","N/search", 'N/ui/dialog',"N/runtime", "/SuiteScripts/Modules/generaltoolsv1.js"], function(log, record, search, nDialog,runtime, GENERALTOOLS) {
    function pageInit(context) {
        // Code to execute when the page loads
        var currentRecord = context.currentRecord;
        var subsidiaryId = currentRecord.getValue({ fieldId: "subsidiary" });

        // Load the subsidiary record
        var subsidiaryRecord = record.load({
            type: record.Type.SUBSIDIARY,
            id: subsidiaryId,
            isDynamic: false
        });

        var shippingAddress = currentRecord.getValue({ fieldId: "shippingaddress_text" });
        

        if (!shippingAddress) {
           
            currentRecord.setValue({ fieldId: "shippingaddress_text", value: subsidiaryRecord.getValue({ fieldId: "shippingaddress_text" }) });
            log.debug("shippingAddress", currentRecord.getValue({ fieldId: "shippingaddress_text" }));
        }
    }
    function printrn(url) {
        console.log(url);
        window.open(url, "_blank");
      }
    function fieldChanged(context) {
        // Code to execute when a field value changes
        var currentRecord = context.currentRecord;
        var sublistId = context.sublistId
        var fieldId = context.fieldId;

        var entityname= currentRecord.getValue({ fieldId: 'entityname'});

        if (fieldId === 'custbody_vendorshipmethod') {


            var idcarrier= currentRecord.getValue({ fieldId: 'custbody_vendorshipmethod'});
            var entityname= currentRecord.getValue({ fieldId: 'entity'});
            
            var vendorShipMethodRecord = record.load({
                type: 'customrecord_vendorshipmethod',
                id: idcarrier,  
                isDynamic: false
            });

            var carrierValue = vendorShipMethodRecord.getValue({
                fieldId: 'custrecord_vendorshippcarrier'
            });
            currentRecord.setValue({ fieldId: 'custbody_vendorcurriership', value: carrierValue});
            
}
            

}
    function sublistChanged(context) {

        var currentRecord = context.currentRecord;
        var sublistId = context.sublistId;
        var fieldId = context.fieldId;
        var entity= currentRecord.getValue({ fieldId: 'entity'});
        var entityname= currentRecord.getText({ fieldId: 'entity'});
        var currancy= currentRecord.getValue({ fieldId: 'currency'});
        log.debug('currentRecord', currentRecord);
        console.log('currentRecord', currentRecord);
        log.debug('entityname', entityname);
        log.debug('entity', entity);
        
        var line = context.line;
        log.debug('sublistId', sublistId);
        if (sublistId === "item") {
            
            var itemId = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: "item"
            });
          
            var rate = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: "rate"
            });
            var vendorcode = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: "custcol_vendorcode"
            });
            log.debug('rate1', rate);
            if (itemId && rate) {
                paramitem = GENERALTOOLS.get_Item_basic(itemId);
                paramdata = paramitem.data;
                
                log.debug('paramdata', paramdata.recordtype);
                typerecord=paramdata.recordtype;
                log.debug('typerecord', typerecord);

                try {
                    var itemBodyFields = record.load({
                    type: typerecord,
                    id: itemId,
                    isDynamic: true,
                    defaultValues: null
                });
                    log.debug("itemId",itemId);
                }
                catch(err) {
                    try {
                    var itemBodyFields = record.load({
                        type: "noninventoryitem",
                        id: itemId,
                        isDynamic: true,
                        defaultValues: null
                    });
                        log.debug("itemId",itemId);
                    }
                    catch(err) {
                       
                            log.debug("itemId",itemId);
                        }

                    }
                try {
                var lineNumber = itemBodyFields.findSublistLineWithValue({
                    sublistId: 'itemvendor',
                    fieldId: 'vendor_display',
                    value: entityname
                });
                errorv="F";
            } catch (err) {errorv="V";}
            if (errorv!="V") {
                var lineCount = itemBodyFields.getLineCount({
                    sublistId: 'itemvendor'
                });
                log.debug('lineCount', lineCount);

                log.debug("lineNumber", lineNumber);
                if (lineNumber != -1) {
                    itemBodyFields.removeLine({sublistId: "itemvendor", line: lineNumber});
                    
                }
                    log.debug("entity", entity);
                    itemBodyFields.selectNewLine({sublistId: "itemvendor"});
                    itemBodyFields.setCurrentSublistValue({sublistId: "itemvendor", fieldId: "preferredvendor", value: true});

                    if (vendorcode) {
                    itemBodyFields.setCurrentSublistValue({sublistId: "itemvendor", fieldId: "vendorcode", value: vendorcode});
                    }
                    itemBodyFields.setCurrentSublistValue({sublistId: "itemvendor", fieldId: "purchaseprice", value: rate});
                    itemBodyFields.setCurrentSublistValue({sublistId: "itemvendor", fieldId: "vendorcurrencyid", value: currancy});
                    itemBodyFields.setCurrentSublistValue({sublistId: "itemvendor", fieldId: "vendor", value: entity});
                    itemBodyFields.commitLine({sublistId: "itemvendor"});
                    itemBodyFields.save({enableSourcing: true});
            }
        }
           
       }

    }

    function saveRecord(context) {
        // Code to execute when the record is saved
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        sublistChanged: sublistChanged,
        printrn: printrn
        // saveRecord: saveRecord
    };
});
