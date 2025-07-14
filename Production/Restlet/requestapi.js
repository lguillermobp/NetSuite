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

            try {
                    contextjson = JSON.parse(context);
                    }
                    catch (e) {
                        log.debug("error",e);
                        contextjson = context;
                    }

            log.debug("contextjson", contextjson);

            var rec = record.create({
                type: 'customrecord_requestrecords',
                isDynamic: true
            });

            // Example: set fields from contextjson
            // Replace 'custrecord_field1', 'custrecord_field2' with actual field IDs
            if (contextjson.username) {
                rec.setValue({
                    fieldId: 'custrecord_employee',
                    value: contextjson.username
                });
            }
            if (contextjson.customer_id) {
                rec.setValue({
                    fieldId: 'custrecord_project',
                    value: contextjson.customer_id
                });
            }
            if (contextjson.item_id) {
                rec.setValue({
                    fieldId: 'custrecord_item',
                    value: contextjson.item_id
                });
            }
             if (contextjson.request_qty) {
                rec.setValue({
                    fieldId: 'custrecord_qty',
                    value: contextjson.request_qty
                });
            }
            if (contextjson.request_description) {
                rec.setValue({
                    fieldId: 'custrecord_additionalinformation',
                    value: contextjson.request_description
                });
            }
            if (contextjson.request_reason) {
                rec.setValue({
                    fieldId: 'custrecord_additionalinformation',
                    value: contextjson.request_reason
                });
            }
            if (contextjson.request_date) {
                rec.setValue({
                    fieldId: 'custrecord_date',
                    value: contextjson.request_date
                });
            }
            if (contextjson.request_sts) {
                rec.setValue({
                    fieldId: 'custrecord_requeststs',
                    value: contextjson.request_sts
                });
            }
            if (contextjson.user_email) {
                rec.setValue({
                    fieldId: 'custrecord_email',
                    value: contextjson.user_email
                });
            }
            if (contextjson.request_id) {
                rec.setValue({
                    fieldId: 'custrecord_viewecdid',
                    value: contextjson.request_id
                });
            }
            if (contextjson.wo_id) {
                rec.setValue({
                    fieldId: 'custrecord_wo',
                    value: contextjson.wo_id
                });
            }

            

            var recId = rec.save();
            log.debug('Record Created', 'ID: ' + recId);

            return recId;
        }


        return {
            get: get,
            post: post

        };
    });