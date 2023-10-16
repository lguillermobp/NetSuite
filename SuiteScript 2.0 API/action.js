/**
 * SuiteScript record action module
 *
 * @module N/action
 * @suiteScriptVersion 2.x
 */
function action() {}
/**
 * Performs a search for available record actions. If only the recordType parameter is specified, all actions available for the record type are returned. If the recordId parameter is also specified, then only actions that qualify for execution on the given record instance are returned. If the id parameter is specified, then only the action with the specified action ID is returned.
 * This method returns a plain JavaScript object of NetSuite record actions available for the record type. The object contains one or more action.Action objects. If there are no available actions for the specified record type, an empty object is returned.
 * If the recordId is specified in this call, the actions that are found are considered qualified. You do not have to provide the recordId to execute a qualified action.
 *
 * @governance none
 *
 * @param {Object} options
 * @param {string} options.recordType record type
 * @param {string} (optional) options.recordId record instance ID
 * @param {string} (optional) options.id action ID
 * @returns {Object} a set of actions (@see Action) defined on the record type indexed by action ID
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.recordType is missing or undefined
 * @throws {SuiteScriptError} SSS_INVALID_RECORD_TYPE if the specified record type doesn't exist
 * @throws {SuiteScriptError} SSS_INVALID_ACTION_ID if an action is specified and such action doesn't exist on the said record type
 * @throws {SuiteScriptError} RECORD_DOES_NOT_EXIST if a record ID is specified and that record instance doesn't exist
 *
 * @since 2018.2
 */
action.prototype.find = function(options) {};
action.find.promise = function(options) {};

/**
 * Returns an executable record action for the given record type. If the recordId parameter is provided, then the
 * action object is only returned if the given record instance qualifies for execution of the given record action.
 * Also, if recordId is provided than the returned action is "qualified" and you don't have to provide the recordId
 * again when executing the Action object.
 *
 * @governance none
 *
 * @param {Object} options
 * @param {string} options.recordType record type
 * @param {string} options.id action ID
 * @param {string} (optional) options.recordId record instance ID
 * @return {Action} record action executor for action specified by options
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.recordType or options.id is missing or undefined
 * @throws {SuiteScriptError} SSS_INVALID_RECORD_TYPE if the specified record type doesn't exist
 * @throws {SuiteScriptError} SSS_INVALID_ACTION_ID if the specified action doesn’t exist on the said record type OR
 *                                                  the specified record instance does not qualify for executing the action
 * @throws {SuiteScriptError} RECORD_DOES_NOT_EXIST if a record ID is specified and that record instance doesn't exist
 *
 * @since 2018.2
 */
action.prototype['get'] = function(options) {};
action['get'].promise = function(options) {};

/**
 * Executes the record action and returns the action results in a plain JavaScript object.
 * If the action fails, it is listed in the results object’s notifications property. If the action executes successfully, the notifications property is usually empty.
 *
 * @governance none
 *
 * Params objects represents parameters which are usually record type specific, only recordId parameter is common for every record type
 * @typedef {Object} Params
 * @property {string} recordId record instance ID
 *
 * @param {Object} options
 * @param {string} options.recordType record type
 * @param {string} options.id action ID
 * @param {Params} options.params action arguments
 * @return {Object} action result; the actual return value returned by the action implementation is stored in the response property
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.recordType or options.id or options.params.recordId is missing or undefined
 * @throws {SuiteScriptError} SSS_INVALID_RECORD_TYPE if the specified record type doesn't exist
 * @throws {SuiteScriptError} SSS_INVALID_ACTION_ID if the specified action doesn't exist on the said record type
 * @throws {SuiteScriptError} RECORD_DOES_NOT_EXIST if the specified record instance doesn't exist
 *
 * @since 2018.2
 */
action.prototype.execute = function(options) {};
action.execute.promise = function(options) {};

/**
 * Executes an asynchronous bulk record action and returns its task ID for status queries. The options.params parameter
 * is mutually exclusive to options.condition and options.paramCallback.
 *
 * @governance 50 units for timesheets, 10 for transactions, 2 for custom records, 5 for all other records
 *
 * Params objects represents parameters which are usually record type specific, only recordId parameter is common for every record type
 * @typedef {Object} Params
 * @property {string} recordId record instance ID
 *
 * @param {Object} options
 * @param {string} options.recordType record type
 * @param {string} options.id action ID
 * @param {Object[]} [Params] array of parameter objects; each object corresponds to one record ID for which the action is to
 *                                             be executed; the object has the following form: {recordId: 1, someParam: 'foo', otherParam: 'bar'}
 *                                             recordId is always mandatory, other parameters are optional and specific to the particular action
 * @param {string} [options.condition] condition used to select record IDs for which the action is to be executed; only the
 *                                              action.ALL_QUALIFIED_INSTANCES constant is supported at the moment
 * @param {string} options.paramCallback] function that takes record ID and returns the parameter object for the given record ID
 * @return {string} task ID used in a later call to getBulkStatus
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.recordType or options.id is missing or undefined
 * @throws {SuiteScriptError} SSS_INVALID_RECORD_TYPE if the specified record type doesn't exist
 * @throws {SuiteScriptError} SSS_INVALID_ACTION_ID if the specified action doesn't exist on the said record type
 * @throws {SuiteScriptError} RECORD_DOES_NOT_EXIST if the specified record instance doesn't exist
 *
 * @since 2019.1
 */
action.prototype.executeBulk = function(options) {};

/**
 * Returns the current status of a bulk execution with the given task ID.
 *
 * @governance 50 units
 *
 * @param {Object} options
 * @param {string} options.taskId a task ID that was returned by a previous call to executeBulk
 * @return {RecordActionTaskStatus} a status object capturing the current state of the bulk action execution; see task module JSDoc
 *
 * @since 2019.1
 */
action.prototype.getBulkStatus = function(options) {};

/**
 * Singleton object to be used as condition parameter in executeBulk.
 */
action.prototype.ALL_QUALIFIED_INSTANCES = function() {};

action = new action();
/**
 * @type {action}
 */
N.prototype.action = action;