/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/record", 'N/log', "N/search", "N/runtime", "/SuiteScripts/Modules/generaltoolsv1.js"], function (record, log, search, runtime, GENERALTOOLS) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {

        log.debug("context.type", context.type);

        ecdsummary = ' <div style="color: #F9F0F1; font-size: 14px; padding: 5px;   text-align:center; background-color: #000000;"> 	[TYPE]</div>'
        ecdsummary = ecdsummary.replace("[TYPE]", context.type);

        context.newRecord.setValue("custitem_event_type", ecdsummary);


    }

    function beforeSubmit(context) {


    }

    function afterSubmit(context) {

        log.debug("context.type", context.type);


        if (context.type == "create" || context.type == "edit") {
            var currentRecord = record.load({
                type: context.newRecord.type,
                id: context.newRecord.id,
                isDynamic: false
            });

            // Check if location configurations is empty

            var lookupResultitem = search.lookupFields({
                type: context.newRecord.type,
                id: context.newRecord.id,
                columns: ['inventorylocation'] // Example with a joined field
            });

            var locationid = lookupResultitem.inventorylocation.length;
            //var locationid = recinventoryloc[0].value;

            var itemname = currentRecord.getValue({ fieldId: 'itemid' });

            locationConfigCount = 1; // temp fix to avoid adding location line multiple times;

            if (locationid === 0 && currentRecord.getValue({ fieldId: 'baserecordtype' }) == 'inventoryitem') {
                var itemLocConfigRec = record.create({
                    type: record.Type.ITEM_LOCATION_CONFIGURATION,
                    defaultValues: {
                        item: context.newRecord.id
                    }
                });
                itemLocConfigRec.setValue({
                    fieldId: 'subsidiary',
                    value: '1'
                });
                itemLocConfigRec.setValue({
                    fieldId: 'location',
                    value: '1'
                });
                itemLocConfigRec.setValue({
                    fieldId: 'itemid',
                    value: context.newRecord.id
                });
                itemLocConfigRec.setValue({
                    fieldId: 'name',
                    value: itemname + ' - Kissimmee - Warehouse'
                });
                var recId = itemLocConfigRec.save();
                log.debug("Item Location Configuration created with ID: " + recId);
            }
        }
        else {
            var currentRecord = context.oldRecord;
        }

        if (context.type == "create" || context.type == "delete" || context.type == "edit") {
            var item_id = currentRecord.getValue({ fieldId: 'id' });
            var item_name = currentRecord.getValue({ fieldId: 'itemid' });
            var item_description = currentRecord.getValue({ fieldId: 'salesdescription' });
            var item_unit = currentRecord.getText({ fieldId: 'baseunit' });
            var exclude_projections = currentRecord.getValue({ fieldId: 'custitem_exclude_viewecd' });
            var item_make = Number(currentRecord.getValue({ fieldId: 'custitem_make' }));
            var item_makeT = currentRecord.getText({ fieldId: 'custitem_make' });
            var item_step = Number(currentRecord.getValue({ fieldId: 'custitem_steps' }));
            var item_stepT = currentRecord.getText({ fieldId: 'custitem_steps' });

            var parent_id = Number(currentRecord.getValue({ fieldId: 'parent' }));
            var purchasedescription = currentRecord.getValue({ fieldId: 'purchasedescription' });
            var type = currentRecord.getValue({ fieldId: 'itemtypename' });
            var averageCost = Number(currentRecord.getValue({ fieldId: 'averagecost' }));
            var lastpurchaseprice = Number(currentRecord.getValue({ fieldId: 'lastpurchaseprice' }));

            var item_price = Number(currentRecord.getSublistValue({ sublistId: 'price1', fieldId: 'price_1_', line: 0 }));
            var item_price_currency = currentRecord.getSublistText({ sublistId: 'price1', fieldId: 'currency', line: 0 });
            var lookupResult = search.lookupFields({
                type: "currency",
                id: item_price_currency,
                columns: ['name'] // Example with a joined field
            });

            item_price_currency = lookupResult.name;

            //var item_price = Number(currentRecord.getMatrixSublistValue ({    sublistId: 'price',    fieldId: 'price',    column: 0,    line: 0}) );
            var vendorpricecurrency = " ";
            var vendorcost = 0;

            // locate the line in itemvendor where defaultvendor is true and use its values if found
            var defaultVendorLine = currentRecord.findSublistLineWithValue({
                sublistId: 'itemvendor',
                fieldId: 'preferredvendor',
                value: 'T'
            });


            if (defaultVendorLine >= 0) {
                vendorpricecurrency = currentRecord.getSublistValue({
                    sublistId: 'itemvendor',
                    fieldId: 'vendorcurrencyname',
                    line: defaultVendorLine
                });
                vendorcost = Number(currentRecord.getSublistValue({
                    sublistId: 'itemvendor',
                    fieldId: 'purchaseprice',
                    line: defaultVendorLine
                }));
            }


            // locate the line in itemvendor where defaultvendor is true and use its values if found
            var defaultVendorLine = currentRecord.findSublistLineWithValue({
                sublistId: 'binnumber',
                fieldId: 'preferredbin',
                value: 'T'
            });

            var binnumber = 0;

            if (defaultVendorLine >= 0) {
                binnumber = Number(currentRecord.getSublistValue({ sublistId: 'binnumber', fieldId: 'binnumber', line: defaultVendorLine }));
            }

            var opt = "SET";
            datasending = {
                "item_id": item_id,
                "item_name": item_name,
                "item_description": item_description,
                "item_unit": item_unit,
                "bin_id": binnumber,
                "exclude_projections": exclude_projections,
                "item_make": item_makeT,
                "item_model": " ",
                "item_price": item_price,
                "item_price_currency": item_price_currency,
                "item_step": item_stepT,
                "item_step_id": item_step,
                "item_make_id": item_make,
                "item_parent_id": parent_id,
                "item_description_po": purchasedescription,
                "item_type": type,
                "item_cost": averageCost,
                "item_last_poprice": lastpurchaseprice,
                "item_vendor_price": vendorcost,
                "item_vendor_currency": vendorpricecurrency
            }
            const jsonString = JSON.stringify(datasending);

            dataall = GENERALTOOLS.postViewECD_item_api(item_id, opt, jsonString)

        }
    }

    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
        // beforeSubmit: beforeSubmit
    }
})

