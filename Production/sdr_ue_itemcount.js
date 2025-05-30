/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/search','N/log','N/ui/serverWidget'], function(record,s, log,serverWidget) {
    
    /**
     * Function triggered before a record is submitted.
     * @param {Object} context - The context object containing information about the record being processed.
     * @param {Record} context.newRecord - The new record being submitted.
     * @param {Record} context.oldRecord - The old record before being edited.
     * @param {string} context.type - The operation type (create, edit, delete, xedit, approve, reject, cancel, pack, ship, invoice, reassign, editforecast, revalue, editord, editapprove, reestimatetotal, reestimateresource, reschedule, editcancelled, editrejected).
     */
    function beforeLoad(context) {

        log.debug("contextBL",context);
        log.audit({title: "context.typeBL", details: context.type});

        // Your code logic here
    }
    
    /**
     * Function triggered after a record is submitted.
     * @param {Object} context - The context object containing information about the record being processed.
     * @param {Record} context.newRecord - The new record after being submitted.
     * @param {Record} context.oldRecord - The old record before being edited.
     * @param {string} context.type - The operation type (create, edit, delete, xedit, approve, reject, cancel, pack, ship, invoice, reassign, editforecast, revalue, editord, editapprove, reestimatetotal, reestimateresource, reschedule, editcancelled, editrejected).
     */
    function afterSubmit(context) {

        if (context.type !== context.UserEventType.CREATE) {

            log.debug("contextAL",context);
            log.audit({title: "context.typeAL", details: context.type});
            internalid= context.newRecord.id;
            log.debug("internalid", internalid);
            binlocation= context.newRecord.getValue({fieldId: 'custrecord_sc_bin'});
            log.debug("binlocation", binlocation);
            item= context.newRecord.getValue({fieldId: 'custrecord_sc_item'});
            log.debug("item", item);
            location= context.newRecord.getValue({fieldId: 'custrecord_sc_location'});
            log.debug("location", location);
            id = context.newRecord.getValue({fieldId: 'id'});

            internalid = PhysicalCount(item, binlocation, location);

            if (internalid == 0) {
                log.debug("Creating new Physical Count Record");
                pc = record.create({
                    type: "customrecord_physicalcount",
                    isDynamic: true
                });

                pc.setValue({
                    fieldId: 'custrecord_pc_item',
                    value: item 
                });
                pc.setValue({
                    fieldId: 'custrecord_pc_bin',
                    value: binlocation 
                });
                pc.setValue({
                    fieldId: 'custrecord_pc_location',
                    value: location 
                });
                pc.setValue({
                    fieldId: 'custrecord_pc_item_count',
                    value: id 
                });
                pc.setValue({
                    fieldId: 'custrecord_pc_status',
                    value: 2 
                });

                pcinternalid = pc.save();
            }
            else {

                pc = record.load({
                    type: "customrecord_physicalcount",
                    id: internalid,
                    isDynamic: true
                });

                pc.setValue({
                    fieldId: 'custrecord_pc_item_count',
                    value: id 
                });
                pc.save();

            }

        }

    }
    
    function PhysicalCount(item, binlocation, location) {

        var internalid = 0;  
        var fsearch =   s.create({
            type: "customrecord_physicalcount",
            filters:
            [
                ["formulanumeric: CASE  WHEN      {custrecord_pc_location}={custrecord_pc_item.inventorylocation} THEN 1 ELSE 0 END","equalto","1"], 
                "AND", 
                ["custrecord_pc_bin","anyof",binlocation], 
                "AND", 
                ["custrecord_pc_item","anyof",item], 
                "AND", 
                ["custrecord_pc_location","anyof",location]
            ],
            columns:
            [
                "internalid",
                "custrecord_pc_item",
                "custrecord_pc_location",
                "custrecord_pc_bin",
                "custrecord_pc_status",
                "custrecord_pc_datecounted"
            ]
            });

        var pagedData = fsearch.runPaged({
            "pageSize": 1000
        });

        var paramrec;
        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});
            var wbillid = ' ';
            var i = 0;

            page.data.forEach(function (fresult) {

                internalid = fresult.getValue({name: "internalid"});

            });

        })
        
        return internalid;
    }
    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
    };
});
