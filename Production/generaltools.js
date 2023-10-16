define(['N/search'], function (s) {
    /**
     * General Tools
     *
     *
     *
     * Version    Date                    Author           Remarks
     * 2.01       2021-08-119             Luis Barrios
     *
     */

    class Item {

        constructor(item) {

            var filterArray = [];
            filterArray.push(['name', 'is', item]);

            var fsearch = s.load({
                id: "customsearchssforscript"
            });
            fsearch.filterExpression = filterArray;

            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });

            var witemdata
            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});


                page.data.forEach(function (fresult1) {

                    const bomdata= new Bomassembly(item);
                    var components;
                    var bomid;
                    if (bomdata.itemdata.bomid.length!=0)
                    {
                        bomid = bomdata.itemdata.bomid;
                        components = get_bom_list(bomid);
                    }
                    else {
                        components = "";
                        bomid=0;
                    }

                    witemdata= {    "basic": fresult1,
                        "bomid": bomid,
                        "components": components} ;

                })
            })

            this.itemdata= witemdata;
        }

    }


    class Component {

        constructor(component) {

            var filterArray = [];
            filterArray.push(['name', 'is', component]);

            var fsearch1 = s.load({
                id: "customsearchssforscript"
            });
            fsearch1.filterExpression = filterArray;

            var pagedData = fsearch1.runPaged({
                "pageSize" : 1000
            });

            var wcompdata
            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});


                page.data.forEach(function (fresult2) {

                    wcompdata= fresult2;

                })
            })

            this.compdata= wcompdata;
        }

    }


    class Bomassembly {

        constructor(item) {

            var filterArray = [];
            filterArray.push(['name', 'is', item]);

            var fsearch = s.load({
                id: "customsearchassemblybom"
            });
            fsearch.filterExpression = filterArray;

            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });

            var witemdata
            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});


                page.data.forEach(function (fresult1) {
                    var bomid = fresult1.getValue({name: "billofmaterialsid",
                        join: "assemblyItemBillOfMaterials"});

                    witemdata= {    "basic": fresult1,
                        "bomid": bomid} ;

                })
            })

            this.itemdata= witemdata;
        }

    }


    function get_bom_list(bomid) {
        var z = 0;
        var billofm = [];
        var filterArray = [];
        var fsearch = s.create({
            type: "bomrevision",

            columns:
                [
                    "billofmaterials",
                    "name",
                    s.createColumn({
                        name: "item",
                        join: "component"
                    }),
                    s.createColumn({
                        name: "bomquantity",
                        join: "component"
                    }),
                    s.createColumn({
                        name: "description",
                        join: "component"
                    }),
                    s.createColumn({
                        name: "internalid",
                        join: "component"
                    }),
                    s.createColumn({
                        name: "baseunits",
                        join: "component"
                    })
                ]

        });



        if (bomid.length!=0) {
            filterArray.push(['billofmaterials', 'anyof', bomid]);
            filterArray.push('AND');
        }
        filterArray.push(['effectiveenddate', 'isempty', '']);

        fsearch.filterExpression = filterArray;


        var pagedData = fsearch.runPaged({
            "pageSize": 1000
        });

        hts=[];
        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});
            var wbillid = ' ';
            var i = 0;

            page.data.forEach(function (fresult) {

                var billid = fresult.getValue({name: "billofmaterials"});
                var compid = fresult.getText({name: "item", join: "component"});

                if (billid != wbillid) {
                    billofm[billid] = [];

                    wbillid = billid;
                    i = 0;
                }
                var htscode = "";
                if (bomid.length!=0) {
                    var ccomp = new Component(compid);
                    htscode = ccomp.compdata.getText({name: "custitem_htscode"});
                    if (hts.indexOf(htscode)==-1) {  hts.push(htscode);}
                }
                else {
                    htscode = "";
                }

                billofm[billid] [i] = {
                    "htscode": htscode,
                    "description": fresult.getValue({name: "description",
                        join: "component" }),
                    "name": fresult.getValue({name: "name"}),
                    "item": fresult.getText({
                        name: "item",
                        join: "component"
                    }),
                    "bomquantity": fresult.getValue({
                        name: "bomquantity",
                        join: "component"
                    }),
                    "baseunits": fresult.getValue({
                        name: "baseunits",
                        join: "component"
                    }),
                };

                i++;
                z++;
            });

        })
        var htssum=[];
        hts.forEach(function (htsdet) {
            htssum.push(htsdet);
        })
        var retvar= {};
        retvar = {
            "sts": "Complated",
            "date": "",
            "records": z,
            "dataheader": htssum,
            "data": billofm
        }

        return retvar;
    }


    function get_hts_description(item) {

        const citem = new Item(item);

        htsvec=citem.itemdata.components.dataheader;
        deschts=htsvec.join();

        //get_items_components(components);


        var retvar= {};
        retvar = {
            "sts": "Complated",
            "date": deschts+" gg",
            "records": 0,
            "data": citem
        }

        return retvar;
    }

    function get_items_listLastPO() {
        var pageitems2 = [];

        var fsearch3 = s.create({
            type: "purchaseorder",
            filters:
                [
                    ["type","anyof","PurchOrd"],
                    "AND",
                    ["mainline","is","F"],
                    "AND",
                    ["itemtype","startswith","InvtPart"]
                ],

            columns:
                [
                    s.createColumn({
                        name: "item",
                        summary: "GROUP"
                    }),

                    s.createColumn({
                        name: "internalid",
                        join: "vendor",
                        summary: "GROUP"
                    }),
                    s.createColumn({
                        name: "entityid",
                        join: "vendor",
                        summary: "GROUP"
                    }),
                    s.createColumn({
                        name: "trandate",
                        summary: "MAX"
                    }),
                    s.createColumn({
                        name: "itemtype",
                        summary: "GROUP"
                    })
                ]

        })

        var pagedData = fsearch3.runPaged({
            "pageSize" : 1000
        });


        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});


            page.data.forEach(function (fresult3) {

                var item=fresult3.getText({name: "item",summary: "GROUP"});
                var internalid=fresult3.getValue( {name: "internalid", join: "vendor", summary: "GROUP"});
                var entityid=fresult3.getValue( {name: "entityid", join: "vendor", summary: "GROUP"});
                var trandate=fresult3.getValue( {name: "trandate",  summary: "MAX"});

                if (pageitems2[item]) {
                    if (pageitems2[item].datepo<trandate) {
                        pageitems2[item].datepo=trandate;
                        pageitems2[item].entityid=entityid;
                    }

                }
                else {
                    pageitems2[item] = {
                        "datepo": trandate,
                        "internalid": internalid,
                        "entityid": entityid
                    };
                }

            })
        })

        var retvar= {};
        retvar = {
            "sts": "Complated",
            "date": "",
            "records":  pageitems2.length,
            "data": pageitems2
        }
        return retvar;

    }

    function get_items_listInventory(cit) {

        var pageitems1 = [];
        var varrut4={};
        var items2=[];
        varrut4= get_items_listLastPO();
        log.debug("varrut4",varrut4);
        items2=varrut4.data;


        var fsearch2 = s.create({
            type: "item",
            filters:
                [
                    ["type","anyof","InvtPart"],
                    "AND",
                    ["isinactive","is","F"]
                ],

            columns:
                [
                    s.createColumn({
                        name: "itemid",
                        sort: s.Sort.ASC
                    }),
                    "salesdescription",
                    "averagecost",
                    "lastpurchaseprice"
                ]

        })

        var pagedData = fsearch2.runPaged({
            "pageSize" : 1000
        });

        var ci=0;
        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});


            page.data.forEach(function (fresult2) {
                ci++;

                var itemid=fresult2.getValue({name: "itemid"});

                var description=fresult2.getValue({name: "salesdescription"});
                var averagecost=fresult2.getValue({name: "averagecost"});
                var lastpurchaseprice=fresult2.getValue({name: "lastpurchaseprice"});
                var lastpurchasevendor = '';
                var lastpurchasedate = '';

                if (items2[itemid]) {
                    lastpurchasevendor = items2[itemid].entityid;
                    lastpurchasedate = items2[itemid].datepo;
                }
                else {
                    lastpurchasevendor = ' ';
                    lastpurchasedate = ' ';
                }

                if (cit==1) {
                    if (ci < 1000) {
                        pageitems1[itemid] = {
                            "itemid": itemid,
                            "description": description,
                            "averagecost": averagecost,
                            "lastpurchaseprice": lastpurchaseprice,
                            "lastpurchasevendor": lastpurchasevendor,
                            "lastpurchasedate": lastpurchasedate
                        };
                        log.debug("pageitems1[itemid]",pageitems1[itemid]);
                        log.debug("itemid",itemid);
                    }
                    else {return;}
                }
                if (cit==2) {
                    if (ci > 999) {
                        pageitems1[itemid] = {
                            "itemid": itemid,
                            "description": description,
                            "averagecost": averagecost,
                            "lastpurchaseprice": lastpurchaseprice,
                            "lastpurchasevendor": lastpurchasevendor,
                            "lastpurchasedate": lastpurchasedate
                        };
                        log.debug("pageitems1[itemid]",pageitems1[itemid]);
                        log.debug("itemid",itemid);
                    }

                }


                log.debug("ci",ci);

            })

        })


        var retvar= {};
        retvar = {
            "sts": "Complated",
            "date": "",
            "records": pageitems1.length,
            "data": pageitems1
        }
        return retvar;

    }


    function get_items_components(components) {

        var filterArray = ['name', 'is', components(0)];
        for (var i=1; i < components.length; i++ ) {

            filterArray.push('or');
            filterArray.push(['name', 'is', components(i)]);
        }


        var fsearch2 = s.create({
            type: "item",

            columns:
                [
                    "displayname",
                    "subtype",
                    "salesdescription",
                    "baseprice",
                    "taxschedule",
                    "unitstype",
                    "custitem_htscode"
                ]

        })

        fsearch2.filterExpression = filterArray;

        var pagedData = fsearch2.runPaged({
            "pageSize" : 1000
        });


        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});


            page.data.forEach(function (fresult2) {

                var itemid=fresult2.getValue({name: "itemid"});

                var description=fresult2.getValue({name: "salesdescription"});
                var averagecost=fresult2.getValue({name: "averagecost"});
                var lastpurchaseprice=fresult2.getValue({name: "lastpurchaseprice"});
                var lastpurchasevendor = '';
                var lastpurchasedate = '';

                if (items2[itemid]) {
                    lastpurchasevendor = items2[itemid].entityid;
                    lastpurchasedate = items2[itemid].datepo;
                }
                else {
                    lastpurchasevendor = ' ';
                    lastpurchasedate = ' ';
                }



                pageitems1[itemid] = {
                    "itemid": itemid,
                    "description": description,
                    "averagecost": averagecost,
                    "lastpurchaseprice": lastpurchaseprice,
                    "lastpurchasevendor": lastpurchasevendor,
                    "lastpurchasedate": lastpurchasedate
                };

            })

        })


        var retvar= {};
        retvar = {
            "sts": "Complated",
            "date": "",
            "records": pageitems1.length,
            "data": pageitems1
        }
        return retvar;

    }





    return {
        get_bom_list: get_bom_list,
        get_items_components: get_items_components,
        get_hts_description: get_hts_description,
        get_items_listLastPO: get_items_listLastPO,
        get_items_listInventory: get_items_listInventory };




});