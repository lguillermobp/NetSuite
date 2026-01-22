"use strict";

/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(["N/search", "N/record",  "N/log","/SuiteScripts/Modules/generaltoolsv1.js"],
    /**
     * @param {N/search} search
     * @param {N/record} record
     * @return {{post: exports.post}}
     */
    function (search, record, log, GENERALTOOLS) {

         function get (_ref) {

            return _ref;
        }

         function post (context) {

            log.debug("context",context);
            try {
            contextjson = JSON.parse(context);
            }
            catch (e) {
                log.debug("error",e);
                contextjson = context;
            }

            
            var option= contextjson.option;
            log.debug("option",option); 

           
            idsearch = "customsearch_ecd_items";


             try {
                var fsearch =search.load({
                            id: idsearch
                    });
                log.debug({ title: 'Search loaded successfully', details: fsearch });

                } catch (error) {
                log.error({ title: 'Error loading saved search', details: error });
                }

                if (option == "U") {

                var defaultFilters = fsearch.filters;
                var customFilters = [];
                
                    customFilters = {
                        name: "lastmodifieddate",
                        operator: "within",
                        values: "today",
                        isor: false,
                        isnot: false,
                        leftparens: 0,
                        rightparens: 0

                    };

                    defaultFilters.push(customFilters);
                    fsearch.filters = defaultFilters;           
                }
                
             var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });
            var i=0;
            var dataf=[];
            pagedData.pageRanges.forEach(function (pageRange) {
                log.audit(pageRange.index);
                var page = pagedData.fetch({index: pageRange.index});
                page.data.forEach(function (fresult1) {

                    if (fresult1.getValue({name: "type", summary: "GROUP"})=="Discount") {
                        item_step_id=9;
                        item_step="STEP 99 - Discount";
                    }
                    else
                    {
                        item_step_id=Number(fresult1.getValue({name: "custitem_steps", summary: "GROUP"}));
                        item_step=fresult1.getText({name: "custitem_steps", summary: "GROUP"}) == '- None -' ? '' : fresult1.getText({name: "custitem_steps", summary: "GROUP"});
                    }
                    
                    dataf[i] = {
                        "bin_id": Number(fresult1.getValue({name: "internalid",    summary: "GROUP", join: "binNumber"})),
                        "item_id": Number(fresult1.getValue({name: "internalid", summary: "GROUP"})),
                        "item_name": fresult1.getValue({name: "itemid", summary: "GROUP"}),
                        "item_description": fresult1.getValue({name: "salesdescription", summary: "GROUP"}) == '- None -' ? '' : fresult1.getValue({name: "salesdescription", summary: "GROUP"}),
                        "item_description_po": fresult1.getValue({name: "purchasedescription", summary: "GROUP"}) == '- None -' ? '' : fresult1.getValue({name: "purchasedescription", summary: "GROUP"}),
                        "item_unit": fresult1.getText({name: "unitstype", summary: "GROUP"}),
                        "exclude_projections": fresult1.getValue({name: "custitem_exclude_viewecd", summary: "GROUP"}),
                        "item_make": fresult1.getText({name: "custitem_make", summary: "GROUP"}) == '- None -' ? '' : fresult1.getText({name: "custitem_make", summary: "GROUP"}),
                        "item_make_id": Number(fresult1.getValue({name: "custitem_make", summary: "GROUP"})),
                        "item_model": fresult1.getText({name: "custitem1", summary: "GROUP"}) == '- None -' ? '' : fresult1.getText({name: "custitem1", summary: "GROUP"}),
                        "item_price": Number(fresult1.getValue(fresult1.columns[8])),
                        "item_price_b2b": Number(fresult1.getValue(fresult1.columns[9])),
                        "item_step": item_step,
                        "item_step_id": item_step_id,
                        "item_parent_id": Number(fresult1.getValue({name: "parent", summary: "GROUP"})),
                        "item_type": fresult1.getText({name: "type", summary: "GROUP"}),
                        "item_cost": Number(fresult1.getValue({name: "averagecost", summary: "GROUP"})),
                        "item_last_poprice": Number(fresult1.getValue({name: "lastpurchaseprice", summary: "MAX"})),
                        "item_vendor_price": Number(fresult1.getValue({name: "vendorcost", summary: "MAX"})),
                        "item_vendor_currency": fresult1.getValue({name: "vendorpricecurrency", summary: "MAX"})
                    }
                    i++;

                })
            })

            return dataf;
        }


        return {
            get: get,
            post: post

        };
    });