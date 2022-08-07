import express from 'express'
import cors from 'cors'
import connect from './db/connection.js'

import testScraper from './scraper/test.js'
import scraper from './scraper/index.js'
import { insertWorld } from './controllers/worldController.js'
import { SERVERS } from './scraper/consts.js'

import { deleteWorlds } from './controllers/worldController.js'
import calcStats from './statistics/index.js'

import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ limit: '50mb', extended: true }))


app.get('/hello', async (req, res) => {
    console.log('Hello')
    return res.json('Hello')
})

app.get('/testScraperOne', async(req, res) => {
    try {
        const response = await testScraper('Tempest')
        console.log(response)
        const insertResponse = await insertWorld(response)
        console.log(insertResponse)
    } catch (err) {
        console.log(err)
    }
})

app.get('/testScraper', async (req, res) => {
    try {
        await deleteWorlds()
        await testScraper(SERVERS) 
        await calcStats()
        return res.status(201).send('Jest dobrze, dobrze robi, robi git.')
    } catch (err) {
        return res.status(500).send(err)
    }
})

app.get('/scraper', async (req, res) => {
    try {
        await deleteWorlds()
        await scraper(SERVERS) 
        return res.status(201).send('Jest dobrze, dobrze robi, robi git.')
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
})

app.get('/statistics/insert', async (req, res) => {
    try {
        const response = await calcStats()
        console.log(response)
        console.log('koniec-------------------------------------------------')
        return res.status(200).send({ msg: 'Dobrze jest jest dobrze, dobrze robią' })
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
})


const PORT = process.env.PORT || 80
app.listen(PORT, () => console.log(`>>Działa na porcie: ${ PORT }`))
await connect(process.env.MONGO_URI)
