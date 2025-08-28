"use strict";

/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(["N/search", "N/record",  "N/log","/SuiteScripts/Modules/generaltoolsv1.js"],
    /**
     * @param {N/search} search
     * @param {N/record} record
     * @return {{post: exports.post}}
     */
    function (search, record, log, GENERALTOOLS) {

         function get (_ref) {

            return _ref;
        }

         function post (context) {
            log.debug("context", context);

                try {
                    data = JSON.parse(context);
                    }
                    catch (e) {
                        log.debug("error",e);
                        data = context;
                    }
                

            var dataheader = data.data.dataheader;
            var customer_id = dataheader.customer_id;


            var customerRecord = record.create({
                type: record.Type.CUSTOMER,
                isDynamic: true
            });



            // Example: Set customer name and email from dataheader
            if (dataheader.customer_name) {  
                customerRecord.setValue({
                    fieldId: 'firstname',
                    value: dataheader.customer_name
                });
            }
            if (dataheader.customer_last_name) {
                customerRecord.setValue({
                    fieldId: 'lastname',
                    value: dataheader.customer_last_name
                });
            }
            if (dataheader.customer_email) {
                customerRecord.setValue({
                    fieldId: 'email',
                    value: dataheader.customer_email
                });
            }

            if (dataheader.customer_phone) {
                customerRecord.setValue({
                    fieldId: 'phone',
                    value: dataheader.customer_phone
                });
            }

            // Add other fields as needed from dataheader

            var customerId = customerRecord.save();

            return customerId;
        }


        return {
            get: get,
            post: post

        };
    });