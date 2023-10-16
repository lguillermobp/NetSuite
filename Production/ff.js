/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/ui/dialog'],
    /**
     * @param {dialog} dialog
     */
    function(dialog) {
        //finalResult and finalResultSet are global variables
        //accessible by all functions

        //User provided final answer from confirm box
        var finalResult = false

        //Flag to indicate if user provided final answer or not
        finalResultSet = false;

        //Save record trigger
        function saveRecord(context)
        {
            //If user have never provided a final answer,
            if (context.sublistId == "inventory") {

                var order = context.currentRecord;

                var tranid = context.currentRecord.tranid;

                var unitcost = order.getCurrentSublistText({
                    sublistId: 'inventory',
                    fieldId: 'unitcost'
                });
                var avgunitcost = order.getCurrentSublistText({
                    sublistId: 'inventory',
                    fieldId: 'avgunitcost'
                });
                if (unitcost < 1) {


                    var itemcode = order.getCurrentSublistText({
                        sublistId: 'inventory',
                        fieldId: 'item'
                    });

                    if (!finalResultSet) {
                        //Here you do your own saveRecord validation/automation.
                        //.....
                        //.....
                        //.....
                        //During validation/automation,
                        //	if something fails, you would return false
                        //	which will never get to below line.

                        //If everything pases, show the dialog box

                        dialog.confirm({
                            'title': 'Unit Cost in Zeros',
                            'message': 'Are you sure that Unit Cost must be Zeros?'
                        }).then(success).catch(fail);
                    }
                    //If user provided a final answer from confirm box, return out
                    else {
                        //Reset the finalResultSet flag to false
                        //	in case user selected "Cancel" on the confirm box.
                        finalResultSet = false;

                        //return will either give the control back to user
                        //	or continue with saving of the record
                        return finalResult;
                    }
                }
            }
        }

        //Helper function called when user
        //	selects Ok or Cancel on confirm box
        function success(result)
        {
            //Sets value of finalResult to user provided answer
            finalResult = result;
            //Updates the finalResultSet flag to true
            //	to indicate that user has made his/her choice
            finalResultSet = true;

            console.log("Thank you. You may proceed.");
            var userObj = runtime.getCurrentUser();
            log.debug("userObj",userObj.id);

            var paramrec = GENERALTOOLS.get_param_value(11);
            var recipients= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var paramrec = GENERALTOOLS.get_param_value(12);
            var subject= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var paramrec = GENERALTOOLS.get_param_value(13);
            var emailBody= paramrec.data.getValue({fieldId: "custrecordparams_value"});

            subject = subject.replace("${tranid}", tranid);
            subject = subject.replace("${ITEM}", itemcode);

            emailBody = emailBody.replace("${tranid}", tranid);
            emailBody = emailBody.replace("${ITEM}", itemcode);

            resultado=true;
            email.send({
                author : userObj.id,
                recipients : recipients,
                subject : subject,
                body : emailBody,
                relatedRecords : {
                    transactionId : tranid
                }
            });


            getNLMultiButtonByName('multibutton_submitter').onMainButtonClick(this);
        }

        function fail(reason)
        {
            return false;
        }

        return {
            saveRecord: saveRecord
        };

    });