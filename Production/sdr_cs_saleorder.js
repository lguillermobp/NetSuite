/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
var ecddays = [];
define(['N/search','N/currentRecord','N/log',"N/record","N/ui/dialog"], function(s, currentRecord, log, record,dialog) {
    function pageInit(context) {

        datarec=context.currentRecord;
        // Code to be executed when the page loads
        log.debug("context",context);
        var po = datarec.getValue({
            fieldId: "otherrefnum"
        });
        log.debug("po",po);
    }

    function fieldChanged(context) {
        // Code to be executed when a field value changes
    }

    
    function refreshSchedule() {
        
        var currRec = currentRecord.get();


        var sc = currRec.getValue({
            fieldId: "id"
        });
        var pl = currRec.getValue({
            fieldId: "custbody_productionline"
        });
        var shipdate = currRec.getValue({
            fieldId: "shipdate"
        });
        log.debug("sc",sc);
        log.debug("pl",pl);
        lookstsc(sc, pl, shipdate);
        
    }

    function refreshCrib() {
        
        var currRec = currentRecord.get();


        var sc = currRec.getValue({
            fieldId: "id"
        });
        var cd = currRec.getValue({
            fieldId: "custbody_cribdesigntemplate"
        });
        
        log.debug("sc",sc);
        log.debug("cd",cd);
        lookcdsc(sc, cd);
        
    }

    function saveRecord(context) {
        // Code to be executed when the record is saved
        return true;
    }


    function lookst(sc, pl, shipdate) {

        pecddays();

        var fsearch = s.create({
            type: "customrecord_scheduletasks",
            filters:
            [
               ["custrecord_sc_productionline","anyof",pl]
            ],
            columns:
            [
               s.createColumn({
                  name: "custrecord_sc_productionline",
                  sort: s.Sort.ASC
               }),
               "custrecord_sc_tasksgroup",
               s.createColumn({
                  name: "custrecord_sc_tasksseq",
                  sort: s.Sort.ASC
               }),
               "custrecord_sc_task",
               "custrecord_sc_days",
               "custrecord_duration",
               "internalid"

            ]
        });
        //Calculate new start and end date
        var y = shipdate.getFullYear();
        var m = shipdate.getMonth() + 1;
        var d = shipdate.getDate();
        datetofind = m + "/" + d + "/" + y;
        
        log.debug("datetofind",datetofind);
        initial = parseInt(ecddays.indexOf(datetofind));
        final = parseInt(ecddays.indexOf(datetofind));
        log.debug("initial",initial);

        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });
        log.debug("pagedData.pageRanges.length",pagedData.pageRanges.length);
        pagedData.pageRanges.forEach(function (pageRange) {
            var page = pagedData.fetch({index: pageRange.index});
            page.data.forEach(function (fresult1) {
                var taskId = fresult1.getValue({ name: "internalid" });
                var taskGroup = fresult1.getValue({ name: "custrecord_sc_tasksgroup" });
                var taskSeq = fresult1.getValue({ name: "custrecord_sc_tasksseq" });
                var task = fresult1.getValue({ name: "custrecord_sc_task" });
                var taskname = fresult1.getText({ name: "custrecord_sc_task" });
                var days = (parseInt(fresult1.getValue({ name: "custrecord_sc_days" }))*-1);
                var duration = parseInt(fresult1.getValue({ name: "custrecord_duration" })); 

                log.debug("task",task);

           
            var newTaskRecord = record.create({
                type: "customrecord_so_scheduletasks",
                isDynamic: true
            });
            // Set field values for the new record
            newTaskRecord.setValue({
                fieldId: "custrecord_salecontract",
                value: sc 
            });

            newTaskRecord.setValue({
                fieldId: "custrecord_so_sc_productionline",
                value: pl 
            });

            newTaskRecord.setValue({
                fieldId: "custrecord_so_sc_tasksgroup",
                value: taskGroup 
            });
            log.debug("taskGroup",taskGroup);
            newTaskRecord.setValue({
                fieldId: "custrecord_soduration",
                value: duration 
            });
            newTaskRecord.setValue({
                fieldId: "custrecord_so_sc_status",
                value: "1"
            });
            newTaskRecord.setValue({
                fieldId: "custrecord_so_sc_task",
                value: taskId 
            });
           

            if (initial==-1)      {initial=1;days=0}
            else
            {
                if (initial<days)      {initial=1;days=0}
            }

            log.debug("initial-days+duration",(initial-days+duration-1));


            newstartdate=new Date(ecddays[initial-days-duration+1]);
            newenddate=new Date(ecddays[initial-days]);
 
           // var newstartdate=new Date(shipdate);
            //newstartdate.setDate(newstartdate.getDate()-days);

            //var newenddate=new Date(newstartdate);
           // newenddate.setDate(newenddate.getDate()+duration);


            log.debug("newstartdate",newstartdate);
            log.debug("newenddate",newenddate);
            newTaskRecord.setValue({
                fieldId: "custrecord_so_sc_startdate",
                value: newstartdate 
            });
            newTaskRecord.setValue({
                fieldId: "custrecord_so_sc_enddate",
                value: newenddate 
            });

            // Save the new record
            var newTaskRecordId = newTaskRecord.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });

         
        });
        });
       
    }


    function lookstsc(sc, pl, shipdate) {

        var fsearch = s.create({
            type: "customrecord_so_scheduletasks",
            filters:
            [
                ["custrecord_salecontract","anyof",sc], 
                "AND", 
                ["custrecord_so_sc_productionline","anyof",pl]
            ],
            columns:
            [
                "internalid",
                "custrecord_salecontract",
                "custrecord_so_sc_productionline",
                "custrecord_so_sc_tasksgroup",
                s.createColumn({
                    name: "custrecord_sc_tasksgroup",
                    join: "CUSTRECORD_SO_SC_TASK"
                }),
                s.createColumn({
                    name: "custrecord_sc_task",
                    join: "CUSTRECORD_SO_SC_TASK"
                }),
                s.createColumn({
                    name: "custrecord_sc_days",
                    join: "CUSTRECORD_SO_SC_TASK"
                }),
                s.createColumn({
                    name: "custrecord_sc_tasksseq",
                    join: "CUSTRECORD_SO_SC_TASK",
                    sort: s.Sort.ASC
                })
            ]
                    });


        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });
        log.debug("pagedData.pageRanges.length",pagedData.pageRanges.length);
       
        
        if (pagedData.pageRanges.length > 0) {
       
            function success(result) {

                if (result) 
                {
                    pagedData.pageRanges.forEach(function (pageRange) {
                        var page = pagedData.fetch({index: pageRange.index});
                        page.data.forEach(function (fresult1) {
                            
                            scheduleID = fresult1.getValue({ name: "internalid" });
                            log.debug("scheduleID",scheduleID);
                            var recordToDelete = record.delete({
                                type: 'customrecord_so_scheduletasks',
                                id: scheduleID
                            });
                        });
                    });
                    lookst(sc, pl, shipdate);
                }
                console.log('Success with value ' + result);
            }
        
            function failure(reason) {
                console.log('Failure: ' + reason);
            }
            dialog.confirm({
                'title': 'Sales Contract contains Schedule Tasks',
                'message': 'Are you sure that you want refresh it?'
            }).then(success).catch(failure);
        
        }
        else
        {
            lookst(sc, pl, shipdate);
        }



    }

// Crib Design Template

function lookcd(sc, cd) {

    var fsearch = s.create({
        type: "customrecord_cripdesign",
        filters:
        [
           ["custrecord_cd_template","anyof",cd]
        ],
        columns:
        [
           s.createColumn({
              name: "internalid",
              sort: s.Sort.ASC
           }),
           "custrecord_cd_template",
           "custrecord_cd_group",
           "custrecord_cd_specification"
        ]
    });
    

    var pagedData = fsearch.runPaged({
        "pageSize" : 1000
    });
    log.debug("pagedData.pageRanges.length",pagedData.pageRanges.length);
    pagedData.pageRanges.forEach(function (pageRange) {
        var page = pagedData.fetch({index: pageRange.index});
        page.data.forEach(function (fresult1) {
            var cribId = fresult1.getValue({ name: "internalid" });
                
        var newTaskRecord = record.create({
            type: "customrecord_cd_sc",
            isDynamic: true
        });
        // Set field values for the new record
        newTaskRecord.setValue({
            fieldId: "custrecord_cd_sc",
            value: sc 
        });

        newTaskRecord.setValue({
            fieldId: "custrecord_cd_sc_specification",
            value: cribId 
        });
       
       

        // Save the new record
        var newTaskRecordId = newTaskRecord.save({
            enableSourcing: true,
            ignoreMandatoryFields: true
        });

     
    });
    });
   
}


function lookcdsc(sc, cd) {
    
    var fsearch = s.create({
        type: "customrecord_cd_sc",
        filters:
        [
           ["custrecord_cd_sc","anyof",sc]
        ],
        columns:
        [
           s.createColumn({
              name: "custrecord_cd_template",
              join: "CUSTRECORD_CD_SC_SPECIFICATION"
           }),
           s.createColumn({
              name: "custrecord_cd_group",
              join: "CUSTRECORD_CD_SC_SPECIFICATION"
           }),
           s.createColumn({
              name: "custrecord_cd_specification",
              join: "CUSTRECORD_CD_SC_SPECIFICATION"
           }),
           "custrecord_cd_sc_detail",
           s.createColumn({
              name: "internalid",
              join: "CUSTRECORD_CD_SC_SPECIFICATION",
              sort: s.Sort.ASC
           }),
           "internalid"
        ]
         });
         log.debug("cd",cd);

    var pagedData = fsearch.runPaged({
        "pageSize" : 1000
    });
    log.debug("pagedData.pageRanges.length",pagedData.pageRanges.length);
   
    
    if (pagedData.pageRanges.length > 0) {
   
        function success(result) {

            if (result) 
            {
                pagedData.pageRanges.forEach(function (pageRange) {
                    var page = pagedData.fetch({index: pageRange.index});
                    page.data.forEach(function (fresult1) {
                        
                        cribID = fresult1.getValue({ name: "internalid" });
                        log.debug("cribID",cribID);
                        var recordToDelete = record.delete({
                            type: 'customrecord_cd_sc',
                            id: cribID
                        });
                    });
                });
                lookcd(sc, cd);
            }
            console.log('Success with value ' + result);
        }
    
        function failure(reason) {
            console.log('Failure: ' + reason);
        }
        dialog.confirm({
            'title': 'Sales Contract contains Crib Design',
            'message': 'Are you sure that you want refresh it?'
        }).then(success).catch(failure);
    
    }
    else
    {
        lookcd(sc, cd);
    }



}




    function pecddays() {
        
        var fsearch = s.create({
            type: "customrecord_blocksofdays",
            columns:
            [
               "internalid",
               s.createColumn({
                  name: "custrecord_blockdate",
                  sort: s.Sort.ASC
               }),
               "custrecord_blockno",
               "name",
               "custrecord_sequence"
            ]
        });


        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });
        var i=1;
        pagedData.pageRanges.forEach(function (pageRange) {
            var page = pagedData.fetch({index: pageRange.index});
            page.data.forEach(function (fresult1) {

                custrecord_sequence = fresult1.getValue({ name: "custrecord_sequence" });
                custrecord_blockdate = fresult1.getValue({ name: "custrecord_blockdate" });

                ecddays[i]=custrecord_blockdate;
                i++;
                
            });
        });
       

    }
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        refreshSchedule: refreshSchedule,
        refreshCrib: refreshCrib,
        saveRecord: saveRecord
    };
});
