require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV , API_TOKEN} = require('./config')
const errorHandler = require('./error-handler')
const bookmarksRouter = require('./bookmarks-router')
const app = express()
const logger = require('./winston-logger')

function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization')
  logger.error(`Unauthorized request to path: ${req.path}`)

  if (!authToken || authToken.split(' ')[1] !== API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }

  next()
}


app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())
app.use(validateBearerToken)

app.use(bookmarksRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(errorHandler)

module.exports = app