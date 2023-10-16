/**
 * SuiteScript email common module
 *
 * @module N/email
 * @suiteScriptVersion 2.x
 *
 */
function email() {}
/**
 * Sends email to an individual or group of recipients and receives bounceback notifications.
 *
 * @governance 20 units
 * @restriction The maximum number of total recipients (recipient + cc + bcc) allowed is 10
 *
 * RelatedRecords represents the NetSuite records to which an Email Message record should be attached.
 * @typedef {Object} RelatedRecords
 * @property {number} transactionId - Transaction record to attach Message record to.
 * @property {number} activityId - Activity record to attach Message record to.
 * @property {number} entityId - Entity record to attach Message record to.
 * @property {Object} customRecord - Custom record to attach Message record to.
 * @property {number} customRecord.id - The instance ID for the custom record to attach the Message record to.
 * @property {string} customRecord.recordType - The integer ID for the custom record type to attach the Message record to.
 *
 * @param {Object} options Email options
 * @param {number} options.author Sender of the email.
 * @param {number|number[]|string[]} options.recipients Recipients of the email, Internal ID or array of Email Addresses.
 * @param {number[]|string[]} [options.cc] CC recipients of the email, Internal ID or array of Email Addresses.
 * @param {number[]|string[]} [options.bcc] BCC recipients of the email as an EmailEntity, Internal ID or Email Address.
 * @param {string} options.subject Subject of the outgoing message.
 * @param {string} options.body Contents of the outgoing message.
 * @param {string} [options.replyTo] The email address that appears in the reply-to header.
 * @param {file.File[]} [options.attachments] Email file attachments. Not supported in client side.
 * @param {RelatedRecords} [options.relatedRecords] Object that contains key/value pairs to associate (attach) the Message record with related records (i.e., transaction, activity, entity, and custom records)
 * @param {boolean} [options.isInternalOnly] If true, the Message record is not visible to an external Entity (for example, a customer or contact). The default value is false.
 * @return {void}
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT when some required argument is missing
 * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE when some argument's type is incorrect
 *
 * @since 2015.2
 *
 */
email.prototype.send = function(options) {};
email.send.promise = function(options) {};

/**
 * Sends bulk email (for use when bounceback notification is not required).
 *
 * @governance 10 units
 * @restriction The maximum number of total recipients (recipient + cc + bcc) allowed is 10
 *
 * RelatedRecords represents the NetSuite records to which an Email Message record should be attached.
 * @typedef {Object} RelatedRecords
 * @property {number} transactionId - Transaction record to attach Message record to.
 * @property {number} activityId - Activity record to attach Message record to.
 * @property {number} entityId - Entity record to attach Message record to.
 * @property {Object} customRecord - Custom record to attach Message record to.
 * @property {number} customRecord.id - The instance ID for the custom record to attach the Message record to.
 * @property {string} customRecord.recordType - The integer ID for the custom record type to attach the Message record to.
 *
 * @param {Object} options Email options
 * @param {number} options.author Internal ID of the email sender.
 * @param {number|number[]|string[]} options.recipients Recipients of the email, Internal ID or array of Email Addresses.
 * @param {number[]|string[]} [options.cc] CC recipients of the email, Internal ID or array of Email Addresses.
 * @param {number[]|string[]} [options.bcc] BCC recipients of the email as an EmailEntity, Internal ID or Email Address.
 * @param {string} options.subject Subject of the outgoing message.
 * @param {string} options.body Contents of the outgoing message.
 * @param {string} [options.replyTo] The email address that appears in the reply-to header.
 * @param {file.File[]} [options.attachments] Email file attachments.  Not supported in client side.
 * @param {RelatedRecords} [options.relatedRecords] Object that contains key/value pairs to associate (attach) the Message record with related records (i.e., transaction, activity, entity, and custom records)
 * @param {boolean} [options.isInternalOnly] If true, the Message record is not visible to an external Entity (for example, a customer or contact). The default value is false.
 * @return {void}
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT when some required argument is missing
 * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE when some argument's type is incorrect
 *
 * @since 2015.2
 *
 */
email.prototype.sendBulk = function(options) {};
email.sendBulk.promise = function(options) {};

/**
 * Send a single "on-demand" campaign email to a specified recipient and return a campaign response ID to track the email
 * @governance 10 units
 *
 * @param {number} campaignEventId  The internal ID of the campaign event.
 * @param {number} recipientId The internal ID of the recipient. Note that the recipient must have an email.
 * @return {number} A campaign response ID (tracking code) as an integer. If the email fails to send, the value returned is -1.
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT when some required argument is missing
 * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE when some argument's type is incorrect
 *
 * @since 2015.2
 *
 */
email.prototype.sendCampaignEvent = function(options) {};
email.sendCampaignEvent.promise = function(options) {};

email = new email();
/**
 * @type {email}
 */
N.prototype.email = email;