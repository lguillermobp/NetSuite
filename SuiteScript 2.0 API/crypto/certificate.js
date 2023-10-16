/**
 * SuiteScript module
 *
 * @module N/crypto/certificate
 * @NApiVersion 2.x
 *
 */
function certificate() {}
/**
 * Signs inputXml string using certId.
 *
 * @governance 10 units
 *
 * @param {Object} options
 * @param {String} options.xmlString input xml string
 * @param {String} options.certId certificate id
 * @param {String} options.algorithm hash algorithm
 * @param {String} options.rootTag root xml tag to sign
 * @param {String} options.insertionTag (optional) where to put signature
 * @returns {SignedXml} signed xml string
 */
function signXml() {
}

/**
 * Verifies signature in the signedXml file.
 *
 * @governance 10 units
 *
 * @param {Object} options
 * @param {String|SignedXml} options.signedXml signed xml
 * @param {String} options.rootTag signed root xml tag
 * @param {String} options.certId certificate id (optional parameter)
 *
 * @throws INVALID_SIGNATURE
 */
function verifyXmlSignature() {
}

/**
 * Creates signer object for signing plain strings
 *
 * @governance 10 units
 *
 * @param {Object} options
 * @param {String} options.certId certificate identification
 * @param {String} options.algorithm hash algorithm
 * @returns {Signer} object for string signing
 */
function createSigner() {
}

/**
 * Creates verifier object for verifying signatures of plain strings
 *
 * @governance 10 units
 *
 * @param {Object} options
 * @param {String} options.certId certificate identification
 * @param {String} options.algorithm hash algorithm
 * @returns {Verifier} object for string verification
 */
function createVerifier() {
}

certificate = new certificate();
var crypto = {};
/**
 * @type {crypto}
 */
N.prototype.crypto = crypto;
/**
 * @type {certificate}
 */
crypto.prototype.certificate = certificate;