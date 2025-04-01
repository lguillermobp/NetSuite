/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
var ecddays = [];
var ecdholydays = [];
define(['N/search','N/currentRecord','N/log',"N/record","N/ui/dialog", "/SuiteScripts/Modules/generaltoolsv1.js"], function(search, currentRecord, log, record,dialog, GENERALTOOLS) {
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
        
        // Code to be executed when a field value changes
    }

    
   

    function copystatement() {
        
        var currRec = currentRecord.get();


        var sc = currRec.getValue({
            fieldId: "id"
        });
        var cd = currRec.getValue({
            fieldId: "custrecord_ai_customer"
        });
        
        log.debug("sc",sc);
        log.debug("cd",cd);
        clearaid(sc, cd, 1);
        
    }
    function copyquote() {
        
        var currRec = currentRecord.get();


        var sc = currRec.getValue({
            fieldId: "id"
        });
        var cd = currRec.getValue({
            fieldId: "custrecord_quote"
        });
        
        log.debug("sc",sc);
        log.debug("cd",cd);
        clearaid(sc, cd, 2);
        
    }

    function saveRecord(context) {
        // Code to be executed when the record is saved
        return true;
    }


// Crib Design Template

function lookcd(sc, cd) {

    console.log("sc",sc);
    console.log("cd",cd);

    var fsearch = search.load({
        id: "customsearch_ecdcustomerstatement",
    });

    fsearch.filters.push(search.createFilter({

        name: "formulanumeric",
        operator: "equalto",
        values: cd,
        formula: "CASE WHEN ({type} in('ECD Transaction')) THEN {custbody_customer.internalid} ELSE {customer.internalid} END",
        isor: false,
        isnot: false,
        leftparens: 0,
        rightparens: 0
    }));

    var pagedData = fsearch.runPaged({
        "pageSize" : 1000
    });

        var newTaskRecord = record.create({
            type: "customrecord_aid",
            isDynamic: true
        });
        // Set field values for the new record
        newTaskRecord.setValue({
            fieldId: "custrecord_ai",
            value: sc 
        });
        description = "STATEMENT:";
        newTaskRecord.setValue({
            fieldId: "custrecord_aid_description",
            value: description 
        });
        newTaskRecord.setValue({
            fieldId: "custrecord_typeofdetail",
            value: 1 
        });

        var newTaskRecordId = newTaskRecord.save({
            enableSourcing: true,
            ignoreMandatoryFields: true
        });

        var totalbalence = 0;


    log.debug("pagedData.pageRanges.length",pagedData.pageRanges.length);
    log.debug("pagedData",pagedData);
    pagedData.pageRanges.forEach(function (pageRange) {
        var page = pagedData.fetch({index: pageRange.index});
        log.debug("page.length",page.length);
        page.data.forEach(function (fresult1) {
            var amount = Number(fresult1.getValue(fresult1.columns[11]));
            var descrip = fresult1.getValue(fresult1.columns[7]);
            var trandate = fresult1.getValue(fresult1.columns[10]);
            var memo = fresult1.getValue(fresult1.columns[10]);
            var document = fresult1.getValue(fresult1.columns[9]);
                
        var newTaskRecord = record.create({
            type: "customrecord_aid",
            isDynamic: true
        });
        // Set field values for the new record
        newTaskRecord.setValue({
            fieldId: "custrecord_ai",
            value: sc 
        });
        description = descrip;
        if (memo !="- None -") {
            description += "-" + memo;
        }
        newTaskRecord.setValue({
            fieldId: "custrecord_aid_description",
            value: descrip 
        });
        newTaskRecord.setValue({
            fieldId: "custrecord_typeofdetail",
            value: 1 
        });
        newTaskRecord.setValue({
            fieldId: "custrecord_aid_document",
            value: document 
        });
        newTaskRecord.setValue({
            fieldId: "custrecord_aid_date",
            value: new Date(trandate) 
        });
        newTaskRecord.setValue({
            fieldId: "custrecord_aid_category",
            value: descrip 
        });
        newTaskRecord.setValue({
            fieldId: "custrecord_aid_amount",
            value: amount 
        });
        log.debug("descrip",descrip);
        log.debug("amount",amount);

        totalbalence = totalbalence + amount;

        // Save the new record
        
        var newTaskRecordId = newTaskRecord.save({
            enableSourcing: true,
            ignoreMandatoryFields: true
        });
        
     
    });
    });
    var newTaskRecord = record.create({
        type: "customrecord_aid",
        isDynamic: true
    });
    // Set field values for the new record
    newTaskRecord.setValue({
        fieldId: "custrecord_ai",
        value: sc 
    });
    description = "BALANCE:";
    newTaskRecord.setValue({
        fieldId: "custrecord_aid_description",
        value: description 
    });
    newTaskRecord.setValue({
        fieldId: "custrecord_typeofdetail",
        value: 1 
    });
    newTaskRecord.setValue({
        fieldId: "custrecord_aid_amount",
        value: totalbalence 
    });

    var newTaskRecordId = newTaskRecord.save({
        enableSourcing: true,
        ignoreMandatoryFields: true
    });
    window.location.reload(false);
   
}

function lookcdq(sc, cd) {

    var fsearch = search.create({
        type: "transaction",
        settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
        filters:
        [
            ["mainline","is","F"], 
            "AND", 
            ["internalid","anyof",cd], 
            "AND", 
            ["type","anyof","Estimate"], 
            "AND", 
            ["amount","notequalto","0.00"]
        ],
        columns:
        [
            "trandate",
            "print",
            "type",
            "tranid",
            "transactionnumber",
            "entity",
            "account",
            "statusref",
            "memo",
            "currency",
            "amount",
            "discountamount",
            "total",
            "grossamount",
            "itemtype",
            "custcol_saledescription"
        ]
            });

    var pagedData = fsearch.runPaged({
        "pageSize" : 1000
    });

        var newTaskRecord = record.create({
            type: "customrecord_aid",
            isDynamic: true
        });
        // Set field values for the new record
        newTaskRecord.setValue({
            fieldId: "custrecord_ai",
            value: sc 
        });
        description = "UPGRADES:";
        newTaskRecord.setValue({
            fieldId: "custrecord_aid_description",
            value: description 
        });
        newTaskRecord.setValue({
            fieldId: "custrecord_typeofdetail",
            value: 2
        });

        var newTaskRecordId = newTaskRecord.save({
            enableSourcing: true,
            ignoreMandatoryFields: true
        });

        var totalbalence = 0;


    log.debug("pagedData.pageRanges.length",pagedData.pageRanges.length);
    log.debug("pagedData",pagedData);
    pagedData.pageRanges.forEach(function (pageRange) {
        var page = pagedData.fetch({index: pageRange.index});
        log.debug("page.length",page.length);
        page.data.forEach(function (fresult1) {
            var amount = Number(fresult1.getValue({ name: "amount"}));
            var descrip = fresult1.getValue({ name: "custcol_saledescription"});
            var docdate = fresult1.getValue({ name: "trandate"});
            var document = fresult1.getValue({ name: "tranid"});
            var doccategory = fresult1.getValue({ name: "type"});
                
        var newTaskRecord = record.create({
            type: "customrecord_aid",
            isDynamic: true
        });
        // Set field values for the new record
        newTaskRecord.setValue({
            fieldId: "custrecord_ai",
            value: sc 
        });
        description = descrip;
        newTaskRecord.setValue({
            fieldId: "custrecord_aid_description",
            value: description 
        });
        newTaskRecord.setValue({
            fieldId: "custrecord_aid_document",
            value: document 
        });
        newTaskRecord.setValue({
            fieldId: "custrecord_aid_date",
            value: new Date(docdate)  
        });
        newTaskRecord.setValue({
            fieldId: "custrecord_aid_category",
            value: doccategory 
        });
        newTaskRecord.setValue({
            fieldId: "custrecord_typeofdetail",
            value: 2 
        });
        newTaskRecord.setValue({
            fieldId: "custrecord_aid_amount",
            value: amount 
        });
        log.debug("descrip",descrip);
        log.debug("amount",amount);

        totalbalence = totalbalence + amount;

        // Save the new record
        
        var newTaskRecordId = newTaskRecord.save({
            enableSourcing: true,
            ignoreMandatoryFields: true
        });
        
     
    });
    });
    var newTaskRecord = record.create({
        type: "customrecord_aid",
        isDynamic: true
    });
    // Set field values for the new record
    newTaskRecord.setValue({
        fieldId: "custrecord_ai",
        value: sc 
    });
    description = "TOTAL QUOTE:";
    newTaskRecord.setValue({
        fieldId: "custrecord_aid_description",
        value: description 
    });
    newTaskRecord.setValue({
        fieldId: "custrecord_typeofdetail",
        value: 2
    });
    newTaskRecord.setValue({
        fieldId: "custrecord_aid_amount",
        value: totalbalence 
    });

    var newTaskRecordId = newTaskRecord.save({
        enableSourcing: true,
        ignoreMandatoryFields: true
    });
    window.location.reload(false);
}

function clearaid(sc, cd, td) {
    
    var fsearch = search.create({
        type: "customrecord_aid",
        filters:
        [
           ["custrecord_ai","anyof",sc], 
           "AND", 
           ["custrecord_typeofdetail","anyof",td]
        ],
        columns:
        [
           "internalid"
        ]
         });
         

    var pagedData = fsearch.runPaged({
        "pageSize" : 1000
    });
   
    
    if (pagedData.pageRanges.length > 0) {
        
        function success(result) {

            if (result) 
            {
                pagedData.pageRanges.forEach(function (pageRange) {
                    var page = pagedData.fetch({index: pageRange.index});
                    page.data.forEach(function (fresult1) {
                        console.log(fresult1);
                        log.debug("fresult1",fresult1);
                        
                        cribID = fresult1.getValue({ name: "internalid" });
                        console.log(cribID);
                        log.debug("cribID",cribID);
                        var recordToDelete = record.delete({
                            type: 'customrecord_aid',
                            id: cribID
                        });
                    });
                });
                if (td == 1) {
                    lookcd(sc, cd);
                }
                else if (td == 2) {
                    lookcdq(sc, cd);
                }
                
                
            }
            console.log('Success with value ' + result);
        }
    
        function failure(reason) {
            console.log('Failure: ' + reason);
        }
        dialog.confirm({
            'title': 'Invoice contains Statement',
            'message': 'Are you sure that you want refresh it?'
        }).then(success).catch(failure);
    
    }
    else
    {
        if (td == 1) {
            lookcd(sc, cd);
        }
        else if (td == 2) {
            lookcdq(sc, cd);
        }
    }



}


 
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        copystatement: copystatement,
        copyquote: copyquote,
        saveRecord: saveRecord
    };
});
