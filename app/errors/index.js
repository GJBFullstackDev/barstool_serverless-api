/**
 * @class AppError
 */
class AppError extends Error {

  /**
   * @constructor
   */
  constructor(statusCode, message, title) {
    super(message)
    this._statusCode = statusCode
    this._title = title
  }

  /**
   * @param {Number} statusCode
   */
  get statusCode() {
    return this._statusCode
  }

  /**
   * @param {String} title
   */
  get title() {
    return this._title
  }

  /**
   * @method toString
   * @return {String}
   */
  toString() {
    return `${this.statusCode} ${this.title} - ${this.message}`
  }
}

/* ------------------------------------------------------------------------- *
 * Internal Server Error
 * ------------------------------------------------------------------------- */

class ServerError extends AppError {
  constructor(message='Server error') {
    super(500, message, 'Server Error')
  }
}

class InvalidArgumentError extends AppError {
  constructor(message='Invalid argument error') {
    super(500, message, 'Invalid argument error')
  }
}

/* ------------------------------------------------------------------------- *
 * Bad Request Error
 * ------------------------------------------------------------------------- */

class BadRequestError extends AppError {
  constructor(message='Bad Request') {
    super(400, message, 'Bad request')
  }
}

class ValidationError extends AppError {
  constructor(message='Validation Error') {
    super(400, message, 'Validation Error')
  }
}

/* ------------------------------------------------------------------------- *
 * Unauthorized Error
 * ------------------------------------------------------------------------- */

class UnauthorizedError extends AppError {
  constructor(message='Unauthorized') {
    super(401, message, 'Unauthorized')
  }
}

class ForbiddenError extends AppError {
  constructor(message='Forbidden') {
    super(403, message, 'Forbidden')
  }
}

/* ------------------------------------------------------------------------- *
 * Not Found Error
 * ------------------------------------------------------------------------- */

class NotFoundError extends AppError {
  constructor(message='Not Found') {
    super(404, message, 'Not found')
  }
}

/* ------------------------------------------------------------------------- *
 * Export
 * ------------------------------------------------------------------------- */

module.exports = {
  AppError,
  ServerError,
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  InvalidArgumentError,
  NotFoundError
}
