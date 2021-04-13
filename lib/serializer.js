const isFunction = require('lodash/isFunction')
const includes = require('lodash/includes')
const isArray = require('lodash/isArray')

class Serializer {
  constructor() {
    this.attributes = []
    this.transforms = {}
    this.forCollection = (object) => this.serialize(object)
  }

  property(name, transform) {
    if (!includes(this.attributes, name)) {
      this.attributes.push(name)
    }

    if (isFunction(transform)) {
      this.transforms[name] = transform
    }

    return this
  }

  serialize(object) {
    let store = {}

    for (let attribute of this.attributes) {
      store[attribute] = this.transforms[attribute]
        ? this.transforms[attribute](object)
        : object[attribute]
    }

    return store
  }

  toFunction() {
    return (data) => {
      return isArray(data)
        ? data.map(this.forCollection)
        : this.serialize(data)
    }
  }

  static createSerializer() {
    return new Serializer()
  }
}

module.exports = Serializer
