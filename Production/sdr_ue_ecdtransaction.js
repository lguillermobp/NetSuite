/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/log','N/ui/serverWidget', "/SuiteScripts/Modules/generaltoolsv1.js",'N/email', 'N/render',  'N/runtime'], function(record, log,serverWidget, GENERALTOOLS, email, render, runtime) {

    /**
     * Function triggered before a record is submitted.
     * @param {Object} context - The context object containing information about the record being processed.
     * @param {Record} context.newRecord - The new record being submitted.
     * @param {Record} context.oldRecord - The old record before being edited.
     * @param {string} context.type - The operation type (create, edit, delete, xedit, approve, reject, cancel, pack, ship, invoice, reassign, editforecast, revalue, editord, editapprove, reestimatetotal, reestimateresource, reschedule, editcancelled, editrejected).
     */
    function beforeLoad(context) {
        log.debug("context",context);

        if (context.type === context.UserEventType.VIEW) {
            var entity = context.newRecord.getValue({fieldId: 'entity'});
            var id = context.newRecord.getValue({fieldId: 'id'});

            const printSuitelet = "/app/site/hosting/scriptlet.nl?script=1618&deploy=1&customer=" + entity;

            context.form.addButton({
                id: "custpage_gml",
                label: "Customer Statement",
                functionName: "window.open('" + printSuitelet + "');"
            })

            
        }


        
        // Your code logic here
    }
    
    /**
     * Function triggered after a record is submitted.
     * @param {Object} context - The context object containing information about the record being processed.
     * @param {Record} context.newRecord - The new record after being submitted.
     * @param {Record} context.oldRecord - The old record before being edited.
     * @param {string} context.type - The operation type (create, edit, delete, xedit, approve, reject, cancel, pack, ship, invoice, reassign, editforecast, revalue, editord, editapprove, reestimatetotal, reestimateresource, reschedule, editcancelled, editrejected).
     */
    function afterSubmit(context) {
        // Your code logic here

        

            log.debug("context.type",context.type);
            var id;

            if (context.oldRecord) {
                oldamount=context.oldRecord.getValue({fieldId: 'custbody_amount'});
                id = context.oldRecord.getValue({fieldId: 'custbody_quote_sc'});
            
            }
            else { 
                oldamount=0;
            }

            if (context.newRecord) {
                newamount=context.newRecord.getValue({fieldId: 'custbody_amount'});
                id = context.newRecord.getValue({fieldId: 'custbody_quote_sc'});
            
            }
            else {
                newamount=0;
            }
            if (context.type === context.UserEventType.DELETE) {  
                newamount=0;
            }

            log.debug("newamount",newamount);
            log.debug("oldamount",oldamount);

            parambal = GENERALTOOLS.set_Balance(id,-newamount,-oldamount);

            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {

                const ecdtransaction = context.newRecord;
                const recipientEmail = "luisb@ecdautodesign.com;anthony@ecdautodesign.com";



                // Load the customer record from the estimate
                const customerId = ecdtransaction.getValue({ fieldId: 'custbody_customer' });
                const customerRecord = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerId
                });
                /*
                // Get recipient email address from the customer record
                const recipientEmail = customerRecord.getValue({ fieldId: 'email' });
                if (!recipientEmail) {
                    log.error({
                        title: 'Email Error',
                        details: 'No email address found for the customer.'
                    });
                    return;
                }
*/
                
                // Get the script's author for the sender
                const authorId = runtime.getCurrentUser().id;

                // Load and merge the custom email template
                const templateId = 6; // Replace with your template's internal ID
                const emailTemplate = render.mergeEmail({
                    templateId: templateId,
                    entity: null,
                    recipient: customerRecord,
                    transactionId: ecdtransaction.id
                });
                log.debug({
                    title: 'Email Template',
                    details: emailTemplate
                });
                log.debug({
                    title: 'ecdtransaction.id',
                    details: ecdtransaction.id
                });
                
                // Generate the PDF of the quote
                const quotePdf = render.transaction({
                    entityId: ecdtransaction.id,
                    printMode: render.PrintMode.PDF,
                    formId: 243 // Optional: Replace with your custom form ID
                });
                
                // Send the email with the attached quote PDF
                email.send({
                    author: authorId,
                    recipients: recipientEmail,
                    subject: emailTemplate.subject,
                    body: emailTemplate.body,
                    attachments: [quotePdf],
                    relatedRecords: {
                        entityId: customerId,
                        transactionId: ecdtransaction.id
                    }
                });

                log.audit({
                    title: 'ECD Transaction Email Sent',
                    details: 'ECD Transaction ID ' + ecdtransaction.id + ' emailed to ' + recipientEmail
                });
            }

       
    }
    
    
    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
    };
});
