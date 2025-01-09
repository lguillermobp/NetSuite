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

         function post (_ref) {

            var fsearch = search.create({
               type: "workorder",
               settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
               filters:
               [
                  ["status","anyof","WorkOrd:B"], 
                  "AND", 
                  ["type","anyof","WorkOrd"], 
                  "AND", 
                  ["mainline","is","F"], 
                  "AND", 
                  ["item.type","anyof","Assembly","InvtPart"], 
                  "AND", 
                  ["formulatext: {custbody_section}","isnot","QC MO - QC"]
               ],
               columns:
               [
                  search.createColumn({
                     name: "custbody_productionline",
                     summary: "GROUP"
                  }),
                  search.createColumn({
                     name: "custbody_section",
                     summary: "GROUP"
                  }),
                  search.createColumn({
                     name: "custrecord_so_sc_enddate",
                     join: "CUSTBODY_TASKSC",
                     summary: "GROUP"
                  }),
                  search.createColumn({
                     name: "altname",
                     join: "customerMain",
                     summary: "MAX"
                  }),
                  search.createColumn({
                     name: "tranid",
                     summary: "GROUP"
                  }),
                  search.createColumn({
                     name: "line",
                     summary: "COUNT"
                  }),
                  search.createColumn({
                     name: "formulanumeric",
                     summary: "SUM",
                     formula: "CASE WHEN  {quantity}-NVL({quantitycommitted}, 0)=0 THEN  1 ELSE 0  END"
                  }),
                  search.createColumn({
                     name: "formulanumeric",
                     summary: "SUM",
                     formula: "CASE WHEN  {quantity}-NVL({quantitycommitted}, 0)=0 THEN  0 ELSE 1  END"
                  }),
                  search.createColumn({
                     name: "custbody_totalitemsbo",
                     summary: "GROUP"
                  })
               ]
             });

             var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });
            var i=0;
            var dataf=[];
            pagedData.pageRanges.forEach(function (pageRange) {
                var page = pagedData.fetch({index: pageRange.index});
                page.data.forEach(function (fresult1) {

                    dataf[i] = {
                        "custbody_productionline": fresult1.getValue({name: "custbody_productionline", summary: "GROUP"}),
                        "custbody_section": fresult1.getValue({name: "custbody_section", summary: "GROUP"}),
                        "custrecord_so_sc_enddate": fresult1.getValue({name: "custrecord_so_sc_enddate", join: "CUSTBODY_TASKSC", summary: "GROUP"}),
                        "altname": fresult1.getValue({name: "altname", join: "customerMain", summary: "MAX"}),
                        "tranid": fresult1.getValue({name: "tranid", summary: "GROUP"}),
                        "line": fresult1.getValue({name: "line", summary: "COUNT"}),
                        "formulanumeric": fresult1.getValue({name: "formulanumeric", summary: "SUM"}),
                        "formulanumeric1": fresult1.getValue({name: "formulanumeric1", summary: "SUM"}),
                        "custbody_totalitemsbo": fresult1.getValue({name: "custbody_totalitemsbo", summary: "GROUP"})
                    }
                    log.audit("dataf", dataf[i]);
                    log.audit("i", i);
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