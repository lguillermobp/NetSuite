define(['N/ui/dialog'], function (dialog ) {
    /**
     * Client Script to add a Button to the Suitelet Cases by priority
     *
     * @export suitelet-results/cl
     *
     * @author Luis Barrios
     *
     *
     * @NApiVersion 2.0
     * @ModuleScope SameAccount
     * @NScriptType ClientScript
     *
     */
    var exports= {};

    function pageInit(context) {

        var url = new URL(document.location.href);
        var page_status = url.searchParams.get('page_status');
        log.debug('page_status', page_status);

    }
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    function onButtonClick(context) {

        var url = new URL(document.location.href);
        var page_status = url.searchParams.get('page_status');
        log.debug('page_status', page_status);


// XML content of the file
        var res = context.replaceAll('^', '"');
            res = res.replaceAll('&&', '\n');


//create file

        var filename = "BOM.csv";

        download(filename, res);


    }
    exports.pageInit = pageInit;
    exports.onButtonClick = onButtonClick;
    return exports;
});