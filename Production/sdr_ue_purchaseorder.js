/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/record",'N/log', "N/search", "N/runtime"], function (record, log, search, runtime) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {
        log.debug("context",context);
        const currentRecord = context.newRecord;
        log.debug("currentRecord",currentRecord.getValue({fieldId: "id"}) );
        idpo= currentRecord.getValue({fieldId: "id"});
        const currentRecordId = idpo;
        log.debug("currentRecordId",currentRecordId);
        postatus = context.newRecord.getValue({fieldId: "status"});

        
        const printSuitelet = `/app/site/hosting/scriptlet.nl?script=1788&deploy=1&id=${currentRecordId}`

        context.form.addButton({
            id: "custpage_print", 
            label: "Print Reception Note",
            functionName: `window.open('${printSuitelet}');`
        })

        

        if (postatus == "Approved by Supervisor/Pending Receipt" || postatus == "Pending Billing/Partially Received" || postatus == "Partially Received") {
            const printSuitelet1 = `/app/site/hosting/scriptlet.nl?script=1792&deploy=1&idpo=${currentRecordId}`

            context.form.addButton({
                id: "custpage_ticket", 
                label: "ECD Receiving",
                functionName: `window.open('${printSuitelet1}');`
            })
        }
        
        //context.form.clientScriptModulePath = "./sdr_cs_purchaseorder.js";
    }

    function beforeSubmit(context) {
        
       
    }
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

            if (context.type === context.UserEventType.EDIT) {

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
       // beforeSubmit: beforeSubmit
    }
})

