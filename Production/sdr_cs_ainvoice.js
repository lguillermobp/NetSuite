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

    
   

    function copystatement() {
        
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




 
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        copystatement: copystatement,
        saveRecord: saveRecord
    };
});
