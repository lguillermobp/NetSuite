/**
 * SuiteScript module
 *
 * @module N/http
 * @suiteScriptVersion 2.x
 *
 */
function http() {}
/**
 * Enum describing available HTTP methods. Holds the string value for supported HTTP requests. This enum is used to set the value of http.request and ServerRequest.method.
 * @enum {string}
 * @readonly
 */
function httpMethod() {
    this.GET = 'GET';
    this.POST = 'POST';
    this.PUT = 'PUT';
    this.DELETE = 'DELETE';
    this.HEAD = 'HEAD';
}
http.prototype.Method = httpMethod;

/**
 * Enum describing available Commerce API Cache Durations. Holds the string value for supported cache durations. This enum is used to set the value of the ServerResponse.setCdnCacheable property.
 * @enum {string}
 * @readonly
 */
function httpCacheDuration() {
    this.UNIQUE = 'UNIQUE';
    this.SHORT = 'SHORT';
    this.MEDIUM = 'MEDIUM';
    this.LONG = 'LONG';
}
http.prototype.CacheDuration = httpCacheDuration;

/**
 * Send a HTTP GET request and return a reponse from a server.
 *
 * @governance 10 units
 * @restriction Server SuiteScript only
 *
 * @param {Object} options
 * @param {string} options.url the HTTP URL being requested
 * @param {Object} options.headers (optional) The HTTP headers
 * @return {ClientResponse}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if a required argument is missing
 * @throws {SuiteScriptError} SSS_INVALID_URL if an incorrect protocol is used (ex: http in the HTTPS module)
 *
 * @since 2015.2
 */
http.prototype['get'] = function(options) {};
http['get'].promise = function(options) {};

/**
 * Send a HTTP POST request and return a reponse from a server.
 *
 * @governance 10 units
 * @restriction Server SuiteScript only
 *
 * @param {Object} options
 * @param {string} options.url the HTTP URL being requested
 * @param {string|Object} options.body The POST data
 * @param {Object} [options.headers] The HTTP headers
 * @return {ClientResponse}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if a required argument is missing
 * @throws {SuiteScriptError} SSS_INVALID_URL if an incorrect protocol is used (ex: http in the HTTPS module)
 *
 * @since 2015.2
 */
http.prototype.post = function(options) {};
http.post.promise = function(options) {};

/**
 * Send a HTTP PUT request and return a reponse from a server.
 *
 * @governance 10 units
 * @restriction Server SuiteScript only
 *
 * @param {Object} options
 * @param {string} options.url the HTTP URL being requested
 * @param {string|Object} options.body The PUT data
 * @param {Object} [options.headers] The HTTP headers
 * @return {ClientResponse}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if a required argument is missing
 * @throws {SuiteScriptError} SSS_INVALID_URL if an incorrect protocol is used (ex: http in the HTTPS module)
 *
 * @since 2015.2
 */
http.prototype.put = function(options) {};
http.put.promise = function(options) {};

/**
 * Send a HTTP DELETE request and return a reponse from a server.
 *
 * @governance 10 units
 * @restriction Server SuiteScript only
 *
 * @param {Object} options
 * @param {string} options.url the HTTP URL being requested
 * @param {Object} [options.headers] The HTTP headers
 * @return {ClientResponse}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if a required argument is missing
 * @throws {SuiteScriptError} SSS_INVALID_URL if an incorrect protocol is used (ex: http in the HTTPS module)
 *
 * @since 2015.2
 */
http.prototype['delete'] = function(options) {};
http['delete'].promise = function(options) {};

/**
 * Send a HTTP request and return a response from a server.
 *
 * @governance 10 units
 * @restriction Server SuiteScript only
 *
 * @param {Object} options
 * @param {string} options.method The HTTP request method. Set using the http.Method enum.
 * @param {string} options.url the HTTP URL being requested
 * @param {string|Object} options.body The POST data; must be present if and only if method is POST
 * @param {Object} [options.headers] The HTTP headers
 * @return {ClientResponse}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if a required argument is missing
 * @throws {SuiteScriptError} SSS_INVALID_URL if an incorrect protocol is used (ex: http in the HTTPS module)
 *
 * @since 2015.2
 */
http.prototype.request = function(options) {};
http.request.promise = function(options) {};

/**
 * @enum {string}
 * @readonly
 */
function httpRedirectType() {
    this.RECORD = 'RECORD';
    this.SUITELET = 'SUITELET';
    this.RESTLET = 'RESTLET';
    this.MEDIA_ITEM = 'MEDIAITEM';
    this.TASK_LINK = 'TASKLINK';
}
http.prototype.RedirectType = httpRedirectType;

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

http = new http();
/**
 * @type {http}
 */
N.prototype.http = http;