/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/record", "N/ui/message", "N/search", "N/runtime","N/log", "/SuiteScripts/Modules/generaltoolsv1.js"], function (record, message, search, runtime,log, GENERALTOOLS) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {

      
        const currentRecordId = context.newRecord.id;
        log.audit({title: "context.type", details: context.type});

        workorderId = context.newRecord.getValue({fieldId: "createdfrom"});
        log.audit({title: "workorderId", details: workorderId});
      

        var userObj = runtime.getCurrentUser();
		var userID = userObj.id;
		var userPermission = userObj.getPermission({	name : 'TRAN_PURCHORD'	});
		autPO= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;
        log.audit({title: "autPO", details: autPO});

        var itembo = searchboitems(workorderId);
                log.debug("itembo", itembo);
                if (itembo.length > 0) {
                    if (itembo.length == 1) {
                        var msgbo = "Please note the following item is not transferred: " + itembo.toString();
                    } else {
                        var msgbo = "Please note the following items are not transferred: " + itembo.toString();
                    }
                    log.debug("msgbo", msgbo);
                
                    message.create({
                        title: "Manufacturing Order contains items have not transferred",
                        message:  msgbo,
                        type: message.Type.ERROR
                    }).show();
                }
      

 
  
    }

    function beforeSubmit(context) {
        // ================================================================================
        // Set Customer PO Number and Sales Order Requested Ship Date
        // ================================================================================
        
      
        const currentRecordId = context.newRecord.id;
        log.audit({title: "context.type", details: context.type});
        

       
    }

    function searchboitems(workorderId) {

        var itembo=[];


        var fsearch = search.create({
            type: "transaction",
            settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
            filters:
            [
               [[["status","anyof","WorkOrd:B","WorkOrd:G"],"AND",["internalid","anyof",workorderId],"AND",["type","anyof","WorkOrd"]],"OR",[["type","anyof","InvTrnfr"],"AND",["custbody_mo.internalid","anyof",workorderId],"AND",["custbody_mo.mainline","is","T"],"AND",["memo","isnotempty",""]]], 
               "AND", 
               ["mainline","is","F"], 
               "AND", 
               ["location","anyof","4"], 
               "AND", 
               ["sum(formulanumeric: CASE  WHEN {type}='Manufacturing Order' THEN {quantity} ELSE 0 END - CASE  WHEN {type}='Inventory Transfer' THEN {quantity} ELSE 0 END)","notequalto","0"]
            ],
            columns:
            [
               search.createColumn({
                  name: "formulatext",
                  summary: "MAX",
                  formula: "CASE  WHEN {type}='Manufacturing Order' THEN {customermain.altname} ELSE '' END"
               }),
               search.createColumn({
                  name: "formulatext",
                  summary: "GROUP",
                  formula: "CASE  WHEN {type}='Inventory Transfer' THEN {memo} ELSE {number} END"
               }),
               search.createColumn({
                  name: "formulatext",
                  summary: "MAX",
                  formula: "CASE  WHEN {type}='Inventory Transfer' THEN {number} ELSE  ' ' END"
               }),
               search.createColumn({
                  name: "formulanumeric",
                  summary: "MAX",
                  formula: "CASE  WHEN {type}='Manufacturing Order' THEN {internalid} ELSE  0 END"
               }),
               search.createColumn({
                  name: "item",
                  summary: "GROUP"
               }),
               search.createColumn({
                  name: "formulanumeric",
                  summary: "SUM",
                  formula: "CASE  WHEN {type}='Manufacturing Order' THEN {quantity} ELSE 0 END"
               }),
               search.createColumn({
                  name: "formulanumeric",
                  summary: "SUM",
                  formula: "CASE  WHEN {type}='Inventory Transfer' THEN {quantity} ELSE 0 END"
               }),
               search.createColumn({
                  name: "formulanumeric",
                  summary: "SUM",
                  formula: "CASE  WHEN {type}='Manufacturing Order' THEN {quantity}-NVL({quantitycommitted}, 0) ELSE 0 END"
               }),
               search.createColumn({
                  name: "datecreated",
                  summary: "MAX"
               }),
               search.createColumn({
                  name: "formulanumeric",
                  summary: "SUM",
                  formula: "sum(CASE  WHEN {type}='Manufacturing Order' THEN {quantity} ELSE 0 END - CASE  WHEN {type}='Inventory Transfer' THEN {quantity} ELSE 0 END)"
               })
            ]
         });

         var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });
        log.debug("pagedData.pageRanges.length",pagedData.pageRanges.length);
       
        
        if (pagedData.pageRanges.length > 0) {

            pagedData.pageRanges.forEach(function (pageRange) {
                var page = pagedData.fetch({index: pageRange.index});
                page.data.forEach(function (fresult1) {
                    
                    item=fresult1.getValue(fresult1.columns[4])
                    qty=Number(fresult1.getValue(fresult1.columns[7]));
                    if (qty != 0) {
                        descrip=item + " - (" + qty + ") -";
                        itembo.push(descrip);
                    }
                    
                });
            });

        }

        return itembo;
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit
    }
})

