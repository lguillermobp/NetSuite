"use strict";
define(['N/search',"N/log","N/record"], function (s,log, r) {
        /**
         * General Tools
         *
         *
         *
         * Version    Date                    Author           Remarks
         * 2.1        2021-08-119             Luis Barrios
         *
         */




    function formatsscc18(input) {
        var array = input.split('');

        var i = 1;
        var output = '(';

            for (var index in array){
                var valnum = array[index];

                if (i==3) {
                    output += ') ';
                }
                if (i==4) {
                    output += ' ';
                }
                if (i==12) {
                    output += ' ';
                }
                if (i==20) {
                    output += ' ';
                }

                output += valnum;
                i++;

            }

            /*
        array.forEach(number => {

            if (i==3) {
                output += ') ';
            }
            if (i==4) {
                output += ' ';
            }
            if (i==12) {
                output += ' ';
            }
            if (i==20) {
                output += ' ';
            }

            output += number;
            i++;
        });

             */

        return output;
    }


    function pallettag(pid,wo) {

        var fsearch = s.create({
            type: "assemblybuild",
            filters:
                [
                    ["type","anyof","Build"],
                    "AND",
                    ["createdfrom.type","anyof","WorkOrd"],
                    "AND",
                    ["createdfrom.internalid","anyof",wo],
                    "AND",
                    ["custbodypalletid","is",pid],
                    "AND",
                    ["mainline","is","T"]
                ],
            columns:
                [
                    "memo"
                ]
        });

        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });

        var i = 0;

        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});

            page.data.forEach(function (fresult) {

                i++;

            })
        });

        return i;
    }

    function delete_ML_WO(wo) {

        var fsearch = s.create({
            type: "customrecordmasterlabels",
            filters:
                [
                    ["custrecordml_workorder","equalto",wo]
                ],
            columns:
                [
                    "internalid",
                    s.createColumn({
                        name: "name",
                        sort: s.Sort.ASC
                    })
                ]
        });

        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });

        var i = 0;

        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});

            page.data.forEach(function (fresult) {

                var MasterLabelRecord = r.delete({
                    type: "customrecordmasterlabels",
                    id: fresult.getValue({name: "internalid"})
                });

                i++;

            })
        });

        return i;
    }


    function get_start_numberpallet(po) {

        var ponumberv= po.split('-');
        var ponumber=ponumberv[0];
        if (ponumberv.length>1) {ponumber+='-'}
        var fsearch = s.create({
            type: "salesorder",
            filters:
                [
                    ["type","anyof","SalesOrd"],
                    "AND",
                    ["formulatext: {otherrefnum}","startswith",ponumber],
                    "AND",
                    ["mainline","is","T"],
                    "AND",
                    ["custbodypalletletter","isnotempty",""]
                ],
            columns:
                [
                    s.createColumn({
                        name: "type",
                        summary: "GROUP",
                        label: "Type"
                    }),
                    s.createColumn({
                    name: "custbody_prefixidpallet",
                    summary: "MAX"
                    }),
                    s.createColumn({
                        name: "custbodypalletletter",
                        summary: "MAX"
                    }),
                    s.createColumn({
                        name: "custbodytotalpallets",
                        summary: "SUM"
                    })
                ]
        });

        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });

        var i = 0;
        var paramrec;
        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});

            page.data.forEach(function (fresult) {

                paramrec = fresult;

                i++;

            })
        });
        if (i!=0)
        {   var sts="Completed";
            var records=i;
        }
        else
        {
            var sts="Error";
            var records=i;
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


    function formatsscc181(input) {
        var array = input.split('');

        var total = 0;
        var i = 1;
        var output = '(';

        for (var index in array){
            var valnum = array[index];




            if (i==3) {
                output += ')';
            }


            output += valnum;
            i++;
        };

        return output;
    }



    function checkdigit(input) {
        var array = input.split('').reverse();
        var number;
        var total = 0;
        var i = 1;

        for (var index in array){
            var valnum = array[index];

            number = parseInt(valnum);
            if (i % 2 === 0) {
                total = total + number;
            }
            else
            {
                total = total + (number * 3);
            }
            i++;
        };

        return (Math.ceil(total / 10) * 10) - total;
    }


        return {
            pallettag: pallettag,
            get_start_numberpallet: get_start_numberpallet,
            delete_ML_WO: delete_ML_WO,
            formatsscc18: formatsscc18,
            formatsscc181: formatsscc181,
            checkdigit: checkdigit
           };




    });