const _ = require('lodash')
const fs = require('fs')
const config = require('app/config')
const email = require('lib/email')

const TEMPLATES = {
  RESET_PASSWORD: buildTemplate('reset-password')
}

class EmailService {

  /**
   * Sends a password reset email
   *
   * @param {String} to
   * @param {String} resetToken
   * @return {Promise}
   */
  sendResetPasswordEmail(to, resetToken) {
    let resetPasswordUrl = `${config.web.url}/reset-password/${resetToken}`
    let html = TEMPLATES.RESET_PASSWORD({ resetPasswordUrl })
    let subject = 'One Bite Password Reset'

    return email.send({
      to,
      subject,
      html
    })
  }
}

function buildTemplate(name) {
  let string = fs.readFileSync(`${__dirname}/templates/${name}.ejs`).toString('utf8')
  return _.template(string)
}

module.exports = new EmailService()
