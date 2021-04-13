const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')

class Application {
  constructor() {
    this.middlewares = []
    this.server = express()
  }

  get bodyParser() {
    return this._bodyParser || [bodyParser.json()]
  }

  get logger() {
    return this._logger || morgan('dev')
  }

  configure(options) {
    if (options.logger) { this._logger = options.logger }
    if (options.bodyParser) { this._bodyParser = options.bodyParser }
  }

  prepare() {
    for (let middleware of this.bodyParser) {
      this.middlewares.push(middleware)
    }

    this.middlewares.push(this.logger)
    this.middlewares.push(helmet())

    for (let middleware of this.middlewares) {
      this.server.use(middleware)
    }

    return this
  }

  static(...args) {
    this.middlewares.push(express.static(...args))
  }

  use(...args) {
    this.server.use(...args)
    return this
  }

  start({ port }) {
    this.server.listen(port, () => {
      console.log(`* Listening on http://localhost:${port}`)
      console.log('* Use Ctrl-C to stop')
    })
  }

  static createApplication() {
    return new Application()
  }
}

module.exports = Application
