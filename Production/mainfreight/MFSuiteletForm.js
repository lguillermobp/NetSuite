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
            name: 'mainfreightwo.csv',
            fileType: file.Type.CSV,
            contents: datatocsv
        });
        fileObj.folder = 2826806;
        var id = fileObj.save();
        fileObj = file.load({
            id: id
        });
    }
    function renderList(results) {
        var list = ui.createForm({title:"Work Order its Component"});

        list.clientScriptModulePath = "./MFtoexcel-cl.js";

       
        list.addButton({

            id : 'custpage_buttonid', //always prefix with 'custpage_'

            label : 'Export', //label of the button

            functionName: 'onButtonClick("'+encodeURI(datatocsv)+'")'
        });


        
        var sublist = list.addSublist({
            id: 'custpage_bom',
            type: ui.SublistType.LIST,
            label: 'Records'
        });



        sublist.addField({
            id: "reference",
            type: ui.FieldType.TEXT,
            label:'Reference'
        });

        sublist.addField({
            id: "second_reference",
            type: ui.FieldType.TEXT,
            label:'Second reference'
        });
         sublist.addField({
            id: "fg_product_code",
            type: ui.FieldType.TEXT,
            label:'FG Product Code'
        });
         sublist.addField({
            id: "fg_product_quantity",
            type: ui.FieldType.TEXT,
            label:'FG Product Quantity'
        });
        sublist.addField({
            id: "comp_product_code",
            type: ui.FieldType.TEXT,
            label:'Component Product Code'
        });
        sublist.addField({
            id: "comp_product_quantity",
            type: ui.FieldType.TEXT,
            label:'Component Product Quantity'
        });


        var counter = 0;

        results.forEach(function(result1) {


            sublist.setSublistValue({
                id: 'reference',
                line: counter,
                value: result1.reference
            });
            sublist.setSublistValue({
                id: 'second_reference',
                line: counter,
                value: result1.second_reference+" "
            });
            sublist.setSublistValue({
                id: 'fg_product_code',
                line: counter,
                value: result1.fg_product_item+ " "
            });
            sublist.setSublistValue({
                id: 'fg_product_quantity',
                line: counter,
                value: result1.fg_product_quantity + " "
            });
            sublist.setSublistValue({
                id: 'comp_product_code',
                line: counter,
                value: result1.comp_product_item + " "
            });
            sublist.setSublistValue({
                id: 'comp_product_quantity',
                line: counter,
                value: result1.comp_product_quantity + " "
            });

            counter++;
            return true;
        })


        return list;

    }


    function findCases() {

        let salesOrders = [];
            let searchSalesOrders = s.load({
                id: "customsearch_workorderitscomponents"
            });


        var pagedData = searchSalesOrders.runPaged({
            "pageSize" : 1000
        });

        var plantext='"Work Order Number","Purchaase Order Number","Finished Goods Code","Finished Goods Quantity","Component Product Code","Component Product Quantity"\n';

        datatocsv = plantext;

        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});

            var poreference;
            var fg_product_item;
            var fg_product_quantity;
            var comp_product_item;
            var comp_product_quantity;

            page.data.forEach(function (fresult) {

                mainline=fresult.getValue({name: "mainline"});

                if (mainline=="*")  
                { 
                    poreference=fresult.getValue({name: "otherrefnum",join: "createdFrom"});
                    fg_product_item=fresult.getText({name: "item"});
                    fg_product_quantity=fresult.getValue({name: "quantity"});
                } 
                    comp_product_item=fresult.getText({name: "item"});
                    comp_product_quantity=fresult.getValue({name: "quantity"});
                    

                pagedatas[i] = {
                    "reference":fresult.getValue({name: "tranid"}),
                    "second_reference":poreference,
                    "comp_product_quantity":comp_product_quantity,
                    "comp_product_item":comp_product_item,
                    "fg_product_quantity":fg_product_quantity,
                    "fg_product_item":fg_product_item
                };
                plantext = '"'+fresult.getValue({name: "tranid"})+'","'+poreference+'","'+fg_product_item+'","'
                    +fg_product_quantity+'","'+comp_product_item+'","'+comp_product_quantity+'"\n';

                datatocsv += plantext;
    

                i++;

            })
        });
        createAndSaveFile();
        return pagedatas;
    }

    function resultToObject(results) {


        return {
            reference: results.reference,
            second_reference: results.second_reference,
            comp_product_quantity: results.comp_product_quantity,
            comp_product_item: results.comp_product_item,
            fg_product_quantity: results.fg_product_quantity,
            fg_product_item: results.fg_product_item

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
    exports.onRequest = onRequest;
    return exports;

});