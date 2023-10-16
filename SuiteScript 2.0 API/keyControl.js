/**
 * SuiteScript module
 *
 * @module N/keyControl
 * @NApiVersion 2.x
 *
 */
function keyControl() {}
/**
 * Returns a list of keys available to the user the script is run under.
 * @governance 10 units
 * @param {Object} options
 * @param {Number} options.restriction (optional) filter
 * @param {String|Object} options.name (optional) filter
 * @param {String|Object} options.description (optional) filter
 *
 * @returns {Object} metadata about key
 */
function findKeys() {
}

keyControl = new keyControl();
/**
 * @type {keyControl}
 */
N.prototype.keyControl = keyControl;