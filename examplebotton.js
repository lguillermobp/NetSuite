define(['N/ui/dialog'], function (dialog) {
    /**
     * Example 1; click the button
     * @export suitelet-results
     *
     * @author Luis Barrios
     *
     * @requires N/search
     * @requires N/ui/serverWidget
     * @requires N/log
     *
     * @NApiVersion 2.0
     * @ModuleScope SameAccount
     * @NScriptType Suitelet
     *
     */
    var exports= {};

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

    function pageInit(context) {


    }

    function printtagfg() {
        dialog.alert({
            title: "Hello",
            message: "You clicked the button"
        });


    }
    exports.printtagfg = printtagfg;
    exports.pageInit = pageInit;
    return exports;


});