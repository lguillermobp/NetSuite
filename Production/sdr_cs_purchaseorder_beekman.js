/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/log","N/record","N/search", 'N/ui/dialog',"N/runtime", "/SuiteScripts/Modules/generaltoolsv1.js"],

    function(log, r, search, nDialog,runtime, GENERALTOOLS) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(context) {


            var currentRecord = context.currentRecord;
            balance = currentRecord.getValue({fieldId: "balance"});

            if (balance < 0)
            {
                var userObj = runtime.getCurrentUser();
                var userID = userObj.id;

                var parammsg = GENERALTOOLS.get_message_value('SYS_00001',userID);
                var msgdes= parammsg.data.getValue({name: "custrecord_msgdes"});
                var msgdes1= parammsg.data.getValue({name: "custrecord_msg_desl"});
                var msgrcv= parammsg.data.getValue({name: "custrecord_msgrcv"});
                var msggra= parammsg.data.getValue({name: "custrecord_msg_severity"});

                message = '<strong>Message:</strong> ' + msgdes + '<br/><br/>';
                message += '<strong>Message 2:</strong> ' + msgdes1 + '<br/><br/>';
                message += '<strong>Recovery:</strong> ' + msgrcv + '<br/><br/>';
                message += '<strong>Severity:</strong> ' + msggra;

                nDialog.alert({
                    title: '**Vendor has a credit $' + balance +' **',
                    message: message
                }).then(function (success) {
                    console.log(success);
                })["catch"](function (failure) {
                    console.log(failure);
                });
            }
           
        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(context) {

            var currentRecord = context.currentRecord
            var sublistId = context.sublistId
            var fieldId = context.fieldId


            if (sublistId === "item" && fieldId === "item") {
                /*
                Instead of setting the Last Purchase Price per vendor,
                just set it by the item.
                 */
                var itemId = currentRecord.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: fieldId
                });


                if (itemId) {
                    var itemBodyFields = search.lookupFields({
                        type: search.Type.ITEM,
                        id: itemId,
                        columns: "lastpurchaseprice"
                    });

                    /*
                    We can't have Item Last Purchase Price mandatory on the old
                    PO's, so we have to default the value here if there isn't
                    any value. We will speak to OPS/Purchasing to confirm a
                    cutover date.
                     */
                    if (itemBodyFields.lastpurchaseprice) {
                        currentRecord.setCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: "custcol_bkmn_item_last_purchase_price",
                            value: itemBodyFields.lastpurchaseprice
                        });
                    } else {
                        currentRecord.setCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: "custcol_bkmn_item_last_purchase_price",
                            value: 0.00
                        });
                    }
                }
            }

            /*
            if (sublistId === "item"  && fieldId === "custcol_bkms_po_item_exp_ship_date") {


                var daysrec = currentRecord.getValue({fieldId: "custbodyexpectedreceiptdays"});
                var datexp = currentRecord.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: "custcol_bkms_po_item_exp_ship_date"
                });

                if (daysrec>0 && datexp!='') {

                    const d = new Date(datexp);
                    d.setDate(d.getDate() + daysrec);

                    currentRecord.setCurrentSublistValue({
                        sublistId: sublistId,
                        fieldId: "expectedreceiptdate",
                        value: d,
                        ignoreFieldChange: true
                    });

                }
            }
            */

            if (fieldId === "custbodybranchoffice") {


                branch = currentRecord.getValue({fieldId: "custbodybranchoffice"});


                if (branch == "1") {
                    currentRecord.setValue('custbodyfootnoteemail', "Please send invoices to accountspayable@beekman1802.com");
                } else {
                    currentRecord.setValue('custbodyfootnoteemail', 'Please send invoices to accountspayables@beekman1802.com');
                }
            }

        return {fieldChanged: fieldChanged}
    }

/**
 * Function to be executed when field is slaved.
 *
 * @param {Object} scriptContext
 * @param {Record} scriptContext.currentRecord - Current form record
 * @param {string} scriptContext.sublistId - Sublist name
 * @param {string} scriptContext.fieldId - Field name
 *
 * @since 2015.2
 */
function postSourcing(scriptContext) {

}

/**
 * Function to be executed after sublist is inserted, removed, or edited.
 *
 * @param {Object} scriptContext
 * @param {Record} scriptContext.currentRecord - Current form record
 * @param {string} scriptContext.sublistId - Sublist name
 *
 * @since 2015.2
 */
function sublistChanged(context) {


}

/**
 * Function to be executed after line is selected.
 *
 * @param {Object} scriptContext
 * @param {Record} scriptContext.currentRecord - Current form record
 * @param {string} scriptContext.sublistId - Sublist name
 *
 * @since 2015.2
 */
function lineInit(context) {



}

/**
 * Validation function to be executed when field is changed.
 *
 * @param {Object} scriptContext
 * @param {Record} scriptContext.currentRecord - Current form record
 * @param {string} scriptContext.sublistId - Sublist name
 * @param {string} scriptContext.fieldId - Field name
 * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
 * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
 *
 * @returns {boolean} Return true if field is valid
 *
 * @since 2015.2
 */
function validateField(scriptContext) {

}

/**
 * Validation function to be executed when sublist line is committed.
 *
 * @param {Object} scriptContext
 * @param {Record} scriptContext.currentRecord - Current form record
 * @param {string} scriptContext.sublistId - Sublist name
 *
 * @returns {boolean} Return true if sublist line is valid
 *
 * @since 2015.2
 */
function validateLine(context) {


    if (context.sublistId == "item") {

        var order=context.currentRecord;

        var createdoutsourcedwokey = order.getCurrentSublistText({
            sublistId: 'item',
            fieldId: 'createdoutsourcedwokey'
        });
        log.debug("createdoutsourcedwokey",createdoutsourcedwokey);
        var exp_ship_date = order.getCurrentSublistText({
            sublistId: 'item',
            fieldId: 'custcol_bkms_po_item_exp_ship_date'
        });
        log.debug("exp_ship_date",exp_ship_date);

        if (createdoutsourcedwokey)
        {

            var paramwo = r.load({
                type: "workorder",
                id: createdoutsourcedwokey,
                isDynamic: false,
                defaultValues: null
            });
            datewo = paramwo.getValue({fieldId: "trandate"});

            if (datewo!=exp_ship_date)
            {
                log.debug("datewo",datewo);
                var d = new Date(exp_ship_date);
                paramwo.setValue({
                    fieldId: "trandate",
                    value: d,
                    ignoreFieldChange: true
                });
                paramwo.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: false
                });

            }
        }

    }


    return true;
}

/**
 * Validation function to be executed when sublist line is inserted.
 *
 * @param {Object} scriptContext
 * @param {Record} scriptContext.currentRecord - Current form record
 * @param {string} scriptContext.sublistId - Sublist name
 *
 * @returns {boolean} Return true if sublist line is valid
 *
 * @since 2015.2
 */
function validateInsert(scriptContext) {

}

/**
 * Validation function to be executed when record is deleted.
 *
 * @param {Object} scriptContext
 * @param {Record} scriptContext.currentRecord - Current form record
 * @param {string} scriptContext.sublistId - Sublist name
 *
 * @returns {boolean} Return true if sublist line is valid
 *
 * @since 2015.2
 */
function validateDelete(scriptContext) {

}




/**
 * Validation function to be executed when record is saved.
 *
 * @param {Object} scriptContext
 * @param {Record} scriptContext.currentRecord - Current form record
 * @returns {boolean} Return true if record is valid
 *
 * @since 2015.2
 */
function saveRecord(context) {

    var currentRecord = context.currentRecord;

    branch = currentRecord.getValue({fieldId: "custbodybranchoffice"});

    if (branch.length == 0) {

        entity = currentRecord.getValue({fieldId: "entity"});
        var paramrec = r.load({
            type: "vendor",
            id: entity,
            isDynamic: false,
            defaultValues: null
        });
        branch = paramrec.getValue({fieldId: "custentitybranchoffice"});
        currentRecord.setValue('custbodybranchoffice', branch);
    }


    if (branch.length != 0) {


        if (branch == "1") {
            currentRecord.setValue('custbodyfootnoteemail', "Please send invoices to accountspayable@beekman1802.com");
        } else {
            currentRecord.setValue('custbodyfootnoteemail', 'Please send invoices to accountspayables@beekman1802.com');
        }
    }


    balance = currentRecord.getValue({fieldId: "balance"});

    if (balance < 0)
    {
        var userObj = runtime.getCurrentUser();
        var userID = userObj.id;

        var parammsg = GENERALTOOLS.get_message_value('SYS_00001',userID);
        var msgdes= parammsg.data.getValue({name: "custrecord_msgdes"});
        var msgdes1= parammsg.data.getValue({name: "custrecord_msg_desl"});
        var msgrcv= parammsg.data.getValue({name: "custrecord_msgrcv"});
        var msggra= parammsg.data.getValue({name: "custrecord_msg_severity"});

        message = '<strong>Message:</strong> ' + msgdes + '<br/><br/>';
        message += '<strong>Message 2:</strong> ' + msgdes1 + '<br/><br/>';
        message += '<strong>Recovery:</strong> ' + msgrcv + '<br/><br/>';
        message += '<strong>Severity:</strong> ' + msggra;

        nDialog.alert({
            title: '**Vendor has a credit $' + balance +' **',
            message: message
        }).then(function (success) {
            console.log(success);
        })["catch"](function (failure) {
            console.log(failure);
        });
    }



return true;
}

return {
    pageInit: pageInit,
    fieldChanged: fieldChanged,
    //postSourcing: postSourcing,
    // sublistChanged: sublistChanged,
    //lineInit: lineInit,
    //validateField: validateField,
    validateLine: validateLine,
    //validateInsert: validateInsert,
    //validateDelete: validateDelete,
    saveRecord: saveRecord
};

});