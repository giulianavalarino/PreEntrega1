import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()

import router from './src/routes/index.js'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)
export default app
