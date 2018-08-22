const Promise = require('bluebird')
const { postmark } = require('app/config')
const { Client } = require('postmark')
const client = new Client(postmark.apiKey)

/**
 * @class EmailLib
 */
class EmailLib {

  /**
   * Send an email
   *
   * @param {String} options.to
   * @param {String} options.text
   * @param {String} options.html
   * @param {String} options.subject
   */
  send({ to, text, html, subject }) {
    let options = {
      From: postmark.sender,
      To: to,
      Subject: subject,
      TextBody: text,
      HtmlBody: html
    }

    return Promise.fromCallback(cb => client.send(options, cb))
  }

  /**
   * Validates an email address
   *
   * @param {String} email
   */
  validate() {
    return Promise.resolve()
  }
}

module.exports = new EmailLib()
