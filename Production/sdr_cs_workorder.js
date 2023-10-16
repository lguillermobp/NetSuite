/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @NID customscript_bkm_cs_wo_0001
 */
define(["N/log","N/record","N/email","N/ui/message", 'N/ui/dialog',"N/runtime", "/SuiteScripts/Modules/generaltoolsv1.js"],

    function(log, r,email,message, nDialog,runtime, GENERALTOOLS) {

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

                log.debug("context.mode",context.mode);
                log.debug("context.currentRecord",context.currentRecord);
                datarec=context.currentRecord;
                internalid = datarec.getValue({fieldId: "id"});
                log.debug("internalid",internalid);
                saleorder = datarec.getValue({fieldId: "createdfrom"});

                saleorderlin = datarec.getValue({fieldId: "soline"});
                assemblyitem = datarec.getValue({fieldId: "assemblyitem"});
                quantity = datarec.getValue({fieldId: "quantity"});
                log.debug("saleorder",saleorder);
                if (saleorder)
                {

                        var varrut = GENERALTOOLS.get_SO_value(saleorder);
                        otherrefnum= varrut.data.getValue({fieldId: "otherrefnum"});
                        var index = varrut.data.findSublistLineWithValue({"sublistId": "item", "fieldId": "item", "value": assemblyitem});

                        log.debug("assemblyitem",assemblyitem);
                        var varitm = GENERALTOOLS.get_item_value(assemblyitem);
                        log.debug("varitm",varitm);
                        spccon = varitm.data.getValue({fieldId: "custitem_spacialcondition"});
                        datarec.setValue({      "fieldId": "custbody_spacialcondition",
                                                "value": spccon,
                                                ignoreFieldChange: true });


                        var custcolcasespermasterbox = varrut.data.getSublistValue({
                                "sublistId": "item",
                                "fieldId": 'custcolcasespermasterbox',
                                "line": index
                        });
                        var custcolboxesperpallet = varrut.data.getSublistValue({
                                "sublistId": "item",
                                "fieldId": 'custcolboxesperpallet',
                                "line": index
                        });
                        if  (custcolcasespermasterbox!=0)
                        {       var custcolboxes = Math.ceil(quantity / custcolcasespermasterbox);               }
                        else {  var custcolboxes = 0;}
                        if  (custcolboxesperpallet!=0)
                        {       var totpal= Math.ceil(custcolboxes/custcolboxesperpallet); }
                        else {  var totpal = 0;}


                        datarec.setValue({
                                "fieldId": "custbodycasespermasterbox",
                                "value": custcolcasespermasterbox,
                                ignoreFieldChange: true
                        });

                        datarec.setValue({
                                "fieldId": "custbodyboxesperpallet",
                                "value": custcolboxesperpallet,
                                ignoreFieldChange: true
                        });

                        datarec.setValue({
                                "fieldId": "custbodytotalpallets",
                                "value": totpal,
                                ignoreFieldChange: true
                        });

                        datarec.setValue({
                                "fieldId": "custbodytotalboxes",
                                "value": custcolboxes,
                                ignoreFieldChange: true
                        });
                        datarec.setText({
                                fieldId: "custbody_bkmn_wo_cust_po_num",
                                text: otherrefnum
                        });

                }
        }


        function generateMasterLabels() {

                    message.create({
                            title: "You have clicked it ",
                            message: "You are the best.",
                            type: message.Type.CONFIRMATION,
                            duration: 2000
                    }).show();


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

                var fieldId = context.fieldId
                log.debug("fieldId",fieldId);


                if (fieldId === "quantity" || fieldId === "custbodyboxesperpallet" || fieldId === "custbodycasespermasterbox") {

                        quantity = currentRecord.getValue({fieldId: "quantity"});


                        custbodycasespermasterbox = currentRecord.getValue({fieldId: "custbodycasespermasterbox"});
                        custbodyboxesperpallet = currentRecord.getValue({fieldId: "custbodyboxesperpallet"});

                        if  (custbodycasespermasterbox!=0)
                        {       var totbox= Math.ceil(quantity/custbodycasespermasterbox);               }
                        else {  var totbox = 0;}
                        if  (custbodyboxesperpallet!=0)
                        {       var totpal= Math.ceil(totbox/custbodyboxesperpallet); }
                        else {  var totpal = 0;}


                        currentRecord.setValue('custbodytotalpallets', totpal);
                        currentRecord.setValue('custbodytotalboxes', totbox);

                }


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
        function lineInit(scriptContext) {

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
        function validateDelete(context) {


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
        var finalResultSet = false;
        var WO;
        var PO;
        var location;
        var locationPO;
        var userID;
        function saveRecord(context) {

                var currentRecord = context.currentRecord;

                outsourced = currentRecord.getValue({fieldId: "outsourced"});
                location = currentRecord.getValue({fieldId: "location"});
                linkedpo = currentRecord.getValue({fieldId: "linkedpo"});
                WO = currentRecord.getValue({fieldId: "tranid"});


                if (linkedpo)
                {

                var paramPO = r.load({
                        type: "purchaseorder",
                        id: linkedpo,
                        isDynamic: false,
                        defaultValues: null
                });
                locationPO = paramPO.getValue({fieldId: "location"});
                log.debug("locationPO", locationPO);

                if (locationPO != '10')
                {





                        PO = paramPO.getValue({fieldId: "tranid"});
                        expense_total = paramPO.getValue({fieldId: "expense_total"});

                        if (expense_total == 0)
                        {
                                var userObj = runtime.getCurrentUser();
                                userID = userObj.id;

                                var parammsg = GENERALTOOLS.get_message_value('SYS_00002', userID);
                                var msgdes = parammsg.data.getValue({name: "custrecord_msgdes"});
                                var msgdes1 = parammsg.data.getValue({name: "custrecord_msg_desl"});
                                var msgrcv = parammsg.data.getValue({name: "custrecord_msgrcv"});
                                var msggra = parammsg.data.getValue({name: "custrecord_msg_severity"});

                                message = '<strong>Message:</strong> ' + msgdes + '<br/><br/>';
                                message += '<strong>Message 2:</strong> ' + msgdes1 + '<br/><br/>';
                                message += '<strong>Recovery:</strong> ' + msgrcv + '<br/><br/>';
                                message += '<strong>Severity:</strong> ' + msggra;

                                if (!finalResultSet)
                                {


                                nDialog.confirm({
                                        title: '** ERROR **',
                                        message: message
                                }).then(success).catch(fail);
                                }
                                //If user provided a final answer from confirm box, return out
                                else
                                {
                                        //Reset the finalResultSet flag to false
                                        //	in case user selected "Cancel" on the confirm box.
                                        finalResultSet = false;

                                        //return will either give the control back to user
                                        //	or continue with saving of the record
                                        return finalResult;
                                }

                        }
                        else {
                                return true;
                        }
                }
                else {
                        return true;
                }
                }
                else {
                        return true;
                }

        }


            function success(result)
            {

                            //Sets value of finalResult to user provided answer
                            finalResult = result;
                            //Updates the finalResultSet flag to true
                            //	to indicate that user has made his/her choice
                            finalResultSet = true;

                            console.log("Thank you. You may proceed.");
                            if (result) {
                                    log.debug("result", result);

                            var paramrec = GENERALTOOLS.get_paramnew_value('0601');
                            var recipientsstr = paramrec.data.getValue({name: "custrecordparams_value"});
                            var paramrec = GENERALTOOLS.get_paramnew_value('0602');
                            var subject = paramrec.data.getValue({name: "custrecordparams_value"});
                            var paramrec = GENERALTOOLS.get_paramnew_value('0603');
                            var emailBody = paramrec.data.getValue({name: "custrecordparams_value"});


                            const recipients = recipientsstr.split(',');
                            log.debug("recipients", recipients);
                            log.debug("WO", WO);

                            subject = subject.replace("${WO}", WO);
                            subject = subject.replace("${PO}", PO);

                            emailBody = emailBody.replace("${WO}", WO);
                            emailBody = emailBody.replace("${PO}", PO);

                            log.debug("emailBody", emailBody);

                            email.send({
                                    author: userID,
                                    recipients: recipients,
                                    subject: subject,
                                    body: emailBody
                            });
                    }

                    getNLMultiButtonByName('multibutton_submitter').onMainButtonClick(this);
            }
            function fail(reason)
            {
                    return false;
            }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            //postSourcing: postSourcing,
            //sublistChanged: sublistChanged,
            //lineInit: lineInit,
            //validateField: validateField,
            //validateLine: validateLine,
            //validateInsert: validateInsert,
            //validateDelete: validateDelete,
            //generateMasterLabels : generateMasterLabels,
            saveRecord: saveRecord
        };

    });