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

            log.debug("context",context);
            try {
            contextjson = JSON.parse(context);
            }
            catch (e) {
                log.debug("error",e);
                contextjson = context;
            }

            
            var option= contextjson.option;
            log.debug("option",option); 

           
            idsearch = "customsearch_ecd_physicalcount_2";

            var fsearch =search.load({
               id: idsearch
           });
                
             var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });
            var i=0;
            var dataf=[];
            pagedData.pageRanges.forEach(function (pageRange) {
                log.audit(pageRange.index);
                var page = pagedData.fetch({index: pageRange.index});
                page.data.forEach(function (fresult1) {

                    dataf[i] = {
                        "bin_id": Number(fresult1.getValue({name: "custrecord_pc_bin"})),
                        "item_id": Number(fresult1.getValue({name: "custrecord_pc_item"})),
                        "item_name": fresult1.getText({name: "custrecord_pc_item"}),
                        "location_id": Number(fresult1.getValue({name: "custrecord_pc_location"})),
                        "location_name": fresult1.getText({name: "custrecord_pc_location"}),
                        "stock_status": fresult1.getText({name: "custrecord_pc_status"}),
                        "location_next_count": fresult1.getValue({name: "locationnextinvtcountdate",join: "CUSTRECORD_PC_ITEM"}),
                        "count_status": fresult1.getText({name: "custrecord_sc_status",  join: "CUSTRECORD_PC_ITEM_COUNT"}),
                        "count_date": fresult1.getValue({name: "created", join: "CUSTRECORD_PC_ITEM_COUNT"}).trim(),
                        "counted": fresult1.getValue({name: "formulatext"}),
                        "counter": fresult1.getText({name: "owner", join: "CUSTRECORD_PC_ITEM_COUNT"}),
                        "approved": fresult1.getText({name: "lastmodifiedby", join: "CUSTRECORD_PC_ITEM_COUNT"}),
                        "count_id": Number(fresult1.getValue({name: "internalid"}))
                    }
                    i++;

                })
            })

            return dataf;
        }


        return {
            get: get,
            post: post

        };
    });