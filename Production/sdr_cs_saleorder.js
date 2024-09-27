/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
var ecddays = [];
var ecdholydays = [];
define(['N/search','N/currentRecord','N/log',"N/record","N/ui/dialog", "/SuiteScripts/Modules/generaltoolsv1.js"], function(s, currentRecord, log, record,dialog, GENERALTOOLS) {
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

        var currentRecord = context.currentRecord;
        var fieldId = context.fieldId;
        log.debug("fieldId",fieldId);
        if (fieldId == "custbody_productionline") {
            var invdate = currentRecord.getValue({ fieldId: "custbody_invoicedate" });
            var prodline = currentRecord.getValue({ fieldId: "custbody_productionline" });

            if (invdate.length==0) {
                
                invdate = GENERALTOOLS.calcenddate(prodline);
                log.debug("invdate",invdate);}

                currentRecord.setValue({fieldId: "custbody_invoicedate",   value: invdate });
                log.debug("enddate",invdate);
            }


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
            fieldId: "custbody_invoicedate"
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
        console.log("ecdholydays",ecdholydays);

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
        var m = ('0'+(shipdate.getMonth()+1)).slice(-2)
        var d = ('0'+(shipdate.getDate())).slice(-2)
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
                value: "5"
            });
            newTaskRecord.setValue({
                fieldId: "custrecord_so_sc_task",
                value: taskId 
            });
            console.log("initial",initial);
            console.log("days",days);
            var noadd="N"
            if (initial==-1)      {initial=1;days=0;noadd="Y"}
            else
            {
                if (initial<days)      {days=0;noadd="Y"}
            }
            

            log.debug("initial-days+duration",(initial-days+duration-1));

            newstartdate=new Date(ecddays[initial-days-duration+1]);
            newenddate=new Date(ecddays[initial-days]);
 
           // var newstartdate=new Date(shipdate);
            //newstartdate.setDate(newstartdate.getDate()-days);

            //var newenddate=new Date(newstartdate);
           // newenddate.setDate(newenddate.getDate()+duration);

           console.log("newstartdate",newstartdate);
           console.log("newenddate",newenddate);

            log.debug("newstartdate",newstartdate);
            log.debug("newenddate",newenddate);


            if (noadd=="N") 
            {

                try{

            

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

                }   catch(e) {
                    console.log(e);}

            }
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
               "custrecord_sequence",
               "custrecord_recurrent"
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
                custrecord_recurrent = fresult1.getValue({ name: "custrecord_recurrent" });

                if (custrecord_recurrent) 
                    {
                        custrecord_blockdate=getMonday(custrecord_blockdate,custrecord_recurrent);
                    }
                        vstartdate= new Date(custrecord_blockdate);
                        var y = vstartdate.getFullYear();
                        var m = ('0'+(vstartdate.getMonth()+1)).slice(-2)
                        var d = ('0'+(vstartdate.getDate())).slice(-2)
                        custrecord_blockdate = m + "/" + d + "/" + y;
                  
                
                function getMonday(d,tc) 
                {
                    //return d;
                    log.debug("d",d);
                    log.debug("tc",tc);
                    const today = new Date();
                    var montha = today.getMonth() + 1;
                    const myArray = d.split("/");
                    
                    if ((myArray[0]-montha)<-3) {yeara=today.getFullYear()+1;}
                    else                        {yeara=today.getFullYear();}
                    log.debug("(myArray[0]-montha",(myArray[0]-montha));
                    mes = [31,28,31,30,31,30,31,31,30,31,30,31]

                    if (tc==1) 
                    {
                    d = myArray[0]+"-01-"+yeara;
                    d = new Date(d);
                    var day = d.getDay();
                    
                    diff = d.getDate()  +  (day <= 1 ? (1 - day) :  (8 - day)); // adjust when day is sunday
                    }
                    if (tc==2) 
                    {
                    d = myArray[0]+"-"+mes[myArray[0]-1]+"-"+yeara;
                    d = new Date(d);
                    var day = (d.getDay() == 0 ? 7 : d.getDay());
                    
                    diff = d.getDate()  +  (1 - day); // adjust when day is sunday
                    }
                    if (tc==3)
                    {
                    d = myArray[0]+"-"+mes[myArray[0]-1]+"-"+yeara;
                    d = new Date(d);
                    var day = (d.getDay() < 4 ? 7 + d.getDay(): d.getDay());
                    
                    diff = d.getDate()  +  (4 - day); // adjust when day is sunday
                    }
                    if (tc==4)
                        {
                        d = myArray[0]+"-"+myArray[1]+"-"+yeara;
                        d = new Date(d);
                        diff = d.getDate(); // adjust when day is sunday
                        }

                    return new Date(d.setDate(diff));
                    
                }       

                ecdholydays[i]=custrecord_blockdate;
                i++;
                
            });
            
        });
 

        const td = new Date();
        log.debug("td",td);

        var newstartdate=new Date(td);
        newstartdate.setDate(td.getDate()-100);
        log.debug("newstartdate",newstartdate);

        for (i=1;i<300;i++)
        {
            newstartdate.setDate(newstartdate.getDate()+1);
            if (newstartdate.getDay() == 0) {i--;continue;}
            if (newstartdate.getDay() == 6) {i--;continue;}

            var y = newstartdate.getFullYear();
            var m = ('0'+(newstartdate.getMonth()+1)).slice(-2)
            var d = ('0'+(newstartdate.getDate())).slice(-2)
            datetofind = m + "/" + d + "/" + y;
            initial = parseInt(ecdholydays.indexOf(datetofind));
            if (initial!=-1)      {log.debug("holydays",datetofind);i--;continue;}
            log.debug("datetofind",datetofind)
            ecddays[i]=datetofind;
        }
        
       
    }
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        refreshSchedule: refreshSchedule,
        refreshCrib: refreshCrib,
        saveRecord: saveRecord
    };
});
