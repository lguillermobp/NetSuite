/**
 * SuiteScript crypto module
 * The N/crypto module encapsulates hashing, hash-based message authentication (hmac), and symmetrical encryption.
 *
 * @module N/crypto
 * @suiteScriptVersion 2.x
 *
 */
function crypto() {}
/**
 * Method used to create a new crypto.SecretKey object.
 * @param options The options object.
 * @param {string} options.guid A GUID used to generate a secret key.
 * @param {string} options.encoding Specifies the encoding for the SecureKey.
 * @return {SecretKey}
 * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options or mandatory parameter are undefined.
 * @since 2015.1
 */
crypto.prototype.createSecretKey = function(options) {};

/**
 * Method used to create a crypto.Hash object.
 * @param {Object} options
 * @param {string} options.algorithm The hash algorithm. Set using the crypto.HashAlg enum.
 * @return {Hash}
 * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options or mandatory parameter are undefined.
 * @since 2015.1
 */
crypto.prototype.createHash = function(options) {};

/**
 * Method used to create a crypto.Hmac object.
 * @param {Object} options The options object.
 * @param {string} options.algorithm The hash algorithm. Use the crypto.HashAlg enum to set this value.
 * @param {SecretKey} options.key The crypto.SecretKey object.
 * @return {Hmac}
 * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options or mandatory parameter are undefined.
 * @since 2015.1
 */
crypto.prototype.createHmac = function(options) {};

/**
 * Method used to create and return a crypto.EncryptionAlg object.
 * @governance none
 * @param {object} options The options object.
 * @param {string} options.algorithm The hash algorithm. Set the value using the crypto.EncryptionAlg enum.
 * @param {SecretKey} options.key The crypto.SecretKey object.
 * @param {string} options.blockCipherMode
 * @param {string} [options.padding] The padding for the cipher text.
 * @return {Cipher}
 * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options or mandatory parameter are undefined.
 * @since 2015.1
 */
crypto.prototype.createCipher = function(options) {};

/**
 * Method used to create a crypto.Decipher object.
 * @param {object} options The options object.
 * @param {string} options.algorithm The hash algorithm. Set by the crypto.EncryptionAlg enum.
 * @param {string} options.key The crypto.SecretKey object used for encryption.
 * @param {string} options.blockCipherMode
 * @param {Object} [options.padding] The padding for the cipher. Set the value using the crypto.Padding enum.
 * @param {string} options.iv The initialization vector that was used for encryption.
 * @return {Decipher}
 * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options or mandatory parameter are undefined.
 * @since 2015.1
 */
crypto.prototype.createDecipher = function(options) {};

/**
 * Holds the string values for supported hashing algorithms. Sets the value of the options.algorithm parameter for crypto.createHash(options) and crypto.createHmac(options).
 * @enum {string}
 * @readonly
 */
function cryptoHashAlg() {
    this.SHA1 = 'SHA1';
    this.SHA256 = 'SHA256';
    this.SHA512 = 'SHA512';
    this.MD5 = 'MD5';
}
crypto.prototype.HashAlg = cryptoHashAlg;

/**
 * Holds the string values for supported encryption algorithms. Sets the options.algorithm parameter for crypto.createCipher(options).
 * @enum {string}
 * @readonly
 */
function cryptoEncryptionAlg() {
    this.AES = 'AES';
}
crypto.prototype.EncryptionAlg = cryptoEncryptionAlg;

/**
 * Holds the string values for supported encodings algorithms. Sets the options.encoding parameter for crypto.createSecretKey(options).
 * @enum {string}
 * @readonly
 */
function cryptoEncoding() {
    this.UTF_8 = 'UTF_8';
    this.BASE_16 = 'BASE_16';
    this.BASE_32 = 'BASE_32';
    this.BASE_64 = 'BASE_64';
    this.BASE_64_URL_SAFE = 'BASE_64_URL_SAFE';
    this.HEX = 'HEX';
}
crypto.prototype.Encoding = cryptoEncoding;

/**
 * Holds the string values for supported cipher padding. Sets the options.padding parameter for crypto.createCipher(options) and crypto.createDecipher(options).
 * @enum {string}
 * @readonly
 */
function cryptoPadding() {
    this.NoPadding = 'NoPadding';
    this.PKCS5Padding = 'PKCS5Padding';
}
crypto.prototype.Padding = cryptoPadding;

/**
 * Returns a new instance of SecretKey used for hmac, cipher and decipher
 *
 * @class
 * @classdesc Encapsulates the handle to the key. The handler does not store the key value. It points to the key stored within the NetSuite system. The GUID is also required to find the key.
 * @param guid
 * @param encoding
 * @constructor
 * @protected
 *
 * @since 2015.2
 */
function SecretKey() {
    
    /**
     * The GUID associated with the secret key.
     * @name SecretKey#guid
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     *
     * @since 2015.2
     */    
    this.prototype.guid = undefined;    
    /**
     * The encoding used for the clear text value of the secret key.
     * @name SecretKey#encoding
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     *
     * @since 2015.2
     */    
    this.prototype.encoding = undefined;    
    /**
     * Returns the object type name (crypto.SecretKey)
     * @restriction Server SuiteScript only
     * @governance none
     * @return {string}
     *
     * @since 2015.2
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @restriction Server SuiteScript only
     * @governance none
     * @return {Object}
     *
     * @since 2020.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * @class CipherPayload
 * @classdesc Encapsulates a cipher payload.
 * @protected
 * @constructor
 *
 * @since 2015.2
 */
function CipherPayload() {
    
    /**
     * Initialization vector for the cipher payload.
     * @name CipherPayload#iv
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     * @since 2015.2
     */    
    this.prototype.iv = undefined;    
    /**
     * Initialization vector for the cipher payload.
     * @name CipherPayload#ciphertext
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     *
     * @since 2015.2
     */    
    this.prototype.ciphertext = undefined;    
    /**
     * Returns the object type name (crypto.CipherPayload)
     * @restriction Server SuiteScript only
     * @governance none
     * @return {string}
     *
     * @since 2015.2
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @restriction Server SuiteScript only
     * @governance none
     * @return {Object}
     *
     * @since 2020.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * @class Hash
 * @classdesc Encapsulation of a Hash
 * @constructor
 * @protected
 *
 * @since 2015.2
 */
function Hash() {
    
    /**
     * Method used to update clear data with the encoding specified.
     * @restriction Server SuiteScript only
     * @governance none
     * @param {Object} options The options object.
     * @param {string} options.input The data to be updated.
     * @param {string} [options.inputEncoding] The input encoding. Set using the encode.Encoding enum.
     * @return {void}
     * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT if options or required parameters are undefined
     *
     * @since 2015.2
     */    
    this.prototype.update = function(options) {};    
    
    /**
     * Calculates the digest of the data to be hashed.
     * @restriction Server SuiteScript only
     * @governance none
     * @param {Object} options The options object.
     * @param {string} [options.outputEncoding] The output encoding. Set using the encode.Encoding enum.
     * @return {string}
     *
     * @since 2015.2
     */    
    this.prototype.digest = function(options) {};    
    
    /**
     * Returns the object type name (crypto.Hash)
     * @restriction Server SuiteScript only
     * @governance none
     * @return {string}
     *
     * @since 2015.2
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @restriction Server SuiteScript only
     * @governance none
     * @return {Object}
     *
     * @since 2020.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * @class
 * @classdesc Encapsulates an hmac.
 * @return {Hmac}
 * @protected
 * @constructor
 *
 * @since 2015.2
 */
function Hmac() {
    
    /**
     * Method used to update the clear data with the encoding specified.
     * @governance none
     * @param {Object} options The options object.
     * @param {string} options.input The hmac data to be updated.
     * @param {string} [options.inputEncoding] The input encoding. Set using the encode.Encoding enum. The default value is UTF_8.
     * @return {void}
     * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options or mandatory parameter are undefined.
     *
     * @since 2015.2
     */    
    this.prototype.update = function(options) {};    
    
    /**
     * Method used to update the clear data with the encoding specified.
     * @governance none
     * @param {Object} options The hmac data to be updated.
     * @param {string} [options.outputEncoding] The input encoding. Set using the encode.Encoding enum. The default value is UTF_8.
     * @return {string}
     * @since 2015.2
     */    
    this.prototype.digest = function(options) {};    
    
    /**
     * Returns the object type name (crypto.Hash)
     * @restriction Server SuiteScript only
     * @governance none
     * @return {string}
     *
     * @since 2015.2
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @restriction Server SuiteScript only
     * @governance none
     * @return {Object}
     *
     * @since 2020.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * @class Cipher
 * @classDescription Encapsulates a cipher.
 * @protected
 * @constructor
 *
 * @since 2015.2
 */
function Cipher() {
    
    /**
     * Method used to update the clear data with the specified encoding.
     * @restriction Server SuiteScript only
     * @governance none
     * @param {Object} options The options object.
     * @param {string} options.input The clear data to be updated.
     * @param {string} [options.inputEncoding] The input encoding.
     * @return {void}
     * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options or mandatory parameter are undefined.
     *
     * @since 2015.2
     */    
    this.prototype.update = function(options) {};    
    
    /**
     * Method used to return the cipher data.
     * @restriction Server SuiteScript only
     * @governance none
     * @param {Object} options The options object.
     * @param {string} [options.outputEncoding] The output encoding for a crypto.CipherPayload object.
     * @return {CipherPayload}
     *
     * @since 2015.2
     */    
    this.prototype['final'] = function(options) {};    
    
    /**
     * Returns the object type name (crypto.Cipher)
     * @restriction Server SuiteScript only
     * @governance none
     * @return {string}
     *
     * @since 2015.2
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @restriction Server SuiteScript only
     * @governance none
     * @return {Object}
     *
     * @since 2020.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * @class Decipher
 * @classDescription Encapsulates a decipher. This object has methods that decrypt.
 * @protected
 * @constructor
 *
 * @since 2015.2
 */
function Decipher() {
    
    /**
     * Method used to update cipher data with the specified encoding.
     * @restriction Server SuiteScript only
     * @governance none
     * @param {Object} options The options object.
     * @param {string} options.input The data to update.
     * @param {string} [options.inputEncoding] Specifies the encoding of the input data.
     * @return {void}
     * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options or mandatory parameter are undefined.
     *
     * @since 2015.1
     */    
    this.prototype.update = function(options) {};    
    
    /**
     * Method used to return the clear data.
     * @restriction Server SuiteScript only
     * @governance none
     * @param {Object} options The options object
     * @param {string} [options.outputEncoding] Specifies the encoding for the output
     * @return {string}
     *
     * @since 2015.2
     */    
    this.prototype['final'] = function(options) {};    
    
    /**
     * Returns the object type name (crypto.Decipher)
     * @restriction Server SuiteScript only
     * @governance none
     * @return {string}
     *
     * @since 2015.2
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @restriction Server SuiteScript only
     * @governance none
     * @return {Object}
     *
     * @since 2020.1
     */    
    this.prototype.toJSON = function() {};    
}

crypto = new crypto();
/**
 * @type {crypto}
 */
N.prototype.crypto = crypto;