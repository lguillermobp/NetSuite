/**
 * SuiteScript module
 *
 * @module N/certificateControl
 * @NApiVersion 2.x
 *
 */
function certificateControl() {}
/**
 * Returns a list of signing certificates available to the user the script is run under.
 * @governance 10 units
 * @param {Object} options
 * @param {Number} options.subsidiary (optional) filter
 * @param {Number} options.restriction (optional) filter
 * @param {Number} options.notification (optional) filter
 * @param {String|Object} options.name (optional) filter
 * @param {String|Object} options.description (optional) filter
 * @param {String} options.type (optional) filter
 *
 * @returns {Object} metadata about certificate
 */
function findCertificates() {
}

/**
 * Returns audit trail (operations performed with certificate, their exact times, responsible entity/script ...)
 * @param {Object} options
 * @param {Date} options.from (optional) start date
 * @param {Date} options.to (optional) end date
 * @param {String} options.id (optional) scriptId of certificate to search for
 * @param {String} options.operation (optional) certificate operation to search for
 * @param {Number} options.script (optional) script internal id
 * @param {Number} options.deploy (optional) internal id of deployment
 * @param {Number} options.entity (optional) id of entity
 * @throws {error.SuiteScriptError} SSS_INVALID_TYPE_ARG when any parameter is of wrong type
 * @throws {error.SuiteScriptError} TOO_MANY_RESULTS when there are more than 1000 results
 * @returns {Object[]}
 */
function findUsages() {
}

certificateControl = new certificateControl();
/**
 * @type {certificateControl}
 */
N.prototype.certificateControl = certificateControl;