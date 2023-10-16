/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(["N/runtime",'N/search',"N/email",'N/log','N/record','N/file', 'N/task', 'N/runtime', "/SuiteScripts/Modules/generaltoolsv1.js"],

    function(runtime,s,email, log, record, file, task, runtime,  GENERALTOOLS) {

        /**
         * Definition of the Scheduled script trigger point.
         *
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
         * @Since 2015.2
         */


        var FILE_ID = 355446;
        var SEARCH_ID;
        var parambk;

        function execute(scriptContext) {

            var script = runtime.getCurrentScript();

            SEARCH_ID = runtime.getCurrentScript().getParameter({
                name: 'custscript_savedsearchid'
            });
            parambk = runtime.getCurrentScript().getParameter({
                name: 'custscript_parambk'
            });

            findCases();

        }
        function createAndSaveFile() {


            var fileObj = file.load({
                id: FILE_ID
            });


            var paramrec = GENERALTOOLS.get_paramnew_value(parambk);
            var recipients= paramrec.data.getValue({name: "custrecordparams_value"});
            var userObj = runtime.getCurrentUser();
            log.debug("userObj",userObj);

            email.send({
                author : 1205,
                recipients : recipients,
                subject : "subject",
                body : "emailBody",
                attachments: [fileObj],

            });

        }

        function findCases() {


            var searchTask = task.create({
                taskType: task.TaskType.SEARCH
            });

            searchTask.savedSearchId = SEARCH_ID;
            searchTask.fileId = FILE_ID;
            var searchTaskId = searchTask.submit();

            const statusObj = task.checkStatus({
                taskId: searchTaskId
            });

            const status = statusObj.status;

            log.debug("status",status);


            createAndSaveFile();
            return;

        }

        return {    execute: execute };

    });