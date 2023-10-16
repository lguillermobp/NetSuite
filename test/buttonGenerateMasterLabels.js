define(['N/currentRecord',"N/ui/message"], function (currentRecord,message) {
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

    function generateMasterLabels() {

        message.create({
            title: "You have clicked it " + customerId,
            message: "You are the best.",
            type: message.Type.CONFIRMATION,
            duration: 2000
        }).show();


    }
    exports.generateMasterLabels = generateMasterLabels;
    exports.pageInit = pageInit;
    return exports;


});