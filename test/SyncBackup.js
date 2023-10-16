/**
 *@NApiVersion 2.1
 *@NScriptType ScheduledScript
 */

define(["N/sftp", "N/file", "N/task", "N/search", "N/record" ,"N/format"],
    function (sftp, file, task, search, record, format) {
        /**
         *
         * @param connection
         * @param savedSearchId
         * @param fileName
         */
        function uploadSavedSearchToSigma(connection, savedSearchId, fileName) {
            log.audit({title:"UploadtoSigma Function"})
            const NETSUITE_FILE_CABINET_PATH = `/SuiteScripts/Sigma/Saved_Searches/${fileName}`
            const SIGMA_FILE_PATH = `Cron/Saved_Searches/${fileName}`
            let isSearchDownloading = true;

            const START = new Date();

            const taskId = task.create({
                taskType: task.TaskType.SEARCH,
                savedSearchId: savedSearchId,
                filePath: NETSUITE_FILE_CABINET_PATH
            }).submit();

            while (isSearchDownloading) {
                const TASK_STATUS = task.checkStatus({taskId: taskId}).status;

                if (TASK_STATUS === task.TaskStatus.COMPLETE) {
                    const searchFile = file.load({
                        id: NETSUITE_FILE_CABINET_PATH
                    });

                    connection.upload({
                        filename: SIGMA_FILE_PATH,
                        file: searchFile,
                        replaceExisting: true
                    });
                    const END = new Date();
                    return {start: START, end: END, taskStatus: TASK_STATUS, savedSearchId: savedSearchId, fileName: fileName}
                } else if (TASK_STATUS === task.TaskStatus.FAILED) {
                    const END = new Date();
                    return {start: START, end: END, taskStatus: TASK_STATUS, savedSearchId: savedSearchId, fileName: fileName}
                }
            }
        }

        /**
         *
         * @param connection
         * @param pathFromNetSuiteFileCabinet
         * @param pathToSigma
         */
        function uploadFileToSigma(connection, pathFromNetSuiteFileCabinet, pathToSigma){
            const NETSUITE_FILE = file.load({
                id: pathFromNetSuiteFileCabinet
            });

            connection.upload({
                filename: pathToSigma,
                file: NETSUITE_FILE,
                replaceExisting: true
            });
        }

        function setSyncedOnSigmaNavBar(connection, syncTime){
            syncTime = format.format({
                value: syncTime,
                type: format.Type.DATETIMETZ,
                timezone: format.Timezone.AMERICA_NEW_YORK
            });

            syncTime = syncTime.slice(11);
            syncTime = syncTime.toUpperCase();
            syncTime = `<a href='{% url "connector_daily_sync_logs" %}'>${syncTime}</a>`

            syncTime = `<table><thead><tr><th>Synced</th></tr></thead><tbody><tr><td>${syncTime}</td></tr></tbody></table>`;

            let lastSyncedSigmaTimestamp = file.create({
                name: "Last_Synced_Timestamp.html",
                fileType: file.Type.HTMLDOC,
                contents: syncTime,
                folder: 70822
            });

            lastSyncedSigmaTimestamp.save();

            uploadFileToSigma(connection, "/SuiteScripts/Sigma/Files/Last_Synced_Timestamp.html", "Sigma/templates/Last_Synced_Timestamp.html");
        }

        function execute(context) {
            log.audit({title:"SFTP Function"})
            if (context.type === context.InvocationType.SCHEDULED || context.type === context.InvocationType.USER_INTERFACE) {
                const connection = sftp.createConnection({
                    username: "ubuntu",
                    keyId: "custkey_bkm_sigma_release",
                    url: "1802.io",
                    directory: "/home/ubuntu/Developer/",
                    hostKey: "AAAAB3NzaC1yc2EAAAADAQABAAABAQCmDUIfOLy/W1S7UDWRFyAyrvKb+Gs2CUikb4hdjgXf2UgCXwgO3I0qk8fIa4FrpdNdQ0rIqF873yWkOTwjDNCIO2MIzsiqDHOrNa7v+Nx1NZ8vpvNrKPG3Vrw163AZQGAAr2VOtrNZyz7SySsNl/yP7RCReznuUTGQ0GIe45F2IFA4pMTNiGe/1JXHO0ShLNdD5QfCrBWjQUTQJOvNtC2dn4puuU8+xq+25ZJMSx+hwnSnmSVhN+zXbnBLeKshM5H6NmJYKp0TL76n0eQgxB8B6+hkOtwgIm+xfdNmPHv3Jrcpy96O5ksstq6Ft1sDYVua2eWsFVk1ArBOrUzZBymX",
                });

                const START = new Date();

                let syncLogs = [];
                search.load({
                    id: "customsearch_bkm_sigma_saved_searches"
                }).run().each(function (result) {
                    syncLogs.push(uploadSavedSearchToSigma(
                        connection,
                        result.getValue(result.columns[0]),
                        result.getValue(result.columns[1])));
                    return true;
                });

                const END = new Date();

                for (var i=0; i < syncLogs.length; i++){
                    let syncLog = record.create({
                        type: "customrecord_bkm_sigma_sync_log",
                    })

                    syncLog.setValue({
                        fieldId: "custrecord_bkm_sigma_sync_global_start",
                        value: START
                    });
                    syncLog.setValue({
                        fieldId: "custrecord_bkm_sigma_sync_global_end",
                        value: END
                    });
                    syncLog.setValue({
                        fieldId: "custrecord_bkm_sigma_sync_search_start",
                        value: syncLogs[i].start
                    });
                    syncLog.setValue({
                        fieldId: "custrecord_bkm_sigma_sync_search_end",
                        value: syncLogs[i].end
                    });
                    syncLog.setValue({
                        fieldId: "custrecord_bkm_sigma_sync_saved_search",
                        value: syncLogs[i].savedSearchId
                    });
                    syncLog.setValue({
                        fieldId: "custrecord_bkm_sigma_sync_status",
                        value: syncLogs[i].taskStatus
                    });
                    syncLog.setValue({
                        fieldId: "custrecord_bkm_sigma_sync_file_name",
                        value: syncLogs[i].fileName
                    });

                    syncLog.save()
                }

                const dailySyncLogs = uploadSavedSearchToSigma(connection, 2741, "Daily_Sync_Logs.csv")

                setSyncedOnSigmaNavBar(connection, START);
            }
        }

        return {execute: execute}
    });
