/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
var ecddays=[];
var oldstartdate;
define(["N/log","N/record","N/search", 'N/ui/dialog',"N/runtime"], function(log, record, s, nDialog,runtime) {
    function pageInit(context) {
        // Code to execute when the page loads
        var currentRecord = context.currentRecord;
        oldstartdate = currentRecord.getValue({ fieldId: "custrecord_so_sc_startdate" });
       
    }
    
    function fieldChanged(context) {
        // Code to execute when a field value changes
        var currentRecord = context.currentRecord;
        var fieldId = context.fieldId;
        log.debug("fieldId",fieldId);
        if (fieldId == "custrecord_so_sc_startdate") {
            var startdate = currentRecord.getValue({ fieldId: "custrecord_so_sc_startdate" });
            var duration = currentRecord.getValue({ fieldId: "custrecord_sc_soduration" });
            log.debug("startdate",startdate);

            var newenddate=new Date(calcenddate(startdate,duration));

            currentRecord.setValue({    fieldId: "custrecord_so_sc_enddate",
                                        value: newenddate });
            log.debug("enddate",newenddate);
        }
        
        
    }

    function saveRecord(context) {
        var currentRecord = context.currentRecord;
        startdate = currentRecord.getValue({ fieldId: "custrecord_so_sc_startdate" });
        internalidsc = currentRecord.getValue({ fieldId: "custrecord_salecontract" });
        pl = currentRecord.getValue({ fieldId: "custrecord_so_sc_productionline" });
        seq1 = currentRecord.getValue({ fieldId: "custrecord_so_sc_task" });

        var taskrecord = record.load({
            type: 'customrecord_scheduletasks',
            id: seq1
        });
        var seq = taskrecord.getValue({ fieldId: "custrecord_sc_tasksseq" });

        if (String(startdate).substring(0, 10)!=String(oldstartdate).substring(0, 10)) 
        {
            log.debug("startdate",startdate);
            log.debug("oldstartdate",oldstartdate);
            var internalid = currentRecord.getValue({ fieldId: "id" });

            var y = oldstartdate.getFullYear();
            var m = oldstartdate.getMonth() + 1;
            var d = oldstartdate.getDate();
            datetofind = m + "/" + d + "/" + y;
            initial = parseInt(ecddays.indexOf(datetofind));
            log.debug("initial",initial);

            var y = startdate.getFullYear();
            var m = startdate.getMonth() + 1;
            var d = startdate.getDate();
            datetofind = m + "/" + d + "/" + y;
            final = parseInt(ecddays.indexOf(datetofind));
            log.debug("final",final);
            dayspushed = Math.abs(final - initial) + 1;
            if (initial>final) {dayspushed=(dayspushed - 2)*-1;}
            pushsch(internalid, dayspushed,seq,internalidsc,pl);
        }

        return true;
    }

    function calcenddate(strdate,duration) {

        var dt = new Date(strdate);
        log.debug("dt",dt);
        var strdate = dt;
        
        log.debug("strdate",strdate);

        if (ecddays.length==0) {pecddays();}

        var y = strdate.getFullYear();
        var m = strdate.getMonth() + 1;
        var d = strdate.getDate();
        datetofind = m + "/" + d + "/" + y;
        log.debug("datetofind",datetofind);
        initial = parseInt(ecddays.indexOf(datetofind));
        log.debug("initial",initial);

        if (initial==-1)      {return strdate;}
        
        newenddate=new Date(ecddays[initial+duration-1]);


        function pecddays() {

            var ecdholydays=[];
        
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
    
                    ecdholydays[i]=custrecord_blockdate;
                    i++;
                    
                });
                
            });
            const td = new Date();
            var newstartdate=new Date(td);
            newstartdate.setDate(td.getDate()-50);
    
            for (i=1;i<300;i++)
            {
                newstartdate.setDate(newstartdate.getDate()+1);
                if (newstartdate.getDay() == 0) {i--;continue;}
                if (newstartdate.getDay() == 6) {i--;continue;}
    
                var y = newstartdate.getFullYear();
                var m = newstartdate.getMonth() + 1;
                var d = newstartdate.getDate();
                datetofind = m + "/" + d + "/" + y;
                initial = parseInt(ecdholydays.indexOf(datetofind));
                if (initial!=-1)      {log.debug("holydays",datetofind);i--;continue;}
                ecddays[i]=datetofind;
            }
            
        }


        return newenddate;
    }

    function pushsch(internalid, dayspushed,seq,internalidscc,pl) {
        log.debug("oldstartdate",oldstartdate);
        log.debug("pl",pl);
        log.debug("internalid",internalid);
        log.debug("dayspushed",dayspushed);
        log.debug("seq",seq);
        log.debug("internalidscc",internalidscc);
        var y = oldstartdate.getFullYear();
        var m = oldstartdate.getMonth() + 1;
        var d = oldstartdate.getDate();
        datetofind = m + "/" + d + "/" + y;
        var fsearch = s.create({
            type: "customrecord_so_scheduletasks",
            filters:
            [
                ["custrecord_salecontract.mainline","is","T"], 
                "AND", 
                ["internalid","noneof",internalid], 
                "AND", 
                ["custrecord_so_sc_startdate","onorafter",datetofind], 
                "AND", 
                ["custrecord_so_sc_task.custrecord_sc_tasksseq","greaterthanorequalto",seq],
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
                name: "custrecord_sc_task",
                join: "CUSTRECORD_SO_SC_TASK"
            }),
            "custrecord_so_sc_note",
            s.createColumn({
                name: "custrecord_sc_days",
                join: "CUSTRECORD_SO_SC_TASK"
            }),
            s.createColumn({
                name: "custrecord_sc_tasksseq",
                join: "CUSTRECORD_SO_SC_TASK",
                sort: s.Sort.ASC
            }),
            s.createColumn({
                name: "custrecord_so_sc_startdate",
                sort: s.Sort.ASC
            }),
            "custrecord_so_sc_enddate",
            "custrecord_so_sc_status",
            s.createColumn({
                name: "entity",
                join: "CUSTRECORD_SALECONTRACT"
            }),
            s.createColumn({
                name: "custbody_appf_make_ecd",
                join: "CUSTRECORD_SALECONTRACT"
            }),
            s.createColumn({
                name: "custbody_appf_veh_model",
                join: "CUSTRECORD_SALECONTRACT"
            }),
            s.createColumn({
               name: "internalid",
               join: "CUSTRECORD_SALECONTRACT"
            })
            ]
        });

        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });
        var i=1;
        var changing=true;
        pagedData.pageRanges.forEach(function (pageRange) {
            var page = pagedData.fetch({index: pageRange.index});
            page.data.forEach(function (fresult1) {

                internalidm = fresult1.getValue({ name: "Internalid" });
                log.debug("internalidm",internalidm);
                log.debug("dayspushed",dayspushed);
                internalidsc=fresult1.getValue({ name: "internalid",join: "CUSTRECORD_SALECONTRACT"});
                seqss=fresult1.getValue({ name: "custrecord_sc_tasksseq",join: "CUSTRECORD_SO_SC_TASK"});

                if (seq!=seqss) {changing=false;seq=seqss}
                if (internalidscc==internalidsc) {changing=true;}

                if (changing) 
                {
                    var dateString = fresult1.getValue({ name: "custrecord_so_sc_enddate" });
                    var [month, day, year] = dateString.split('/')
                    var dateObj = new Date(+year, +month - 1, +day)
                    var newenddate=new Date(calcenddate(dateObj,dayspushed));

                    var dateString = fresult1.getValue({ name: "custrecord_so_sc_startdate" });
                    var [month, day, year] = dateString.split('/')
                    var dateObj = new Date(year, month - 1, day)
                    var newstartdate=new Date(calcenddate(dateObj,dayspushed));

                    // Load the record with internal ID 'customrecord_so_scheduletasks'
                    var scheduleTaskRecord = record.load({
                        type: 'customrecord_so_scheduletasks',
                        id: internalidm 
                    });

                    // Set the value of custrecord_so_sc_startdate field
                    log.debug("newstartdate",newstartdate);
                    scheduleTaskRecord.setValue({
                        fieldId: 'custrecord_so_sc_startdate',
                        value: newstartdate
                    });
                    log.debug("newenddate",newenddate);
                    scheduleTaskRecord.setValue({
                        fieldId: 'custrecord_so_sc_enddate',
                        value: newenddate
                    });

                    // Save the record
                    scheduleTaskRecord.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: false
                    });
                }
                
            });
            
        });
        
        
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
    };
});