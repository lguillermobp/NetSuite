/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(["N/runtime","N/currentRecord", "N/error",'N/log', "N/record", "N/search", "/SuiteScripts/Modules/generaltoolsv1.js"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (runtime,currentRecord, error,log,record, s, GENERALTOOLS) {
        function pageInit() {
        }

        function process() {
            var currRec = currentRecord.get();

            var fieldfilename = currRec.getText({
                fieldId: "custpage_file_name"
            });
        
            // call RenderPriorityPrintPDF.js (1941)
            var url = "/app/site/hosting/scriptlet.nl?script=1941&deploy=1";
            url += "&fieldfilename=" + fieldfilename;
           
            //window.open(url, "_blank")
        }

        function clear() {
    
            var fsearch = s.create({
                type: "customrecord_interface",
                filters:
                [
                ],
                columns:
                [
                    s.createColumn({
                        name: "name",
                        sort: s.Sort.ASC
                    }),
                    "created",
                    "custrecord_dateprocessed",
                    "custrecord_expirationdate",
                    "custrecord_itemid",
                    "custrecord_locationid",
                    "custrecord_lot",
                    "custrecord_note",
                    "custrecord_qty",
                    "custrecord_recordtype",
                    "custrecord_recstatus",
                    "custrecord_transformrecord",
                    "custrecord_internalid",
                    "custrecord_binid",
                    "internalid"
                ]
            });
    
            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });
    
            pagedData.pageRanges.forEach(function (pageRange) {
    
                var page = pagedData.fetch({index: pageRange.index});
    
                page.data.forEach(function (fresult) {
                            
                        var fresultid = fresult.getValue({name: "internalid"});
        
                        record.delete({
                            type: "customrecord_interface",
                            id: fresultid
                        });

    
                })
            });
            window.location.reload();
            return true;
        }
        
        return {
            pageInit: pageInit,
            process: process,
            clear: clear
        }
    })
