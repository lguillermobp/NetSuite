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
            log.debug("data", data);
            var contextjson = data.data;
            log.debug("contextjson", contextjson);
            log.debug("contextjson.username", contextjson.username); 

            var option = data.option;
            log.debug("option", option);

            if  (option=="AddRequest")
            {

                var resultid=createrequest(contextjson);
                log.debug("resultid", resultid);

            }
            if  (option=="AssignWorkOrder")
            {
                var resultid=changeRequest(contextjson);
                log.debug("resultid", resultid);
            }
             if  (option=="E")
            {
                var resultid=changeRequest(contextjson);
                log.debug("resultid", resultid);
            }
            if  (option=="D")
            {
                var resultid=deleteRequest(contextjson);
                log.debug("resultid", resultid);
            }

            return resultid;
        }

        function createrequest(contextjson)
        {

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
                    fieldId: 'custrecord_reason',
                    value: contextjson.request_reason
                });
            }

            if (contextjson.request_date) {
                rec.setValue({
                    fieldId: 'custrecord_date',
                    value: new Date(contextjson.request_date)
                });
            }
            if (contextjson.request_sts_description) {
                rec.setValue({
                    fieldId: 'custrecord_requeststs',
                    value: contextjson.request_sts_description
                });
            }
            if (contextjson.user_email) {
                rec.setValue({
                    fieldId: 'custrecord_email',
                    value: contextjson.user_email
                });
            }
            if (contextjson.supervisor_email) {
                rec.setValue({
                    fieldId: 'custrecord_rq_supervisor_email',
                    value: contextjson.supervisor_email
                });
            }
            if (contextjson.supervisor_username) {
                rec.setValue({
                    fieldId: 'custrecord_rq_supervisor_user',
                    value: contextjson.supervisor_username
                });
            }
            if (contextjson.request_id) {
                rec.setValue({
                    fieldId: 'custrecord_viewecdid',
                    value: contextjson.request_id
                });
            }
             if (contextjson.request_type) {
                rec.setValue({
                    fieldId: 'custrecord_rq_type_vecd',
                    value: contextjson.request_type
                });
            }
            if (contextjson.customer_id_replaced > 0) {
                rec.setValue({
                    fieldId: 'custrecord_customerreplaced',
                    value: contextjson.customer_id_replaced
                });
            }
            if (contextjson.wo_id!="None") {
                rec.setValue({
                    fieldId: 'custrecord_wo',
                    value: contextjson.wo_id
                });
            }

            var recId = rec.save();
            log.debug('Record Created', 'ID: ' + recId);

            return recId;
        }

        function changeRequest(contextjson)
        {

            var rec = record.load({
                type: 'customrecord_requestrecords',
                id: contextjson.netsuite_id,
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
            
            if (contextjson.request_reason) {
                rec.setValue({
                    fieldId: 'custrecord_reason',
                    value: contextjson.request_reason
                });
            }

           if (contextjson.customer_id_replaced > 0) {
                rec.setValue({
                    fieldId: 'custrecord_customerreplaced',
                    value: contextjson.customer_id_replaced
                });
            }
            if (contextjson.request_sts_description) {
                rec.setValue({
                    fieldId: 'custrecord_requeststs',
                    value: contextjson.request_sts_description
                });
            }
            if (contextjson.user_email) {
                rec.setValue({
                    fieldId: 'custrecord_email',
                    value: contextjson.user_email
                });
            }
             if (contextjson.supervisor_email) {
                rec.setValue({
                    fieldId: 'custrecord_rq_supervisor_email',
                    value: contextjson.supervisor_email
                });
            }
            if (contextjson.supervisor_username) {
                rec.setValue({
                    fieldId: 'custrecord_rq_supervisor_user',
                    value: contextjson.supervisor_username
                });
            }
            if (contextjson.request_id) {
                rec.setValue({
                    fieldId: 'custrecord_viewecdid',
                    value: contextjson.request_id
                });
            }
             if (contextjson.request_type) {
                rec.setValue({
                    fieldId: 'custrecord_rq_type_vecd',
                    value: contextjson.request_type
                });
            }
            if (contextjson.reason_rejection) {
                rec.setValue({
                    fieldId: 'custrecord_rq_reason_rejection',
                    value: contextjson.reason_rejection
                });
            }
            if (contextjson.wo_id!="None") {
                rec.setValue({
                    fieldId: 'custrecord_wo',
                    value: contextjson.wo_id
                });
            }

            var recId = rec.save();
            log.debug('Record Created', 'ID: ' + recId);

            return "OK";
        }

        function deleteRequest(dataheader)
        {
            var requestId=dataheader.netsuite_id;  

            try {
                record.delete({
                    type: 'customrecord_requestrecords',
                    id: requestId
                });
                log.debug({ title: 'Record deleted successfully', details: requestId });
                return "OK";

            } catch (error) {
                log.error({ title: 'Error deleting record', details: error });
                return "0";
            }    
        }
        return {
            get: get,
            post: post,
            createrequest: createrequest,
            changeRequest: changeRequest

        };
    });