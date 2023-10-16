/**
 * SuiteScript module for handling the session record.
 *
 * @module N/sessionRecordHandler
 * @public
 * @NApiVersion 2.x
 *
 */
function sessionRecordHandler() {}
/**
 * Creates an instance of the SessionRecordHandler for a session record with the given parameters.
 *
 * @param {string} options.recordType record type of the session record
 * @param {string} options.recordId (optional) if present, this is the id of existing record to be loaded; otherwise a new record instance will be created
 * @param {string} options.storageKey (optional) the storage slot id to be used to store this session record in the session; if missing, a default slot is used
 * @returns {SessionRecordHandler} a SessionRecordHandler object used to manipulate the specified session record
 *
 * @since 2018.2
 */
sessionRecordHandler.prototype.instance = function(options) {};

/**
 * Enum for known session record keys.
 * @enum {string}
 * @readonly
 */
function sessionRecordHandlerSessionRecordKey() {
    this.SESSION_RECORD_1 = 'SESSION_RECORD_1';
    this.SESSION_RECORD_2 = 'SESSION_RECORD_2';
    this.SESSION_RECORD_3 = 'SESSION_RECORD_3';
}
sessionRecordHandler.prototype.SessionRecordKey = sessionRecordHandlerSessionRecordKey;

sessionRecordHandler = new sessionRecordHandler();
/**
 * @type {sessionRecordHandler}
 */
N.prototype.sessionRecordHandler = sessionRecordHandler;