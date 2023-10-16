/**
 * SuiteScript https module (Server Side)
 *
 * @module N/https
 * @suiteScriptVersion 2.x
 *
 */
function https() {}
/**
 * Enum for HTTPS methods.
 * Holds the string values for supported HTTPS requests. This enum is used to set the value of https.request(options) and ServerRequest.method.
 * @enum {string}
 * @readonly
 */
function httpsMethod() {
    this.GET = 'GET';
    this.POST = 'POST';
    this.PUT = 'PUT';
    this.DELETE = 'DELETE';
    this.HEAD = 'HEAD';
}
https.prototype.Method = httpsMethod;

/**
 * Enum describing available Commerce API Cache Durations.
 * Holds the string values for supported cache durations. This enum is used to set the value of the ServerResponse.setCdnCacheable(options) property.
 * @enum {string}
 * @readonly
 */
function httpsCacheDuration() {
    this.UNIQUE = 'UNIQUE';
    this.SHORT = 'SHORT';
    this.MEDIUM = 'MEDIUM';
    this.LONG = 'LONG';
}
https.prototype.CacheDuration = httpsCacheDuration;

/**
 * Send a HTTPS GET request and return response from the server.
 *
 * @governance 10 units
 *
 * @param {Object} options
 * @param {string} options.url the HTTPS URL being requested
 * @param {Object} options.headers (optional) The HTTPS headers
 * @return {ClientResponse}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if a required parameter is missing
 * @throws {SuiteScriptError} SSS_INVALID_URL if an incorrect protocol is used (ex: http in the HTTPS module)
 * @throws {SuiteScriptError} SSS_REQUEST_LOOP_DETECTED This script executes a recursive function that has exceeded the limit for the number of times a script can call itself using an HTTPS request.
 *
 * @since 2015.2
 */
https.prototype['get'] = function(options) {};
https['get'].promise = function(options) {};

/**
 * Send a HTTPS POST request and return response from the server.
 *
 * @governance 10 units
 *
 * @param {Object} options
 * @param {string} options.url the HTTPS URL being requested
 * @param {string|Object} options.body The POST data
 * @param {Object} options.headers (optional) The HTTPS headers
 * @return {ClientResponse}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if a required parameter is missing
 * @throws {SuiteScriptError} SSS_INVALID_URL if an incorrect protocol is used (ex: http in the HTTPS module)
 * @throws {SuiteScriptError} SSS_REQUEST_LOOP_DETECTED This script executes a recursive function that has exceeded the limit for the number of times a script can call itself using an HTTPS request.
 *
 * @since 2015.2
 */
https.prototype.post = function(options) {};
https.post.promise = function(options) {};

/**
 * Send a HTTPS PUT request and return response from the server.
 *
 * @governance 10 units
 *
 * @param {Object} options
 * @param {string} options.url the HTTPS URL being requested
 * @param {string|Object} options.body The PUT data
 * @param {Object} options.headers (optional) The HTTPS headers
 * @return {ClientResponse}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if a required parameter is missing
 * @throws {SuiteScriptError} SSS_INVALID_URL if an incorrect protocol is used (ex: http in the HTTPS module)
 * @throws {SuiteScriptError} SSS_REQUEST_LOOP_DETECTED This script executes a recursive function that has exceeded the limit for the number of times a script can call itself using an HTTPS request.
 *
 * @since 2015.2
 */
https.prototype.put = function(options) {};
https.put.promise = function(options) {};

/**
 * Send a HTTPS DELETE request and return response from the server.
 *
 * @governance 10 units
 *
 * @param {Object} options
 * @param {string} options.url The HTTPS URL being requested
 * @param {Object} options.headers (optional) The HTTPS headers
 * @return {ClientResponse}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if a required parameter is missing
 * @throws {SuiteScriptError} SSS_INVALID_URL if an incorrect protocol is used (ex: http in the HTTPS module)
 * @throws {SuiteScriptError} SSS_REQUEST_LOOP_DETECTED This script executes a recursive function that has exceeded the limit for the number of times a script can call itself using an HTTP request.
 *
 * @since 2015.2
 */
https.prototype['delete'] = function(options) {};
https['delete'].promise = function(options) {};

/**
 * Send a HTTPS request and return response from the server.
 *
 * @governance 10 units
 *
 * @param {Object} options
 * @param {string} options.method HTTPS method of the request
 * @param {string} options.url the HTTPS URL being requested
 * @param {string|Object} options.body POST data; must be present if and only if method is POST
 * @param {Object} options.headers (optional) The HTTPS headers
 * @return {ClientResponse}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if a required parameter is missing
 * @throws {SuiteScriptError} SSS_INVALID_URL if an incorrect protocol is used (ex: http in the HTTPS module)
 * @throws {SuiteScriptError} SSS_REQUEST_LOOP_DETECTED This script executes a recursive function that has exceeded the limit for the number of times a script can call itself using an HTTPS request.
 *
 * @since 2015.2
 */
https.prototype.request = function(options) {};
https.request.promise = function(options) {};

/**
 * Creates and return a crypto.SecretKey Object. This method can take a GUID. Use Form.addCredentialField(options) to generate a value. You can put the key in your secure string. SuiteScript decrypts the value (key) and sends it to the server.
 * @governance none
 * @restriction Server SuiteScript only
 * @param {Object} options
 * @param {string} options.guid A GUID used to generate a secret key. The GUID can resolve to either data or metadata.
 * @param {string} [options.encoding] Specifies the encoding for the SecureKey. Accepts values from https.Encoding enum
 * @return {SecretKey}
 *
 * @since 2015.2
 */
https.prototype.createSecretKey = function(options) {};

/**
 * Creates and return a SecureString.
 * @restriction Server SuiteScript only
 * @governance none
 * @param {Object} options
 * @param {string} options.input The string to convert to a secure string
 * @param {string} [options.inputEncoding=UTF-8] Identifies the encoding that the input string uses.
 * @return {SecureString}
 *
 * @since 2015.2
 */
https.prototype.createSecureString = function(options) {};

/**
 * Holds the string values for supported encoding values.
 * @enum {string}
 * @readonly
 */
function httpsEncoding() {
    this.UTF_8 = 'UTF_8';
    this.BASE_16 = 'BASE_16';
    this.BASE_32 = 'BASE_32';
    this.BASE_64 = 'BASE_64';
    this.BASE_64_URL_SAFE = 'BASE_64_URL_SAFE';
    this.HEX = 'HEX';
}
https.prototype.Encoding = httpsEncoding;

/**
 * Holds the string values for supported hashing algorithms.
 * @enum {string}
 * @readonly
 */
function httpsHashAlg() {
    this.SHA1 = 'SHA1';
    this.SHA256 = 'SHA256';
    this.SHA512 = 'SHA512';
    this.MD5 = 'MD5';
}
https.prototype.HashAlg = httpsHashAlg;

/**
 * Holds the string values for supported NetSuite resources that you can redirect to.
 * @enum {string}
 * @readonly
 */
function httpsRedirectType() {
    this.RECORD = 'RECORD';
    this.SUITELET = 'SUITELET';
    this.RESTLET = 'RESTLET';
    this.MEDIA_ITEM = 'MEDIAITEM';
    this.TASK_LINK = 'TASKLINK';
}
https.prototype.RedirectType = httpsRedirectType;

/**
 * @class SecureString
 * @classdesc Class for processing sensitive data in https requests
 * @protected
 * @constructor
 *
 * @since 2015.2
 */
function SecureString() {
    
    /**
     * Changes the encoding of this SecureString
     * @restriction Server SuiteScript only
     * @governance none
     * @param {Object} options
     * @param {string} options.toEncoding The encoding to apply to the returned string. Accepts values from https.Encoding enum.
     * @return {SecureString}
     *
     * @since 2015.2
     */    
    this.prototype.convertEncoding = function(options) {};    
    
    /**
     * Appends the passed string to this SecureString.
     * @restriction Server SuiteScript only
     * @governance none
     * @param {Object} options
     * @param {string} options.input The string to append.
     * @param {string} options.inputEncoding The encoding of the string that is being appended. Accepts values from https.Encoding enum.
     * @return {SecureString}
     *
     * @since 2015.2
     */    
    this.prototype.appendString = function(options) {};    
    
    /**
     * Appends the passed in SecureString to another SecureString.
     * @restriction Server SuiteScript only
     * @governance none
     * @param {Object} options
     * @param {SecureString} options.secureString The SecureString to append.
     * @return {SecureString}
     *
     * @since 2015.2
     */    
    this.prototype.appendSecureString = function(options) {};    
    
    /**
     * Hashes this SecureString object.
     * @restriction Server SuiteScript only
     * @governance none
     * @param {Object} options
     * @param {string} options.algorithm The hash algorithm. Accepts values from HashAlg enum.
     * @return {SecureString}
     *
     * @since 2015.2
     */    
    this.prototype.hash = function(options) {};    
    
    /**
     * Produces the SecureString as an hmac.
     * @restriction Server SuiteScript only
     * @governance none
     * @param {Object} options
     * @param {string} options.algorithm The hash algorithm. Accepts values from https.HashAlg enum.
     * @param {SecretKey} options.key A key returned from https.createSecureKey(options).
     * @return {SecureString}
     *
     * @since 2015.2
     */    
    this.prototype.hmac = function(options) {};    
    
    /**
     * return the object type name
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
     * @since 2015.2
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * Encapsulates the response of an HTTP client request (i.e., the return type for http.delete(options), http.get(options), http.post(options), http.put(options), http.request(options), and corresponding promise methods).
 *
 * @protected
 * @classDescription Encapsulation of the response returned by a web server as a response to our HTTP request.
 * @return {http.ClientResponse}
 * @constructor
 *
 * @since 2015.2
 */
function ClientResponse() {
    
    /**
     * The client response code.
     * @name ClientResponse#code
     * @type number
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     */    
    this.prototype.code = undefined;    
    /**
     * The response headers.
     * @name ClientResponse#headers
     * @type Object
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     */    
    this.prototype.headers = undefined;    
    /**
     * The client response body.
     * @name ClientResponse#body
     * @type string
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     */    
    this.prototype.body = undefined;    
    /**
     * Returns the object type name (http.ClientResponse)
     * @governance none
     * @returns {string}
     *
     * @since 2015.2
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @governance none
     * @returns {{type: string, code: *, headers: *, body: *}}
     *
     * @since 2015.2
     */    
    this.prototype.toJSON = function() {};    
}

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

https = new https();
/**
 * @type {https}
 */
N.prototype.https = https;