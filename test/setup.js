
//As you progress with libraries such as chai, 
//you might want to install plugins that add 
//features to chai. This file would be the ideal 
//place to do that.

const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest