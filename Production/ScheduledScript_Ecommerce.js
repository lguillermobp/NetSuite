/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(["N/runtime",'N/search',"N/email",'N/log','N/record', 'N/file', "/SuiteScripts/Modules/generaltoolsv1.js"],

    function(runtime,s,email, log, record, file, GENERALTOOLS) {

        /**
         * Definition of the Scheduled script trigger point.
         *
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
         * @Since 2015.2
         */


        var datatocsv;

        function execute(scriptContext) {

            findCases();

        }
        function createAndSaveFile() {


            var fileObj = file.create({
                name: 'searchresults.csv',
                fileType: file.Type.CSV,
                contents: datatocsv
            });
            fileObj.folder = -15;
            var id = fileObj.save();
            fileObj = file.load({
                id: id
            });

            var userObj = runtime.getCurrentUser();
            log.debug("userObj",userObj);

            email.send({
                author : 1205,
                recipients : 6158809,
                subject : "Search: Search Results",
                body : "emailBody",
                attachments: [fileObj],

            });

        }

        function findCases() {

            let fsearch = s.load({
                id: "customsearchdashboardfordomoorderbasic"
            });


            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });


            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});

                i=0;
                page.data.forEach(function (fresult1) {
                    datatocsv[i]=fresult1;
                    i++;
                })
            })

            createAndSaveFile();
            return;

        }



        return {    execute: execute };

    });
