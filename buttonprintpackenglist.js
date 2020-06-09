define(["N/ui/message"], function (message) {
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
     * @NScriptType ClientScript
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

    function printpackinglist() {

        message.create({
            title: "Under Construction",
            message: "this option will be done soon",
            type: message.Type.CONFIRMATION,
            duration: 5000
        }).show();


    }
    exports.printpackinglist = printpackinglist;
    exports.pageInit = pageInit;
    return exports;


});