/**
 * Webstore sales order.
 *
 * @module N/commerce/webstore/order
 * @public
 * @NApiVersion 2.x
 *
 */
function order() {}
/**
 * Provides access to Sales Order record in session, if there isn't one it loads the Sales Order that was saved using save().
 *
 * @param {Object} options
 * @param {function(Record)} options.onSuccess Callback to be called after succesfully retrieving the Sales Order from session.
 * @param {function(Record)} options.onError Callback to be called in case of an error.
 */
order.prototype.createOrLoad = function(options) {};

/**
 * Updates a sales order object for current shopper.
 *
 * @param {Object} options
 * @param {Record} options.order Sales order record.
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.order is missing
 * @throws {SuiteScriptError} SSS_INVALID_RECORD_TYPE if options.order is not of N/record.Type.SALES_ORDER type.
 */
order.prototype.save = function(options) {};

order = new order();
var commerce = {};
/**
 * @type {commerce}
 */
N.prototype.commerce = commerce;
var webstore = {};
/**
 * @type {webstore}
 */
commerce.prototype.webstore = webstore;
/**
 * @type {order}
 */
webstore.prototype.order = order;