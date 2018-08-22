const _ = require('lodash')
const utils = require('lib/utils')

/**
 * Common Service
 *
 * @class CommonService
 */
class CommonService {

  /**
   * @constructor
   */
  constructor(model) {
    this._model = model
    this._mongodb = model.model()
  }

  /**
   * @prop {CommonModel} model
   */
  get model() {
    return this._model
  }

  /**
   * @prop {MongooseModel} model
   */
  get mongodb() {
    return this._mongodb
  }

  /**
   * Creates and saves an object in the database
   *
   * @method create
   * @param {Object} data
   * @return {Query}
   */
  create(data) {
    if (!data) throw new Error('data is required')
    return this.mongodb.create(data)
  }

  /**
   * Create or update a document
   *
   * @method createOrUpdate
   * @param {Object} query
   * @param {Object} data
   * @param {Object} [options]
   * @return {Query}
   */
  createOrUpdate(query, data, options={}) {
    if (!query) throw new Error('query is required')
    if (!data) throw new Error('data is required')

    let baseSchema = this.model.baseSchema()
    let _id = baseSchema._id.default()
    let createdAt = baseSchema.createdAt.default()
    let modifiedAt = baseSchema.modifiedAt.default()

    data.modifiedAt = modifiedAt

    let modifiers = Object.keys(data).reduce((obj, key) => {
      if (key[0] === '$') {
        obj[key] = data[key]
        delete data[key]
      }
      return obj
    }, {})

    let createData = {
      $set: data,
      $setOnInsert: { _id, createdAt }
    }

    _.extend(createData, modifiers)

    options.new = true
    options.upsert = true

    return this.mongodb.findOneAndUpdate(query, createData, options)
      .exec()
      .tap(doc => {
        let sameId = doc.id === _id
        if (sameId && options.$created) return options.$created(doc)
        if (!sameId && options.$updated) return options.$updated(doc)
      })
  }

  /**
   * Read a single object by id or query
   *
   * @method read
   * @param {String|Object} idOrQuery
   * @return {Query}
   */
  read(idOrQuery, { populate=null, select=null }={}) {
    if (!idOrQuery) throw new Error('idOrQuery is required')
    let query = _.isString(idOrQuery) ? { _id: idOrQuery } : idOrQuery
    let cursor = this.mongodb.findOne(query)
    if (populate) cursor = cursor.populate(String(populate))
    if (select) cursor = cursor.select(String(select))
    return cursor.exec()
      .tap(utils.errorNotFound())
  }

  /**
   * Read a single object by id or query
   *
   * @method readAndUpdate
   * @param {String|Object} idOrQuery
   * @param {Object} updates
   * @param {Object} [options]
   * @return {Query}
   */
  readAndUpdate(idOrQuery, updates, options={}) {
    if (!idOrQuery) throw new Error('idOrQuery is required')
    if (!updates) throw new Error('updates is required')

    let query = _.isString(idOrQuery) ? { _id: idOrQuery } : idOrQuery

    updates.modifiedAt = Date.now()

    options.new = true
    options.upsert = false
    options.runValidators = true

    if (options.nonatomic) {
      return this.read(idOrQuery)
        .then(doc => {
          _.extend(doc, updates)
          return doc.save()
        })
    }

    return this.mongodb.findOneAndUpdate(query, updates, options).exec()
      .tap(utils.errorNotFound())
  }

  /**
   * @method readAndDelete
   * @param {String|Object} [options]
   * @return {Query}
   */
  readAndDelete(idOrQuery) {
    if (!idOrQuery) throw new Error('idOrQuery is required')

    let query = _.isString(idOrQuery) ? { _id: idOrQuery } : idOrQuery

    return this.mongodb.findOneAndRemove(query).exec()
      .tap(utils.errorNotFound())
      .tap(doc => doc.deleted = true)
  }

  /**
   *
   * @param {Object} query
   * @param {Object} [options]
   * @return {Promise}
   */
  readMany(query, { filter=null, populate=null, select=null, sort=null, hint=null, page=null, id=null, limit=50 }={}) {
    if (!query) throw new Error('query is required')
    if (filter) query = _.extend(query, filter)
    if (sort && page && id) _applyPageQuery(query, { sort, page, id })
    let cursor = this.mongodb.find(query)
    if (sort) cursor = cursor.sort(`${sort} id`)
    if (select) cursor = cursor.select(select)
    if (limit) cursor = cursor.limit(Number(limit))
    if (populate) cursor = cursor.populate(populate)
    if (hint) cursor = cursor.hint(hint)
    return cursor.exec()
  }

  /**
   * Performs an aggregate $match and $lookup
   *
   * @param {Object} query
   * @param {Array} fields
   * @param {Object} [options]
   * @return {Promise}
   */
  lookup(query, fields, { filter=null, select=null, sort=null, hint=null, page=null, id=null, limit=50 }={}) {
    if (!query) throw new Error('query is required')
    if (filter) query = _.extend(query, filter)
    if (sort && page && id) _applyPageQuery(query, { sort, page, id })
    let cursor = this.aggregate().match(query)
    if (sort) cursor = cursor.sort(`${sort} id`)
    if (select) cursor = cursor.project(select)
    if (limit) cursor = cursor.limit(Number(limit))
    if (hint) cursor = cursor.hint(hint)

    for (let field of fields) {
      let path = field.path || field
      let select = field.select || null

      // Lookup
      let lookup = {
        from: this.model.schemaRef(path).collection.name,
        localField: path,
        foreignField: '_id',
        as: path
      }

      // Apply joined select
      if (select && select.length) {
        lookup.pipeline = [{
          $project: select.split(' ').reduce((obj, key) => {
            obj[key] = 1
            return obj
          }, {})
        }]
      }

      // Flatten results
      let unwind = {
        path: `$${path}`,
        preserveNullAndEmptyArrays: true
      }

      cursor = cursor.lookup(lookup).unwind(unwind)
    }

    return cursor.exec()
      .map(json => this.model.hydrate(json, fields))
  }

  /**
   * List objects in a collection
   *
   * @method find
   * @param {Object} [query]
   * @return {Query}
   */
  find() {
    return this.mongodb.find(...arguments)
  }

  /**
   * Find one object in a collection
   *
   * @method findOne
   * @param {Object} [query]
   * @return {Query}
   */
  findOne(idOrQuery) {
    let query = _.isString(idOrQuery) ? { _id: idOrQuery } : idOrQuery
    return this.mongodb.findOne(query)
  }

  /**
   * Deletes objects from database
   *
   * @method deleteMany
   * @param {Object} [query]
   * @return {Query}
   */
  deleteMany() {
    return this.mongodb.deleteMany(...arguments)
  }

  /**
   * Count objects in a query
   *
   * @method count
   * @param {Object} [query]
   * @return {Query}
   */
  count() {
    return this.mongodb.count(...arguments)
  }

  /**
   * Distinct query
   *
   * @method distinct
   * @param {Object} [query]
   * @return {Query}
   */
  distinct() {
    return this.mongodb.distinct(...arguments)
  }

  /**
   * Geo near query
   *
   * @method geoNear
   * @param {Object} [query]
   * @return {Query}
   */
  geoNear(options) {
    options.distanceField = '_distance'
    return this.mongodb
      .aggregate([{
        $geoNear: options
      }])
      .exec()
      .map(json => this.model.hydrate(json))
  }

  /**
   * Start an aggregation chain
   *
   * @method aggregate
   * @return {AggregateQuery}
   */
  aggregate() {
    return this.mongodb.aggregate(...arguments)
  }
}

/**
 * @private
 * @param {Object} query
 * @param {Object} options
 */
function _applyPageQuery(query, { sort, page, id }) {
  let func = (sort[0] === '-') ? '$lt' : '$gt'
  let prop = sort.replace(/-/gi, '')
  let value = _parsePageValue(page)

  let bucketOne = {
    [prop]: value,
    _id: { $gt: id }
  }

  let bucketTwo = {
    [prop]: {
      [func]: value
    }
  }

  query.$or = [bucketOne, bucketTwo]
}

function _parsePageValue(page) {
  let number = Number(page)
  if (_.isFinite(number)) return number

  let date = new Date(page)
  if (_.isFinite(date.getTime())) return date

  return page
}

module.exports = CommonService
