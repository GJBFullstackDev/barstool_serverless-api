const _ = require('lodash')
const pluralize = require('mongoose-legacy-pluralize')
const mongodb = require('lib/mongodb')
const { Schema } = mongodb
const uuid = require('uuid/v4')

/**
 * @const {Boolean} SCHEMA_AUTO_INDEX
 */
const SCHEMA_AUTO_INDEX = process.env.DISABLE_AUTO_INDEX !== 'true'

/**
 * Common Model
 *
 * @class CommonModel
 */
class CommonModel {

  /**
   * @constructor
   */
  constructor(name) {
    this._name = name
  }

  /**
   * @prop {String} name
   */
  get name() {
    return this._name
  }

  /**
   * @method schema
   * @return {Object}
   */
  schema() {
    throw new Error('must override in subclass')
  }

  /**
   * @method configure
   * @param {MongooseSchema} schema
   */
  configure(schema) {
    schema.virtual('id').get(function() {
      return this._id
    })

    schema.set('toObject', {
      virtuals: true,
      getters: true
    })

    schema.set('toJSON', {
      virtuals: true,
      getters: true,
      transform: (ret, doc) => {
        this.toJSON(doc)
        return doc
      }
    })
  }

  /**
  * @method toJSON
  */
  toJSON(doc) {
    doc._id = doc.__t = doc.__v = undefined
  }

  /**
   * @method baseSchema
   * @return {Object}
   */
  baseSchema() {
    return {
      _id: {
        type: String,
        default: uuid,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
      },
      modifiedAt: {
        type: Date,
        default: Date.now,
        required: true
      },
      deleted: {
        type: Boolean,
        default: false,
        required: true
      }
    }
  }

  /**
   * @method schemaOptions
   * @return {Object}
   */
  schemaOptions() {
    return {
      autoIndex: SCHEMA_AUTO_INDEX
    }
  }

  /**
   * @method model
   * @return {Class}
   */
  model() {
    let config = _.extend(this.baseSchema(), this.schema())
    let schema = new Schema(config, this.schemaOptions())
    this.configure(schema)
    return mongodb.createModel(this.name, schema, pluralize(this.name))
  }

  /**
   * @method schemaRef
   * @param {String} path
   * @return {Class}
   */
  schemaRef(path) {
    let Model = mongodb.getModel(this._name)
    let { ref } = Model.schema.paths[path].options
    return mongodb.getModel(ref)
  }

  /**
   * @method hydrate
   * @param {Object} json
   * @param {Array} [populated]
   * @return {MongooseModel}
   */
  hydrate(json, populated=[]) {
    let Model = mongodb.getModel(this._name)
    let object = Model.hydrate(json)
    for (let field of populated) {
      let path = field.path || field
      if (!json[path]) continue
      let { ref } = Model.schema.paths[path].options
      object[path] = mongodb.getModel(ref).hydrate(json[path])
    }
    return object
  }
}

module.exports = CommonModel
