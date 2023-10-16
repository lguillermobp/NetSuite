/**
 * SuiteScript module
 *
 * @module N/https/clientCertificate
 * @NApiVersion 2.x
 *
 */
function clientCertificate() {}
/**
 * Sends ssl secured post to remote server
 * @governance 10 units
 * @param {Object} options
 * @param {String} options.url address of remote server
 * @param {String} options.certId id of client certificate
 * @param {String} options.body data to be sent to remote server
 * @param {Object} options.headers headers associated with the request
 *
 * @returns {ClientResponse} response from remote server
 */
function doPost() {
}

/**
 * Sends ssl secured get to remote server
 * @governance 10 units
 * @param {Object} options
 * @param {String} options.url address of remote server
 * @param {String} options.certId id of client certificate
 * @param {Object} options.headers headers associated with the request
 *
 * @returns {ClientResponse} response from remote server
 */
function doGet() {
}

/**
 * Sends ssl secured put to remote server
 * @governance 10 units
 * @param {Object} options
 * @param {String} options.url address of remote server
 * @param {String} options.certId id of client certificate
 * @param {String} options.body data to be sent to remote server
 * @param {Object} options.headers headers associated with the request
 *
 * @returns {ClientResponse} response from remote server
 */
function doPut() {
}

/**
 * Sends ssl secured delete to remote server
 * @governance 10 units
 * @param {Object} options
 * @param {String} options.url address of remote server
 * @param {String} options.certId id of client certificate
 * @param {Object} options.headers headers associated with the request
 *
 * @returns {ClientResponse} response from remote server
 */
function doDelete() {
}

/**
 * Sends ssl secured request to remote server
 * @governance 10 units
 * @param {Object} options
 * @param {String} options.url address of remote server
 * @param {String} options.certId id of client certificate
 * @param {String} options.body data to be sent to remote server
 * @param {Object} options.method http method to be used
 * @param {Object} options.headers headers associated with the request
 *
 * @returns {ClientResponse} response from remote server
 */
function request() {
}

clientCertificate = new clientCertificate();
var https = {};
/**
 * @type {https}
 */
N.prototype.https = https;
/**
 * @type {clientCertificate}
 */
https.prototype.clientCertificate = clientCertificate;