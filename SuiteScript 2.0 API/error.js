/**
 * SuiteScript error module
 *
 * @module N/error
 * @suiteScriptVersion 2.x
 *
 */
function error() {}
/**
 * Create a new custom SuiteScript Error object
 * @governance none
 * @param {Object} options
 * @param {string} options.name A user-defined error code. Sets the value for the SuiteSriptError.name property.
 * @param {string} options.message The error message displayed in the Execution Log Details column. The default value is null. Sets the value for the SuiteScriptError.message property.
 * @param {string} options.notifyOff Sets whether email notification is suppressed. If set to false, the system emails the users identified on the applicable script record's Unhandled Errors subtab (when the error is thrown). If set to true, users will not be notified. The default value is false.
 * @return {SuiteScriptError}
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT when some mandatory argument is missing
 * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE when some argument has incorrect type
 *
 * @since 2015.2
 */
error.prototype.create = function(options) {};

/**
 * @enum {string}
 * @readonly
 */
function errorType() {
    this.MISSING_REQD_ARGUMENT = 'SSS_MISSING_REQD_ARGUMENT';
    this.READ_ONLY_PROPERTY = 'READ_ONLY_PROPERTY';
    this.WRONG_PARAMETER_TYPE = 'WRONG_PARAMETER_TYPE';
    this.UNKNOWN_PARAM = 'UNKNOWN_PARAM';
    this.INVALID_FLD_VALUE = 'INVALID_FLD_VALUE';
    this.INVALID_FIELD_VALUE = 'INVALID_FIELD_VALUE';
    this.VALUE_1_OUTSIDE_OF_VALID_MINMAX_RANGE_FOR_FIELD_2 = 'VALUE_1_OUTSIDE_OF_VALID_MINMAX_RANGE_FOR_FIELD_2';
    this.INVALID_NUMBER_MUST_BE_LOWER_THAN_1 = 'INVALID_NUMBER_MUST_BE_LOWER_THAN_1';
    this.INVALID_NUMBER_MUST_BE_GREATER_THAN_1 = 'INVALID_NUMBER_MUST_BE_GREATER_THAN_1';
    this.INVALID_NUMBER_MUST_BE_BETWEEN_1_AND_2 = 'INVALID_NUMBER_MUST_BE_BETWEEN_1_AND_2';
    this.INVALID_KEY_OR_REF = 'WS_INVALID_REFERENCE_KEY_1';
    this.EMPTY_KEY_NOT_ALLOWED = 'EMPTY_KEY_NOT_ALLOWED';
    this.INVALID_URL_URL_MUST_START_WITH_HTTP_HTTPS_FTP_OR_FILE = 'INVALID_URL_URL_MUST_START_WITH_HTTP_HTTPS_FTP_OR_FILE';
    this.INVALID_URL_SPACES_ARE_NOT_ALLOWED_IN_THE_URL = 'INVALID_URL_SPACES_ARE_NOT_ALLOWED_IN_THE_URL';
    this.INVALID_NUMBER_OR_PERCENTAGE = 'INVALID_NUMBER_OR_PERCENTAGE';
    this.INVALID_EMAILS_FOUND = 'INVALID_EMAILS_FOUND';
    this.INVALID_RCRD_TYPE = 'INVALID_RCRD_TYPE';
    this.IDENTIFIERS_CAN_CONTAIN_ONLY_DIGITS_ALPHABETIC_CHARACTERS_OR__WITH_NO_SPACES = 'IDENTIFIERS_CAN_CONTAIN_ONLY_DIGITS_ALPHABETIC_CHARACTERS_OR__WITH_NO_SPACES';
    this.CREDIT_CARD_NUMBERS_MUST_CONTAIN_BETWEEN_13_AND_20_DIGITS = 'CREDIT_CARD_NUMBERS_MUST_CONTAIN_BETWEEN_13_AND_20_DIGITS';
    this.CREDIT_CARD_NUMBER_MUST_CONTAIN_ONLY_DIGITS = 'CREDIT_CARD_NUMBER_MUST_CONTAIN_ONLY_DIGITS';
    this.CREDIT_CARD_NUMBER_IS_NOT_VALID__PLEASE_CHECK_THAT_ALL_DIGITS_WERE_ENTERED_CORRECTLY = 'CREDIT_CARD_NUMBER_IS_NOT_VALID__PLEASE_CHECK_THAT_ALL_DIGITS_WERE_ENTERED_CORRECTLY';
    this.PHONE_NUMBER_SHOULD_HAVE_SEVEN_DIGITS_OR_MORE = 'PHONE_NUMBER_SHOULD_HAVE_SEVEN_DIGITS_OR_MORE';
    this.PLEASE_INCLUDE_THE_AREA_CODE_FOR_PHONE_NUMBER = 'PLEASE_INCLUDE_THE_AREA_CODE_FOR_PHONE_NUMBER';
    this.THE_FIELD_1_CONTAINED_MORE_THAN_THE_MAXIMUM_NUMBER__2__OF_CHARACTERS_ALLOWED = 'THE_FIELD_1_CONTAINED_MORE_THAN_THE_MAXIMUM_NUMBER__2__OF_CHARACTERS_ALLOWED';
    this.PROPERTY_VALUE_CONFLICT = 'PROPERTY_VALUE_CONFLICT';
    this.FORM_VALIDATION_FAILED_YOU_CANNOT_CREATE_THIS_SUBRECORD = 'FORM_VALIDATION_FAILED_YOU_CANNOT_CREATE_THIS_SUBRECORD';
    this.FORM_VALIDATION_FAILED_YOU_CANNOT_SUBMIT_THIS_RECORD = 'FORM_VALIDATION_FAILED_YOU_CANNOT_SUBMIT_THIS_RECORD';
    this.PLEASE_ENTER_AN_EXPIRATION_DATE_IN_MMYYYY_FORMAT = 'PLEASE_ENTER_AN_EXPIRATION_DATE_IN_MMYYYY_FORMAT';
    this.PLEASE_ENTER_A_VALID_FROM_START_DATE_IN_MMYYYY_FORMAT = 'PLEASE_ENTER_A_VALID_FROM_START_DATE_IN_MMYYYY_FORMAT';
    this.NOTICE_THE_CREDIT_CARD_APPEARS_TO_BE_INCORRECT = 'NOTICE_THE_CREDIT_CARD_APPEARS_TO_BE_INCORRECT';
    this.FIELD_MUST_CONTAIN_A_VALUE = 'FIELD_MUST_CONTAIN_A_VALUE';
    this.NON_KATAKANA_DATA_FOUND = 'NON_KATAKANA_DATA_FOUND';
    this.COLOR_VALUE_MUST_BE_6_HEXADECIMAL_DIGITS_OF_THE_FORM_RRGGBB__EXAMPLE_FF0000_FOR_RED = 'COLOR_VALUE_MUST_BE_6_HEXADECIMAL_DIGITS_OF_THE_FORM_RRGGBB__EXAMPLE_FF0000_FOR_RED';
    this.INVALID_DATE_VALUE_MUST_BE_1 = 'INVALID_DATE_VALUE_MUST_BE_1';
    this.INVALID_DATE_VALUE_MUST_BE_ON_OR_AFTER_1CUTOFF_DATE = 'INVALID_DATE_VALUE_MUST_BE_ON_OR_AFTER_1CUTOFF_DATE';
    this.INVALID_GETSELECTOPTION_FILTER_OPERATOR = 'SSS_INVALID_GETSELECTOPTION_FILTER_OPERATOR';
    this.INVALID_UI_OBJECT_TYPE = 'SSS_INVALID_UI_OBJECT_TYPE';
    this.INVALID_SUBLIST_OPERATION = 'SSS_INVALID_SUBLIST_OPERATION';
    this.INVALID_SUITEAPP_APPLICATION_ID = 'INVALID_SUITEAPP_APPLICATION_ID';
    this.INVALID_SCRIPT_OPERATION_ON_READONLY_SUBLIST_FIELD = 'A_SCRIPT_IS_ATTEMPTING_TO_EDIT_THE_1_SUBLIST_THIS_SUBLIST_IS_CURRENTLY_IN_READONLY_MODE_AND_CANNOT_BE_EDITED_CALL_YOUR_NETSUITE_ADMINISTRATOR_TO_DISABLE_THIS_SCRIPT_IF_YOU_NEED_TO_SUBMIT_THIS_RECORD';
    this.WS_NO_PERMISSIONS_TO_SET_VALUE = 'WS_NO_PERMISSIONS_TO_SET_VALUE';
    this.SCRIPT_EXECUTION_USAGE_LIMIT_EXCEEDED = 'SCRIPT_EXECUTION_USAGE_LIMIT_EXCEEDED';
    this.NOT_SUPPORTED_ON_CURRENT_SUBRECORD = 'NOT_SUPPORTED_ON_CURRENT_SUBRECORD';
    this.FIELD_1_IS_NOT_A_SUBRECORD_FIELD = 'FIELD_1_IS_NOT_A_SUBRECORD_FIELD';
    this.THAT_RECORD_IS_NOT_EDITABLE = 'THAT_RECORD_IS_NOT_EDITABLE';
    this.SSS_INVALID_TYPE_ARG = 'SSS_INVALID_TYPE_ARG';
    this.SSS_INVALID_SRCH_OPERATOR = 'SSS_INVALID_SRCH_OPERATOR';
    this.SSS_INVALID_URL = 'SSS_INVALID_URL';
    this.SSS_INVALID_CURRENCY_ID = 'SSS_INVALID_CURRENCY_ID';
    this.SSS_INVALID_API_USAGE = 'SSS_INVALID_API_USAGE';
    this.FIELD_1_ALREADY_CONTAINS_A_SUBRECORD_YOU_CANNOT_CALL_CREATESUBRECORD = 'FIELD_1_ALREADY_CONTAINS_A_SUBRECORD_YOU_CANNOT_CALL_CREATESUBRECORD';
    this.BUTTONS_MUST_INCLUDE_BOTH_A_LABEL_AND_VALUE = 'BUTTONS_MUST_INCLUDE_BOTH_A_LABEL_AND_VALUE';
    this.SSS_INVALID_UI_OBJECT_TYPE = 'SSS_INVALID_UI_OBJECT_TYPE';
    this.INVALID_PAGE_RANGE = 'INVALID_PAGE_RANGE';
    this.SSS_UNSUPPORTED_METHOD = 'SSS_UNSUPPORTED_METHOD';
    this.SSS_TAX_REGISTRATION_REQUIRED = 'SSS_TAX_REGISTRATION_REQUIRED';
    this.INVALID_DIRECTION_FOR_SORTING = 'INVALID_DIRECTION_FOR_SORTING';
    this.INVALID_COLUMN_FOR_SORTING = 'INVALID_COLUMN_FOR_SORTING';
    this.INVALID_FILTER_FIELD_FOR_CURRENT_VIEW = 'INVALID_FILTER_FIELD_FOR_CURRENT_VIEW';
    this.INVALID_CUSTOM_VIEW_VALUE = 'INVALID_CUSTOM_VIEW_VALUE';
    this.INVALID_PAGE_INDEX = 'INVALID_PAGE_INDEX';
    this.INVALID_TASK_TYPE = 'INVALID_TASK_TYPE';
    this.METHOD_IS_ONLY_ALLOWED_FOR_MATRIX_FIELD = 'SSS_METHOD_IS_ONLY_ALLOWED_FOR_MATRIX_FIELD';
    this.SSS_METHOD_IS_ONLY_ALLOWED_FOR_MULTISELECT_FIELD = 'SSS_METHOD_IS_ONLY_ALLOWED_FOR_MULTISELECT_FIELD';
    this.SSS_METHOD_IS_ONLY_ALLOWED_FOR_SELECT_FIELD = 'SSS_METHOD_IS_ONLY_ALLOWED_FOR_SELECT_FIELD';
    this.SSS_RECORD_TYPE_MISMATCH = 'SSS_RECORD_TYPE_MISMATCH';
    this.SSS_INVALID_SUBLIST = 'SSS_INVALID_SUBLIST';
    this.SSS_INVALID_SUBLIST_OPERATION = 'SSS_INVALID_SUBLIST_OPERATION';
    this.SSS_SEARCH_FOR_EACH_LIMIT_EXCEEDED = 'SSS_SEARCH_FOR_EACH_LIMIT_EXCEEDED';
    this.SSS_INVALID_SEARCH_RESULT_INDEX = 'SSS_INVALID_SEARCH_RESULT_INDEX';
    this.SSS_SEARCH_RESULT_LIMIT_EXCEEDED = 'SSS_SEARCH_RESULT_LIMIT_EXCEEDED';
    this.INVALID_FIELD_INDEX = 'INVALID_FIELD_INDEX';
    this.INVALID_FIELD_ID = 'INVALID_FIELD_ID';
    this.INVALID_SUBRECORD_REFEFAILED_AN_UNEXPECTED_ERROR_OCCURREDRENCE = 'INVALID_SUBRECORD_REFERENCE';
    this.FAILED_AN_UNEXPECTED_ERROR_OCCURRED = 'FAILED_AN_UNEXPECTED_ERROR_OCCURRED';
    this.CANNOT_CREATE_RECORD_INSTANCE = 'CANNOT_CREATE_RECORD_INSTANCE';
    this.CANNOT_CREATE_RECORD_DRAFT_OF_EXISTING_RECORD = 'CANNOT_CREATE_RECORD_DRAFT_OF_EXISTING_RECORD';
    this.INVALID_SUBRECORD_MERGE = 'INVALID_SUBRECORD_MERGE';
    this.OPERATION_IS_NOT_ALLOWED = 'OPERATION_IS_NOT_ALLOWED';
    this.INVALID_CONFIGURATION_UNABLE_TO_CHANGE_REQUIRE_CONFIGURATION_FOR_1 = 'INVALID_CONFIGURATION_UNABLE_TO_CHANGE_REQUIRE_CONFIGURATION_FOR_1';
    this.INVALID_CONFIGURATION_UNABLE_TO_CHANGE_REQUIRE_CONFIGURATION_WITHOUT_A_CONTEXT = 'INVALID_CONFIGURATION_UNABLE_TO_CHANGE_REQUIRE_CONFIGURATION_WITHOUT_A_CONTEXT';
    this.MUTUALLY_EXCLUSIVE_ARGUMENTS = 'MUTUALLY_EXCLUSIVE_ARGUMENTS';
    this.RELATIONSHIP_ALREADY_USED = 'RELATIONSHIP_ALREADY_USED';
    this.INVALID_SEARCH_TYPE = 'INVALID_SEARCH_TYPE';
    this.OPERATOR_ARITY_MISMATCH = 'OPERATOR_ARITY_MISMATCH';
    this.INVALID_SEARCH_OPERATOR = 'INVALID_SEARCH_OPERATOR';
    this.NEITHER_ARGUMENT_DEFINED = 'NEITHER_ARGUMENT_DEFINED';
    this.SSS_INVALID_MACRO_ID = 'SSS_INVALID_MACRO_ID';
    this.SSS_INVALID_ACTION_ID = 'SSS_INVALID_ACTION_ID';
    this.SSS_RECORD_DOES_NOT_SATISFY_CONDITION = 'SSS_RECORD_DOES_NOT_SATISFY_CONDITION';
    this.SELECT_OPTION_ALREADY_PRESENT = 'SELECT_OPTION_ALREADY_PRESENT';
    this.SELECT_OPTION_NOT_FOUND = 'SELECT_OPTION_NOT_FOUND';
    this.YOU_HAVE_ATTEMPTED_AN_UNSUPPORTED_ACTION = 'YOU_HAVE_ATTEMPTED_AN_UNSUPPORTED_ACTION';
    this.INVALID_RETURN_TYPE_EXPECTED_1 = 'INVALID_RETURN_TYPE_EXPECTED_1';
    this.HISTORY_IS_ONLY_AVAILABLE_FOR_THE_LAST_30_DAYS = 'HISTORY_IS_ONLY_AVAILABLE_FOR_THE_LAST_30_DAYS';
    this.SSS_ARGUMENT_DISCREPANCY = 'SSS_ARGUMENT_DISCREPANCY';
    this.THE_OPTIONS_ARE_MUTUALLY_EXCLUSIVE_1_2_ARG2_ = 'THE_OPTIONS_ARE_MUTUALLY_EXCLUSIVE_1_2_ARG2_';
    this.INVALID_FORMULA_TYPE = 'INVALID_FORMULA_TYPE';
    this.INVALID_AGGREGATE_TYPE = 'INVALID_AGGREGATE_TYPE';
    this.INVALID_SORT_LOCALE = 'INVALID_SORT_LOCALE';
    this.CANNOT_RESUBMIT_SUBMITTED_ASYNC_SEARCH_TASK = 'CANNOT_RESUBMIT_SUBMITTED_ASYNC_SEARCH_TASK';
    this.SSS_INVALID_READ_SIZE = 'SSS_INVALID_READ_SIZE';
    this.SSS_INVALID_SEGMENT_SEPARATOR = 'SSS_INVALID_SEGMENT_SEPARATOR';
    this.INVALID_DATE_ID = 'INVALID_DATE_ID';
    this.INVALID_LOCALE = 'INVALID_LOCALE';
    this.TRANSLATION_HANDLE_IS_IN_AN_ILLEGAL_STATE = 'TRANSLATION_HANDLE_IS_IN_AN_ILLEGAL_STATE';
    this.FIELD_1_CANNOT_BE_EMPTY = 'FIELD_1_CANNOT_BE_EMPTY';
    this.SSS_TAG_CANNOT_BE_EMPTY = 'SSS_TAG_CANNOT_BE_EMPTY';
    this.SSS_NOT_YET_SUPPORTED = 'SSS_NOT_YET_SUPPORTED';
    this.SSS_DUPLICATE_ALIAS = 'SSS_DUPLICATE_ALIAS';
    this.SSS_MISSING_ALIAS = 'SSS_MISSING_ALIAS';
    this.INVALID_SIGNATURE_TAG = 'INVALID_SIGNATURE_TAG';
    this.INVALID_ALGORITHM = 'INVALID_ALGORITHM';
    this.SIGNATURE_VERIFICATION_FAILED = 'SIGNATURE_VERIFICATION_FAILED';
    this.INVALID_CERTIFICATE_TYPE = 'INVALID_CERTIFICATE_TYPE';
    this.INVALID_SIGNATURE = 'INVALID_SIGNATURE';
    this.ID_CANNOT_HAVE_MORE_THAN_N_CHARACTERS = 'ID_CANNOT_HAVE_MORE_THAN_N_CHARACTERS';
    this.NAME_CANNOT_HAVE_MORE_THAN_N_CHARACTERS = 'NAME_CANNOT_HAVE_MORE_THAN_N_CHARACTERS';
    this.PASSWORD_CANNOT_HAVE_MORE_THAN_N_CHARACTERS = 'PASSWORD_CANNOT_HAVE_MORE_THAN_N_CHARACTERS';
    this.NAME_CANNOT_BE_EMPTY = 'NAME_CANNOT_BE_EMPTY';
    this.INVALID_KEY_TYPE = 'INVALID_KEY_TYPE';
    this.INVALID_SORT = 'INVALID_SORT';
    this.INVALID_ID_PREFIX = 'INVALID_ID_PREFIX';
    this.TOO_MANY_RESULTS = 'TOO_MANY_RESULTS';
    this.INVALID_HTTP_METHOD = 'INVALID_HTTP_METHOD';
    this.INVALID_OPERATION = 'INVALID_OPERATION';
    this.INVALID_PERIOD_TYPE = 'INVALID_PERIOD_TYPE';
    this.INVALID_PERIOD_ADJUSTMENT = 'INVALID_PERIOD_ADJUSTMENT';
    this.INVALID_PERIOD_CODE = 'INVALID_PERIOD_CODE';
}
error.prototype.Type = errorType;

/**
 *
 * @protected
 * @class SuiteScriptError
 * @classdesc Base class of SuiteScript errors
 * @constructor
 *
 * @since 2015.2
 */
function SuiteScriptError() {
    
    /**
     * @name SuiteScriptError#type
     * @type {string}
     * @readonly
     *
     * @since 2015.2
     */    
    this.prototype.type = undefined;    
    /**
     * Error ID that is automatically generated when a new error is created
     * @name SuiteScriptError#id
     * @type {string}
     * @readonly
     *
     * @since 2015.2
     */    
    this.prototype.id = undefined;    
    /**
     * User-defined error code
     * @name SuiteScriptError#name
     * @type {string}
     * @readonly
     *
     * @since 2015.2
     */    
    this.prototype.name = undefined;    
    /**
     * Error message text displayed in the Details column of the Execution Log.
     * @name SuiteScriptError#message
     * @type {string}
     * @readonly
     *
     * @since 2015.2
     */    
    this.prototype.message = undefined;    
    /**
     * List of method calls that the script is executing when the error is thrown. The most recently executed method is listed at the top or the list.
     * @name SuiteScriptError#stack
     * @type {string[]}
     * @readonly
     *
     * @since 2015.2
     */    
    this.prototype.stack = undefined;    
    /**
     * Cause of the SuiteScript error. It either returns the error itself, or another error, which caused this new error to happen.
     * @name SuiteScriptError#cause
     * @type Anything
     * @readonly
     *
     * @since 2016.1
     */    
    this.prototype.cause = undefined;    
    /**
     * Error email supression indicator
     * @name SuiteScriptError#notifyOff
     * @type {boolean}
     * @readonly
     *
     * @since 2016.2
     */    
    this.prototype.notifyOff = undefined;    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2015.2
     */    
    this.prototype.toJSON = function() {};    
    
    /**
     * Returns stringified representation of this SuiteScriptError
     * @governance none
     * @return {string}
     *
     * @since 2015.2
     */    
    this.prototype.toString = function() {};    
}

/**
 *
 * @protected
 * @class UserEventError
 * @classdesc SuiteScript error class for user events
 * @constructor
 *
 * @since 2015.2
 */
function UserEventError() {
    
    /**
     * Internal ID of the submitted record that triggered the script. This property only holds a value when the error is thrown by an afterSubmit user event.
     * @name UserEventError#recordId
     * @type {string}
     * @readonly
     *
     * @since 2015.2
     */    
    this.prototype.recordId = undefined;    
    /**
     * @name UserEventError#eventType
     * @type {string}
     * @readonly
     *
     * @since 2015.2
     */    
    this.prototype.eventType = undefined;    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2015.2
     */    
    this.prototype.toJSON = function() {};    
    
    /**
     * Returns stringified representation of this error
     * @governance none
     * @return {string}
     *
     * @since 2015.2
     */    
    this.prototype.toString = function() {};    
}

error = new error();
/**
 * @type {error}
 */
N.prototype.error = error;