require('dotenv').config()
const express = require('express')
const uuid = require('uuid/v4')
const logger = require('./winston-logger')
//const morgan = require('morgan')
//const cors = require('cors')
//const helmet = require('helmet')
const bookmarks = require('./BOOKMARKS')

const { NODE_ENV } = require('./config')

//const app = express()

const bookmarksRouter = express.Router()
const bodyParser = express.json()



//const morganOption = (NODE_ENV === 'production')
  //.apply.? 'tiny'
  //: 'common';

//app.use(morgan(morganOption))
//app.use(helmet())
//app.use(cors())


bookmarksRouter.route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks)
  })
  .post(bodyParser, (req, res) => {
    console.log(req.body)
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]){
        logger.error(`${field} required!`)
        return res.status(400).send(`${field} required!`)
      }
    }

    const title = req.body.title
    const url = req.body.url
    const description = req.body.description
    const rating = req.body.rating


    const newBookmark = {title , url , description , rating , id: uuid()}
    bookmarks.push(newBookmark)
    logger.info(`Bookmark successfully added - ${newBookmark.title} , ${newBookmark.id}`)
        res.status(201)
        .location(`http://localhost:8000/bookmarks/${newBookmark.id}`)
        .json(newBookmark)


  })

  bookmarksRouter
  .route('/bookmarks/:bookmarkId')
  .get((req, res) => {
    const { bookmarkId } = req.params

    const bookmark = bookmarks.find(c => c.id == bookmarkId)

    if (!bookmark) {
      logger.error(`Bookmark not found - check ID`)
      return res
        .status(404)
        .send('Bookmark Not Found - check ID')
    }

    res.json(bookmark)
  })
  .delete((req, res) => {
    
    const {bookmarkId} = req.params
    const index = bookmarks.findIndex(bookmark => bookmark.id === bookmarkId)
    const bookmark = bookmarks.find(c => c.id == bookmarkId)

    if(index === -1){
      logger.error(`Bookmark ID doesn't exist!`)
      return res.status(404)
      .send(`Bookmark ID doesn't exist!`)
    }
    //splice removes the bookmark at the const index
    bookmarks.splice(index, 1)

    logger.info(`Bookmark sucessfully deleted - ${bookmark.title} , ${bookmark.id} `)
    res.status(204).end()



  })

  

  //this has been moved to error-handler.js
  
  //app.use(function errorHandler(error, req, res, next) {
      //let response
      //if (NODE_ENV === 'production') {
      // response = { error: { message: 'server error' } }
     //} else {
      //console.error(error)
         //response = { message: error.message, error }
       //}
       //res.status(500).json(response)
     //})
    

module.exports = bookmarksRouter