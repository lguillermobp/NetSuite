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
            var option = data.data.option;

            if  (option=="transformformquote")
            {

                var resultid=transformfromquote(dataheader);
                log.debug("resultid", resultid);

            }




            return quoteId;
        }
        function transformfromquote(dataheader)
        {
            var quoteId=dataheader.quoteid;  
            log.debug("quoteId",quoteId);
           

            try {
                var newRecord = record.transform({
                    fromType: record.Type.ESTIMATE,
                    fromId: quoteId,
                    toType: record.Type.SALES_ORDER,
                    isDynamic: true
                });
                log.debug({ title: 'Record transformed successfully', details: newRecord });

                } catch (error) {
                log.error({ title: 'Error transforming record', details: error });
                }

                if (newRecord) {

                    try {
                        var recordId = newRecord.save();
                        log.debug({ title: 'Record saved successfully', details: recordId });
                        return recordId;

                    } catch (error) {
                        log.error({ title: 'Error saving record', details: error });
                    }
                }

        }
        return {
            get: get,
            post: post,
            transformfromquote: transformfromquote

        };
    });