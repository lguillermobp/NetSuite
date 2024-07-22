"use strict";
define(['N/search',"N/log","N/record"], function (s,log, r) {
        /**
         * General Tools
         *
         *
         *
         * Version    Date                    Author           Remarks
         * 2.01       2021-08-119             Luis Barrios
         *
         */


        function get_employee_value (value){


            var paramrec = r.load({
                type: "employee",
                id: value,
                isDynamic: false,
                defaultValues: null
            });


            if (paramrec)
            {   var sts="Complated";
                var records=1;
            }
            else
            {
                var sts="Error";
                var records=0;
            }
            var retvar= {};

            retvar = {
                "sts": sts,
                "date": "",
                "records": records,
                "data": paramrec
            }
            return retvar;
        }



    function findassembly(palletid) {
        var fsearch = s.create({
            type: "assemblybuild",
            filters:
                [
                    ["type","anyof","Build"],
                    "AND",
                    ["custbodypalletid","is",palletid],
                    "AND",
                    ["mainline","is","T"]
                ],
            columns:
                [
                    "internalid",
                    "trandate",
                    "tranid",
                    "custbodypalletid",
                    "statusref"
                ]
        });

        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });
        var wcompdata;
        var records=0;
        var sts=false;
        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});

            page.data.forEach(function (fresult1) {
                records++;
                sts=true;
                wcompdata= fresult1;
                log.debug("wcompdata",wcompdata);
            })
        })

        var retvar= {};

        retvar = {
            "sts": sts,
            "date": "",
            "records": records,
            "data": wcompdata
        }
        return retvar;
    }


    function delassembly(palletid) {
        var fsearch = s.create({
            type: "assemblybuild",
            filters:
                [
                    ["type","anyof","Build"],
                    "AND",
                    ["custbodypalletid","is",palletid],
                    "AND",
                    ["mainline","is","T"]
                ],
            columns:
                [
                    "internalid",
                    "trandate",
                    "tranid",
                    "custbodypalletid",
                    "statusref"
                ]
        });

        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });
        var wcompdata;
        var records=0;
        var sts=false;
        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});

            page.data.forEach(function (fresult1) {
                var idrec=fresult1.getValue({name: "internalid"});

                r.delete({
                    type: "assemblybuild",
                    id: idrec,
                });
                records++;
                sts=true;
            })
        })

        var retvar= {};

        retvar = {
            "sts": sts,
            "date": "",
            "records": records,
            "data": ""
        }
        return retvar;
    }



    function get_param_value (value){


        var paramrec = r.load({
            type: "customrecordparams",
            id: value,
            isDynamic: false,
            defaultValues: null
        });


        if (paramrec)
        {   var sts="Complated";
            var records=1;
        }
        else
        {
            var sts="Error";
            var records=0;
        }
        var retvar= {};

        retvar = {
            "sts": sts,
            "date": "",
            "records": records,
            "data": paramrec
        }
        return retvar;
    }

    function get_paramnew_value (value){



        var fsearch = s.create({
            type: "customrecordparams",
            filters:
                [
                    ["name","is",value]
                ],
            columns:
                [
                    "custrecordparams_code",
                    "created",
                    "custrecordparams_description",
                    "displaynametranslated",
                    "externalid",
                    "formulacurrency",
                    "formuladate",
                    "formuladatetime",
                    "formulanumeric",
                    "formulapercent",
                    "formulatext",
                    "isinactive",
                    "internalid",
                    "language",
                    "lastmodified",
                    "lastmodifiedby",
                    "custrecordparams_value"
                ]
        });


        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });
        var i=0;
        var paramrec;
        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});


            page.data.forEach(function (fresult1) {

                paramrec = fresult1;

            })
        });

        if (paramrec)
        {   var sts="Complated";
            var records=1;
        }
        else
        {
            var sts="Error";
            var records=0;
        }
        var retvar= {};

        retvar = {
            "sts": sts,
            "date": "",
            "records": records,
            "data": paramrec
        }
        return retvar;
    }




    function get_message_value (value, userid){



        var fsearch = s.create({
            type: "customrecord_messages",
            filters:
                [
                    ["name","is",value]
                ],
            columns:
                [
                    "name",
                    "custrecord_msgdes",
                    "custrecord_msg_desl",
                    "custrecord_msgrcv",
                    "custrecord_msg_severity",
                    "internalid"
                ]
        });


        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });
        var i=0;
        var paramrec;
        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});


            page.data.forEach(function (fresult1) {

                paramrec = fresult1;

            })
        });

        if (paramrec)
        {   var sts="Complated";
            var records=1;

            var msgqty=set_message_value (paramrec.getValue({name: "internalid"}), userid);
            //var msgqty=0;

        }
        else
        {
            var sts="Error";
            var records=0;
        }
        var retvar= {};

        retvar = {
            "sts": sts,
            "date": "",
            "records": msgqty,
            "data": paramrec
        }
        return retvar;
    }


    function set_message_value (value, userid){

        log.debug("value",value);
        log.debug("userid",userid);

        var fsearch = s.create({
            type: "customrecord_message_stat",
            filters:
                [
                    ["custrecord_msgid","anyof",value],
                    "AND",
                    ["custrecord_msguser","anyof",userid]
                ],
            columns:
                [
                    "internalid",
                    "custrecord_msgid",
                    "custrecord_msgincidence"
                ]
        });


        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });
        var i=0;
        var paramrec;
        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});


            page.data.forEach(function (fresult1) {

                paramrec = fresult1;

            })
        });

        if (paramrec)
        {   var sts="Complated";
            var records=1;



            try {
                var messagedet = r.load({
                    type: "customrecord_message_stat",
                    id: paramrec.getValue({name: "internalid"}),
                    isDynamic: false,
                });
                log.debug("messagedet",messagedet);
            }
            catch(err) {
                return 0;
            }
            var qty=messagedet.getValue({
                fieldId: "custrecord_msgincidence",

            });
            messagedet.setValue({
                fieldId: "custrecord_msgincidence",
                value: qty+1
            });
            messagedet.save({
                enableSourcing: true,
                ignoreMandatoryFields: false
            });

        }
        else
        {
            var sts="Error";
            var records=0;


            try
            {
                var messagedet = r.create({
                    type: "customrecord_message_stat",
                    isDynamic: false,
                });

            }
            catch(err) {
                return 0;
            }
            var qty=0


            messagedet.setValue({
                fieldId: "custrecord_msgid",
                value: value
            });
            messagedet.setValue({
                fieldId: "custrecord_msguser",
                value: userid
            });
            messagedet.setValue({
                fieldId: "custrecord_msgincidence",
                value: qty+1
            });
            messagedet.save({
                enableSourcing: true,
                ignoreMandatoryFields: false
            });


        }

        return qty;
    }






    function get_item_value (value){

        try {
            var paramrec = r.load({
            type: "inventoryitem",
            id: value,
            isDynamic: false,
            defaultValues: null
        });
            log.debug("paramrec",paramrec);
        }
        catch(err) {
            try {
            var paramrec = r.load({
                type: "noninventoryitem",
                id: value,
                isDynamic: false,
                defaultValues: null
            });
                log.debug("paramrec",paramrec);
            }
            catch(err) {
                try {
                    var paramrec = r.load({
                        type: "lotnumberedassemblyitem",
                        id: value,
                        isDynamic: false,
                        defaultValues: null
                    });
                    log.debug("paramrec",paramrec);
                }
                catch(err) {
                    try {
                        var paramrec = r.load({
                            type: "assemblyitem",
                            id: value,
                            isDynamic: false,
                            defaultValues: null
                        });
                        log.debug("paramrec",paramrec);
                    }
                    catch(err) { try {
                        var paramrec = r.load({
                            type: "otherchargeitem",
                            id: value,
                            isDynamic: false,
                            defaultValues: null
                        });
                        log.debug("paramrec",paramrec);
                    }
                    catch(err) {
                        log.debug("err",err);
                    }
                    }



                }
            }
        }



        if (paramrec)
        {   var sts="Completed";
            var records=1;
        }
        else
        {
            var sts="Error";
            var records=0;
        }
        var retvar= {};

        retvar = {
            "sts": sts,
            "date": "",
            "records": records,
            "data": paramrec
        }
        return retvar;
    }


    function get_item_value_new (value){

        var paramitem = get_Item_basic(value);
        var paramdata = paramitem.data;
        var typerecord=paramdata.recordtype;

        try {
            var paramrec = r.load({
            type: typerecord,
            id: value,
            isDynamic: false,
            defaultValues: null
        });
            log.debug("paramrec",paramrec);
        }
        catch(err) {
            try {
            var paramrec = r.load({
                type: "noninventoryitem",
                id: value,
                isDynamic: false,
                defaultValues: null
            });
                log.debug("paramrec",paramrec);
            }
            catch(err) {
                try {
                    var paramrec = r.load({
                        type: "lotnumberedassemblyitem",
                        id: value,
                        isDynamic: false,
                        defaultValues: null
                    });
                    log.debug("paramrec",paramrec);
                }
                catch(err) {
                    try {
                        var paramrec = r.load({
                            type: "assemblyitem",
                            id: value,
                            isDynamic: false,
                            defaultValues: null
                        });
                        log.debug("paramrec",paramrec);
                    }
                    catch(err) { try {
                        var paramrec = r.load({
                            type: "otherchargeitem",
                            id: value,
                            isDynamic: false,
                            defaultValues: null
                        });
                        log.debug("paramrec",paramrec);
                    }
                    catch(err) {
                        log.debug("err",err);
                    }
                    }



                }
            }
        }



        if (paramrec)
        {   var sts="Completed";
            var records=1;
        }
        else
        {
            var sts="Error";
            var records=0;
        }
        var retvar= {};

        retvar = {
            "sts": sts,
            "date": "",
            "records": records,
            "data": paramrec
        }
        return retvar;
    }


    function get_PO_value (value){


        var paramrec = r.load({
            type: "purchaseorder",
            id: value,
            isDynamic: false,
            defaultValues: null
        });

        if (paramrec)
        {   var sts="Complated";
            var records=1;
        }
        else
        {
            var sts="Error";
            var records=0;
        }
        var retvar= {};

        retvar = {
            "sts": sts,
            "date": "",
            "records": records,
            "data": paramrec
        }
        return retvar;
    }

    function get_TO_value (value){


        var paramrec = r.load({
            type: "transferorder",
            id: value,
            isDynamic: false,
            defaultValues: null
        });

        if (paramrec)
        {   var sts="Complated";
            var records=1;
        }
        else
        {
            var sts="Error";
            var records=0;
        }
        var retvar= {};

        retvar = {
            "sts": sts,
            "date": "",
            "records": records,
            "data": paramrec
        }
        return retvar;
    }


    function get_WO_value (value){


        var paramrec = r.load({
            type: "workorder",
            id: value,
            isDynamic: false,
            defaultValues: null
        });

        if (paramrec)
        {   var sts="Complated";
            var records=1;
        }
        else
        {
            var sts="Error";
            var records=0;
        }
        var retvar= {};

        retvar = {
            "sts": sts,
            "date": "",
            "records": records,
            "data": paramrec
        }
        return retvar;
    }


    function get_SO_value (value){

    var backorder;
        var paramrec = r.load({
            type: "salesorder",
            id: value,
            isDynamic: false,
            defaultValues: null
        });

        var itemIndex = 0;
        var itemCount = paramrec.getLineCount({
            "sublistId": "item"
        });
        var quantitybo = 0;

        var backorder=false;

        while (itemIndex < itemCount)

        {


            if (paramrec.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantitybackordered',
                line: itemIndex
            })>0)
            {backorder=true;}

            itemIndex++;
        }


        if (paramrec)
        {   var sts="Complated";
            var records=1;
        }
        else
        {
            var sts="Error";
            var records=0;
        }
        var retvar= {};

        retvar = {
            "sts": sts,
            "date": "",
            "records": records,
            "backorder": backorder,
            "data": paramrec
        }
        return retvar;
    }

        function get_customer_value (value){


            var paramrec = r.load({
                type: "customer",
                id: value,
                isDynamic: false,
                defaultValues: null
            });


            if (paramrec)
            {   var sts="Complated";
                var records=1;
            }
            else
            {
                var sts="Error";
                var records=0;
            }
            var retvar= {};

            retvar = {
                "sts": sts,
                "date": "",
                "records": records,
                "data": paramrec
            }
            return retvar;
        }


    function get_location_value (value){


        var paramrec = r.load({
            type: "location",
            id: value,
            isDynamic: false,
            defaultValues: null
        });


        if (paramrec)
        {   var sts="Complated";
            var records=1;
        }
        else
        {
            var sts="Error";
            var records=0;
        }
        var retvar= {};

        retvar = {
            "sts": sts,
            "date": "",
            "records": records,
            "data": paramrec
        }
        return retvar;
    }



    function get_department_value (value){


        var paramrec = r.load({
            type: "department",
            id: value,
            isDynamic: false,
            defaultValues: null
        });


        if (paramrec)
        {   var sts="Complated";
            var records=1;
        }
        else
        {
            var sts="Error";
            var records=0;
        }
        var retvar= {};

        retvar = {
            "sts": sts,
            "date": "",
            "records": records,
            "data": paramrec
        }
        return retvar;
    }

        function Item (item){



                var filterArray = [];
                filterArray.push(['name', 'is', item]);

                var fsearch = s.load({
                    id: "customsearchssforscript"
                });
                fsearch.filterExpression = filterArray;

                var pagedData = fsearch.runPaged({
                    "pageSize" : 1000
                });
                var i=0;
                var witemdata;
                pagedData.pageRanges.forEach(function (pageRange) {

                    var page = pagedData.fetch({index: pageRange.index});


                    page.data.forEach(function (fresult1) {

                        const bomdata= Bomassembly(item);

                        var components;
                        var bomid;
                        if (bomdata.records>0) {
                            if (bomdata.data.bomid.length != 0) {
                                bomid = bomdata.data.bomid;
                                components = get_bom_list(bomid);
                            } else {
                                components = "";
                                bomid = 0;
                            }
                        }
                        else {
                            components = "";
                            bomid = 0;
                        }
                        i++;
                        witemdata= {    "basic": fresult1,
                                        "bomid": bomid,
                                        "components": components} ;

                    })
                })
            var retvar= {};

            retvar = {
                "sts": "Complated",
                "date": "",
                "records": i,
                "data": witemdata
            }
            return retvar;

        }


        function get_Item_basic (item){


            var caseData = s.lookupFields({
                type: "item",
                id: item,
                columns: ["type",
                    "recordtype",
                    "salesdescription",
                    "averagecost",
                    "bomquantity",
                    "lastpurchaseprice",
                    "binnumber",
                    "weight"]
            });

        var retvar= {};

        retvar = {
            "sts": "Complated",
            "date": "",
            "records": 1,
            "data": caseData
        }
        return retvar;

        }

        function Component (component){



                var filterArray = [];
                filterArray.push(['name', 'is', component]);

                var fsearch1 = s.load({
                    id: "customsearchssforscript"
                });
                fsearch1.filterExpression = filterArray;

                var pagedData = fsearch1.runPaged({
                    "pageSize" : 1000
                });

                var wcompdata;
                pagedData.pageRanges.forEach(function (pageRange) {

                    var page = pagedData.fetch({index: pageRange.index});


                    page.data.forEach(function (fresult2) {

                        wcompdata= fresult2;

                    })
                })

            var retvar= {};

            retvar = {
                "sts": "Complated",
                "date": "",
                "records": 0,
                "data": wcompdata
            }
            return retvar;


        }


        function Bomassembly (item) {



                var filterArray = [];
                filterArray.push(['name', 'is', item]);

                var fsearch = s.load({
                    id: "customsearchassemblybom"
                });
                fsearch.filterExpression = filterArray;

                var pagedData = fsearch.runPaged({
                    "pageSize" : 1000
                });
                var record=0;
                var witemdata;
                pagedData.pageRanges.forEach(function (pageRange) {

                    var page = pagedData.fetch({index: pageRange.index});


                    page.data.forEach(function (fresult1) {
                        var bomid = fresult1.getValue({name: "billofmaterialsid",
                            join: "assemblyItemBillOfMaterials"});
                        record++;
                        witemdata= {    "basic": fresult1,
                                        "bomid": bomid} ;

                    })
                })

            var retvar= {};

            retvar = {
                "sts": "Complated",
                "date": "",
                "records": record,
                "data": witemdata
            }
            return retvar;


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
                        "internalid",
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

            var hts=[];
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
                        var ccomp = Component(compid);
                        htscode = ccomp.data.getText({name: "custitem_htscode"});
                        if (hts.indexOf(htscode)==-1) {  hts.push(htscode);}
                    }
                    else {
                        htscode = "";
                    }

                    billofm[billid] [i] = {
                        "htscode": htscode,
                        "description": fresult.getValue({name: "description",
                            join: "component" }),
                        "componentinternalid": fresult.getValue({name: "item",
                            join: "component" }),
                        "name": fresult.getValue({name: "name"}),
                        "internalid": fresult.getValue({name: "internalid"}),
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
            log.debug("billofm",billofm.length);
            var htssum=[];
            hts.forEach(function (htsdet) {
                if (htsdet.length!=0) {htssum.push(htsdet);}
            })
            var retvar= {};
            retvar = {
                "sts": "Complated",
                "date": "",
                "records": z,
                "datahts": htssum,
                "data": billofm
            };

            return retvar;
        }


        function get_kits_list() {
            var z = 0;
            var billofmk= [];
            var fsearch =   s.create({
                type: "kititem",
                filters:
                    [
                        ["type","anyof","Kit"]
                    ],
                columns:
                    [
                        s.createColumn({
                            name: "itemid",
                            sort: s.Sort.ASC
                        }),
                        s.createColumn({
                            name: "formulatext",
                            formula: "CONCAT({name}, ' BOM Kit')"
                        }),
                        "salesdescription",
                        "memberitem",
                        s.createColumn({
                            name: "salesdescription",
                            join: "memberItem"
                        }),
                        s.createColumn({
                            name: "internalid",
                            join: "memberItem"
                        }),
                        s.createColumn({
                            name: "averagecost",
                            join: "memberItem"
                        }),
                        s.createColumn({
                            name: "lastpurchaseprice",
                            join: "memberItem"
                        }),
                        "averagecost",
                        "lastpurchaseprice",
                        "internalid",
                        "memberquantity",
                        "memberbasequantity",
                        "memberunit",
                        "type"
                    ]
            });



            var pagedData = fsearch.runPaged({
                "pageSize": 1000
            });


            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});
                var wbillid = ' ';
                var i = 0;

                page.data.forEach(function (fresult) {

                    var billid = fresult.getValue({name: "formulatext"});
                    var internalid = fresult.getValue({name: "internalid"});
                    var memberid = fresult.getValue({name: "internalid", join: "memberItem"});
                    var compid = fresult.getText({name: "memberitem"});
                    var compds = fresult.getValue({name: "salesdescription", join: "memberItem"});
                    var kitds = fresult.getValue({name: "salesdescription"});
                    var averagecostcomp = fresult.getValue({name: "averagecost", join: "memberItem"});
                    var averagecost = fresult.getValue({name: "averagecost"});
                    var lastpurchasepricecomp = fresult.getValue({name: "lastpurchaseprice", join: "memberItem"});
                    var lastpurchaseprice = fresult.getValue({name: "lastpurchaseprice"});


                    if (billid != wbillid) {

                    }

                    billofmk[z] = {
                        "htscode": "",
                        "billofmaterials": billid,
                        "internalid": internalid,
                        "memberid": memberid,
                        "descriptionk": kitds,
                        "description": compds,
                        "averagecost": averagecost,
                        "averagecostcomp": averagecostcomp,
                        "lastpurchasepricecomp": lastpurchasepricecomp,
                        "lastpurchaseprice": lastpurchaseprice,
                        "itemid": fresult.getValue({
                            name: "itemid"
                        }),
                        "name": "Revision Kits",
                        "item": compid,
                        "bomquantity": fresult.getValue({
                            name: "memberquantity"
                        }),
                        "baseunits": fresult.getText({
                            name: "memberunit"
                        })
                    };


                    z++;
                });

            })
            log.debug("billofmk",billofmk.length);
            var retvar= {};
            retvar = {
                "sts": "Complated",
                "date": "",
                "records": z,
                "data": billofmk
            };

            return retvar;
        }

        function getScheduleParams(task, createdfrom) {
            var z = 0;
            var billofmk= [];
            var fsearch =   s.create({
                type: "customrecord_so_scheduletasks",
                filters:
                    [
                        ["custrecord_salecontract.mainline","is","T"], 
                        "AND", 
                        ["custrecord_salecontract","anyof",createdfrom], 
                        "AND", 
                        ["custrecord_so_sc_task.name","haskeywords",task]
                    ],
                    
                columns:
                    [
                        s.createColumn({
                            name: "custrecord_sc_productionline",
                            join: "CUSTRECORD_SO_SC_TASK"
                         }),
                         s.createColumn({
                            name: "custrecord_sc_tasksgroup",
                            join: "CUSTRECORD_SO_SC_TASK"
                         }),
                         s.createColumn({
                            name: "custrecord_sc_task",
                            join: "CUSTRECORD_SO_SC_TASK"
                         }),
                         s.createColumn({
                            name: "custrecord_sc_tasksseq",
                            join: "CUSTRECORD_SO_SC_TASK"
                         }),
                         "internalid",
                         "custrecord_so_sc_note",
                         "custrecord_so_sc_startdate",
                         "custrecord_so_sc_enddate",
                         s.createColumn({
                            name: "custrecord_sc_days",
                            join: "CUSTRECORD_SO_SC_TASK"
                         }),
                         "custrecord_so_sc_status",
                         "custrecord_sc_soduration",
                         s.createColumn({
                            name: "entity",
                            join: "CUSTRECORD_SALECONTRACT"
                         }),
                         s.createColumn({
                            name: "internalid",
                            join: "CUSTRECORD_SALECONTRACT"
                         })
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


                    paramrec = fresult;
                });

            })
           
            var retvar= {};
            retvar = {
                "sts": "Complated",
                "date": "",
                "records": z,
                "data": paramrec
            };

            return retvar;
        }


    function get_item_informations(item) {


        const citem =Item(item);
        var deschts="";
        var msg="";

        if  (citem.records>0)
        {
            var htscode = citem.data.basic.getText({name: "custitem_htscode"});
            msg="Complated";

            if (htscode.length==0)
            {
                var htsvec=citem.data.components.datahts;
                if (htsvec)
                {
                    deschts=htsvec.join();
                }
                else
                {
                    deschts=" ";
                }

            }
            else
            {
                deschts=htscode;
            }

        }
        else
        {
            msg="NoFound";
        }





        var retvar= {};
        retvar = {
            "sts": msg,
            "date": 0,
            "records": citem.records,
            "detahts": deschts,
            "data": citem
        };

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
                    ["type","anyof","InvtPart","Assembly","Service"],
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
                    "lastpurchaseprice",
                    s.createColumn({
                        name: "formulanumeric",
                        formula: "{cost}"
                    })
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
                var cost=fresult2.getValue({name: "formulanumeric"});
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
                            "cost": cost,
                            "lastpurchaseprice": lastpurchaseprice,
                            "lastpurchasevendor": lastpurchasevendor,
                            "lastpurchasedate": lastpurchasedate
                        };

                    }
                    else {return;}
                }
                if (cit==2) {
                    if (ci > 999) {
                        pageitems1[itemid] = {
                            "itemid": itemid,
                            "description": description,
                            "averagecost": averagecost,
                            "cost": cost,
                            "lastpurchaseprice": lastpurchaseprice,
                            "lastpurchasevendor": lastpurchasevendor,
                            "lastpurchasedate": lastpurchasedate
                        };

                    }

                }


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

        function get_items_components(components) {

            var filterArray = ['name', 'is', components(0)];
            for (var i=1; i < components.length; i++ ) {

                filterArray.push('OR');
                filterArray.push(['name', 'is', components(i)]);
            }


            var fsearch2 = s.create({
                type: "item",

                columns:
                    [   "type",
                        "itemid",
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
            };
            return retvar;

        }





        return {
            findassembly: findassembly,
            delassembly: delassembly,
            getScheduleParams: getScheduleParams,
            get_bom_list: get_bom_list,
            get_kits_list: get_kits_list,
            get_item_value: get_item_value,
            get_item_value_new: get_item_value_new,
            get_Item_basic: get_Item_basic,
            get_employee_value: get_employee_value,
            get_param_value: get_param_value,
            get_paramnew_value: get_paramnew_value,
            get_message_value: get_message_value,
            set_message_value: set_message_value,
            get_customer_value: get_customer_value,
            get_location_value: get_location_value,
            get_department_value: get_department_value,
            get_PO_value: get_PO_value,
            get_TO_value: get_TO_value,
            get_WO_value: get_WO_value,
            get_SO_value: get_SO_value,
            get_items_listLastPO: get_items_listLastPO,
            get_items_components: get_items_components,
            get_item_informations: get_item_informations,
            get_items_listInventory: get_items_listInventory };




    });