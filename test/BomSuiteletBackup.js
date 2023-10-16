define(['N/search','N/ui/serverWidget','N/log','N/redirect', 'N/url', 'N/file'], function (s, ui, log, redirect, url, file) {
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
    //DO NOT REMOVE
    var jsondata;
    //DO NOT REMOVE
    var datatocsv;
    var datatocsv1;

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

        if (context.request.method === 'GET') {
            // Our Suitelet design code is in here
        } else if (context.request.method === 'POST') {
            log.debug("Suitelet is posting.")
            var params = { page_status: 'confirmed' };

            var suiteletURL = url.resolveScript({
                scriptId: 'customscript_bom_example',
                deploymentId: 'customdeploy_bom_example',
                params: params
            });
            redirect.redirect({ url: suiteletURL });
        }

    }

    function createAndSaveFile() {


        var fileObj = file.create({
            name: 'BOM.csv',
            fileType: file.Type.CSV,
            contents: datatocsv1
        });
        fileObj.folder = 126377;
        var id = fileObj.save();
        fileObj = file.load({
            id: id
        });
    }
    //DO NOT REMOVE THIS FUNCTION
    function createAndSaveJSON() {
        var fileObj = file.create({
            name: 'BOM-JSON.txt',
            fileType: file.Type.PLAINTEXT,
            contents: jsondata
        });
        fileObj.folder = 126377;
        var id = fileObj.save();
        fileObj = file.load({
            id: id
        });
    }
    function renderList(results) {
        var list = ui.createList({title:"Advanced Bom Listings"});
        log.debug("datatocsv",datatocsv);


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

            label : 'Export CSV', //label of the button

            functionName: 'onButtonClick("'+datatocsv+'")'
        });

        list.addColumn({
            id: "itemid",
            type: ui.FieldType.TEXT,
            label:'Item Id'
        });
        list.addColumn({
            id: "billofmaterials",
            type: ui.FieldType.TEXT,
            label:'billofmaterials'
        }); list.addColumn({
            id: "revisionname",
            type: ui.FieldType.TEXT,
            label:'revisionname'
        }); list.addColumn({
            id: "component",
            type: ui.FieldType.TEXT,
            label:'component'
        }); list.addColumn({
            id: "bomquantity",
            type: ui.FieldType.TEXT,
            label:'bomquantity'
        }); list.addColumn({
            id: "baseunits",
            type: ui.FieldType.TEXT,
            label:'baseunits'
        });


        list.addRows({rows:results});
        return list;

    }
    function findCases() {

        billofm=findCases1()

        var fsearch= s.create({
            type: "bomrevision",
            filters:
                [
                    ["effectiveenddate","isempty",""]
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

        var plantext='^Assembly^,^Bill of Materials id^,^Bill of' +
            ' Materials^,^Components^,^Revision^,^Quantity^,^Units^&&';

        var plantext1='"Assembly","Bill of Materials id","Bill of' +
            ' Materials","Components","Revision","Quantity","Units"\n';

        datatocsv = plantext;
        datatocsv1 = plantext1;

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

                    jsondata += pagedatas[i];
                    plantext = '^'+billofm[billid].assembly+'^,^'+billofm[billid].billofmaterialsid+'^,^'+billofm[billid].billofmaterials+'^,^'
                        +fresult.getText({name: "item",
                            join: "component"})+'^,^'+fresult.getValue({name: "name"})+'^,^'
                        +fresult.getValue({name: "bomquantity",join: "component"})+'^,^'+fresult.getValue({name: "baseunits",join: "component"})+'^&&';

                    datatocsv += plantext;

                    plantext1 = '"'+billofm[billid].assembly+'","'+billofm[billid].billofmaterialsid+'","'+billofm[billid].billofmaterials+'","'
                    fresult.getText({name: "item",
                        join: "component"})+'","'+fresult.getValue({name: "name"})+'","'
                    +fresult.getValue({name: "bomquantity",join: "component"})+'","'+fresult.getValue({name: "baseunits",join: "component"})+'"\n';

                    datatocsv1 += plantext1;
                    i++;
                }
            })
        })
        jsondata = JSON.stringify(pagedatas);
        createAndSaveJSON();
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