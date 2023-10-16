define(['N/search','N/ui/serverWidget','N/log', 'N/file'], function (s, ui, log, file) {
    /**
     * Example 1; calc
     * @export suitelet-results
     *
     * @author Luis Barrios
     *
     * @requires N/search
     * @requires N/ui/serverWidget
     * @requires N/log
     *
     * @NApiVersion 2.1
     * @ModuleScope SameAccount
     * @NScriptType Suitelet
     *
     */
    var exports= {};
    var i = 0;
    var pagedatas = [];
    var pageitems = [];
    var datatocsv;
    /**
     * <code>onRequest</code> event handler
     *
     * @governance @
     *
     * @param context
     *        {Object}
     * @param context.request
     *        {ServerRequest} The incoming request object
     * @param context.response
     *        {ServerResponse} The outgoing response object
     *
     * @return {void}
     *
     * @static
     * @function onRequest
     */
    function onRequest(context) {


        context.response.writePage({
            pageObject: renderList(translate(findCases()))
        });
    }
    function createAndSaveFile() {
        log.debug("datatocsv",datatocsv);
        var fileObj = file.create({
            name: 'BOM.csv',
            fileType: file.Type.CSV,
            contents: datatocsv
        });
        fileObj.folder = 126377;
        var id = fileObj.save();
        fileObj = file.load({
            id: id
        });
    }
    function renderList(results) {
        var list = ui.createForm({title:"Advanced Bom Listings"});

        list.clientScriptModulePath = "./bomtoexcel-cl.js";

        /** list.clientScriptModulePath = "./bomsuitelet-result-cl.js";


         list.addButton({
            id: "Custpage btn Backecase",
            label: "Go Back Records",
            functionName: "goToBackCase"
        });

         list.addButton({
            id: "Custpage btn nextcase",
            label: "Go to Next Records",
            functionName: "goToNextCase"
        });
         */
        list.addButton({

            id : 'custpage_buttonid', //always prefix with 'custpage_'

            label : 'Export', //label of the button

            functionName: "onButtonClick"
        });


        list.addField({
            id: 'custpage_test_field',
            label: 'Enter Hello...',
            type: ui.FieldType.TEXT,
        });

        var sublist = list.addSublist({
            id: 'custpage_bom',
            type: ui.SublistType.LIST,
            label: 'BOM'
        });




        sublist.addField({
            id: "itemid",
            type: ui.FieldType.TEXT,
            label:'Item Id'
        });

        sublist.addField({
            id: "billofmaterials",
            type: ui.FieldType.TEXT,
            label:'billofmaterials'
        }); sublist.addField({
            id: "revisionname",
            type: ui.FieldType.TEXT,
            label:'revisionname'
        }); sublist.addField({
            id: "component",
            type: ui.FieldType.TEXT,
            label:'component'
        }); sublist.addField({
            id: "bomquantity",
            type: ui.FieldType.TEXT,
            label:'bomquantity'
        }); sublist.addField({
            id: "baseunits",
            type: ui.FieldType.TEXT,
            label:'baseunits'
        });


        var counter = 0;

        results.forEach(function(result1) {


            sublist.setSublistValue({
                id: 'itemid',
                line: counter,
                value: result1.itemid
            });
            sublist.setSublistValue({
                id: 'billofmaterials',
                line: counter,
                value: result1.billofmaterials
            });
            sublist.setSublistValue({
                id: 'revisionname',
                line: counter,
                value: result1.revisionname
            });
            sublist.setSublistValue({
                id: 'component',
                line: counter,
                value: result1.component
            });
            sublist.setSublistValue({
                id: 'bomquantity',
                line: counter,
                value: result1.bomquantity
            });
            sublist.setSublistValue({
                id: 'baseunits',
                line: counter,
                value: result1.baseunits+" "
            });

            counter++;
            return true;
        })


        return list;

    }


    function findCases() {

        billofm=findCases1()

        var fsearch= s.create({
            type: "bomrevision",
            filters:
                [

                ],
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
                        name: "baseunits",
                        join: "component"
                    })
                ]

        });

        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });

        var plantext='"itemid","billofmaterialsid","billofmaterials","itemid","name","bomquantity","baseunits"\n';

        datatocsv = plantext;

        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});



            page.data.forEach(function (fresult) {

                billid=fresult.getValue({name: "billofmaterials"});

                if (billofm[billid]) {


                    pagedatas[i] = {
                        "billofmaterialsid":billofm[billid].billofmaterialsid,
                        "billofmaterials": billofm[billid].billofmaterials,
                        "itemid": billofm[billid].assembly,
                        "name":fresult.getValue({name: "name"}),
                        "item": fresult.getText({name: "item",
                            join: "component"}),
                        "bomquantity": fresult.getValue({name: "bomquantity",
                            join: "component"}),
                        "baseunits": fresult.getValue({name: "baseunits",
                            join: "component"}),
                    };
                    plantext = '"'+billofm[billid].assembly+'","'+billofm[billid].billofmaterialsid+'","'+billofm[billid].billofmaterials+'","'
                        +billofm[billid].assembly+'","'+fresult.getValue({name: "name"})+'","'
                        +fresult.getValue({name: "bomquantity",join: "component"})+'","'+fresult.getValue({name: "baseunits",join: "component"})+'"\n';

                    datatocsv += plantext;
                    };

                    i++;

            })
        });
        createAndSaveFile();
        return pagedatas;
    }

    function resultToObject(results) {


        return {
            itemid: results.itemid,
            billofmaterials: results.billofmaterials,
            revisionname: results.name,
            component: results.item,
            bomquantity: results.bomquantity,
            baseunits: results.baseunits

        };

    }



    function translate(results) {
        return results.map(resultToObject);
    }

    function getBaseUrl() {
        return url.resolveRecord({
            recordType: s.Type.SUPPORT_CASE
        });
    }
    function findCases1() {

        var fsearch = s.create({
            type: "item",
            filters:
                [
                    ["type", "anyof", "Assembly"],
                    "AND",
                    ["assemblyitembillofmaterials.default", "is", "T"]
                ],

            columns:
                [
                    s.createColumn({
                        name: "assembly",
                        join: "assemblyItemBillOfMaterials"
                    }),
                    s.createColumn({
                        name: "billofmaterialsid",
                        join: "assemblyItemBillOfMaterials"
                    }),
                    s.createColumn({
                        name: "billofmaterials",
                        join: "assemblyItemBillOfMaterials"
                    })
                ]

        })

        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });


        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});


            page.data.forEach(function (fresult1) {

                billofmaterialsid=fresult1.getValue({name: "billofmaterialsid",
                    join: "assemblyItemBillOfMaterials"});
                billofmaterials=fresult1.getText({name: "billofmaterials",
                    join: "assemblyItemBillOfMaterials"});
                assembly=fresult1.getText({name: "assembly",
                    join: "assemblyItemBillOfMaterials"});


                pageitems[billofmaterialsid] = {
                    "billofmaterialsid": billofmaterialsid,
                    "billofmaterials": billofmaterials,
                    "assembly": assembly
                };


            })
        })

        return pageitems;

    }
    exports.onRequest = onRequest;
    return exports;

});