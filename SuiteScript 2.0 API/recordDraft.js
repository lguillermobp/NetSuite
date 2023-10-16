/**
 * Record Draft Interface.
 * https://confluence.corp.netsuite.com/display/ScrumSS/recordDraft
 *
 * @module N/recordDraft
 * @NApiVersion 2.x
 *
 */
function recordDraft() {}
/**
 * Saves new draft.
 *
 * @param {Object} options
 * @param {number} options.id Id of existing draft to overwrite.
 * @param {number} options.storeEmptyValues true/false whenever the empty values should be stored as well. When
 * specified, fields to store must be defined. Default is false.
 * @param {number} options.ttlDays Number of days when draft is valid. If not modified within this period, it may be
 * removed. Optional, default to 7 days.
 * @param {array} options.fields Array of field names to save. when empty, all fields are saved. Example ['name',
 *     'ddate']
 * @param {Object} options.sublistsFields Map of Arrays of fields sublists to save. When empty, all sublists are saved.
 * When defined on specified sublists are saved. When array is empty for sublist, all values from sublist are stored.
 * Example { 'item' : ['name', 'qty'] }.
 * @param {record.Record} options.recordObject Record Object which should be saved as a draft.
 *
 * @returns {PlatformResponse} result
 * @returns {number} result.response.draftId Id of the draft.
 * @returns {string} result.response.result Result of the operation {@link RESULT#CREATED} or {@link RESULT#UPDATED}.
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.recordObject is missing
 * @throws {SuiteScriptError} SSS_INVALID_TYPE_ARG if options.id is not valid number
 * @throws {SuiteScriptError} SSS_INVALID_TYPE_ARG if options.ttlDays is not valid number
 * @throws {SuiteScriptError} SSS_INVALID_TYPE_ARG if options.fields is not valid array
 * @throws {SuiteScriptError} SSS_INVALID_TYPE_ARG if options.recordObject is not record object
 * @throws {SuiteScriptError} RCRD_DRFT_DSNT_EXIST is record draft for update does not exist
 * @throws {SuiteScriptError} RCRD_DRFT_INVALID_TTL - when TTL is out of bounds.
 * @throws {SuiteScriptError} INVALID_RCRD_TYPE - when record type is not supported
 * @throws {SuiteScriptError} CANNOT_CREATE_RCRD_DRFT_OF_EXISTING - when existing (having id) record is being
 *     saved
 * @throws {SuiteScriptError} NEITHER_ARGUMENT_DEFINED when options.storeEmptyValues=true and options.fields is not
 *     defined or is empty and options.sublistsFields do not define any field to store or not defined at all
 * @throws {SuiteScriptError} INVALID_FIELD_ID when invalid field id is specified in options.fields or
 *     options.sublistsFields
 * @throws {SuiteScriptError} SSS_INVALID_SUBLIST when invalid sublist id is passed in options.sublistsFields
 * @throws {SuiteScriptError} NOT_ENOUGH_PERMISSIONS When current user is not logged in or is not owner of the given
 * draft
 *
 * @since 2019.1
 */
recordDraft.prototype.save = function(options) {};

/**
 * Loads existing draft.
 *
 * @param {Object} options
 * @param {number} options.id Id of existing draft (required)
 * @param {boolean} options.isDynamic returned record should be dynamic or deferred. true by default
 * @param {array} options.fields Array of field names to load. when empty, all fields are loaded. When
 *     non-stored/invalid fields are passed, this will be ignored by design.
 * @param {Object} options.sublistsFields Map of Arrays of fields sublists to load. When empty, all sublists are
 *     loaded.
 * When defined on specified sublists are loaded. When array is empty for sublist, all values from sublist are loaded.
 * Example { 'item' : ['name', 'qty'] }. When non-stored/invalid sublists/fields are passed, this will be ignored by
 *     design.
 * @param {boolean} options.resolveFieldDependencies automatically resolve field dependencies (restore order).
 * when fields are empty, this is by default true, when fields are specified, this is by default false and
 * fields are filled in order passed in fields array.
 *
 * @returns {PlatformResponse} result
 * @returns {number} result.response.draftId Id of the draft.
 * @returns {Record} result.response.recordObject Restored record object.
 * @returns {string[]} result.response.fields Array of the fields which were available for restoration.
 * @returns {string[]} result.response.failedFields Array of the fields which were not restored.
 * @returns {Object} result.response.sublists Map of arrays of the sublist fields which were available for
 *     restoration.
 * @returns {Object} result.response.failedSublists Map of arrays of the sublist fields which were not restored.
 * @returns {Array} result.response.exceptions Array of errors occured during field restoration.
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.id is missing
 * @throws {SuiteScriptError} SSS_INVALID_TYPE_ARG if options.id is not valid number
 * @throws {SuiteScriptError} SSS_INVALID_TYPE_ARG if options.fields is not valid array
 * @throws {SuiteScriptError} SSS_INVALID_TYPE_ARG if options.isDynamic is not boolean
 * @throws {SuiteScriptError} SSS_INVALID_TYPE_ARG if options.resolveFieldDependencies is not boolean
 * @throws {SuiteScriptError} RCRD_DRFT_DSNT_EXIST is record draft does not exist
 * @throws {SuiteScriptError} NOT_ENOUGH_PERMISSIONS when current user is not logged in or is not owner of the given
 * draft
 *
 * @since 2019.1
 */
recordDraft.prototype.load = function(options) {};

/**
 * Deletes existing draft.
 *
 * @param {Object} options
 * @param {number} options.id Id of existing draft (required)
 *
 * @returns {PlatformResponse} result
 * @returns {number} result.response.draftId Id of the draft.
 * @returns {string} result.response.result Result of the operation {@link RESULT#DELETED}.
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.id is missing
 * @throws {SuiteScriptError} SSS_INVALID_TYPE_ARG if options.id is not valid number
 * @throws {SuiteScriptError} RCRD_DRFT_DSNT_EXIST is record draft does not exist
 * @throws {SuiteScriptError} NOT_ENOUGH_PERMISSIONS when current user is not logged in or is not owner of the given
 * draft
 *
 * @since 2019.1
 */
recordDraft.prototype['delete'] = function(options) {};

/**
 * @enum
 */
function recordDraftRESULT() {
    this.CREATED = 'created';
    this.UPDATED = 'updated';
    this.DELETED = 'deleted';
}
recordDraft.prototype.RESULT = recordDraftRESULT;

/**
 * Constructor for standard platform response.
 *
 * @param {Object} response
 * @param {array} notifications
 * @constructor
 */
function PlatformResponse() {
}

recordDraft = new recordDraft();
/**
 * @type {recordDraft}
 */
N.prototype.recordDraft = recordDraft;