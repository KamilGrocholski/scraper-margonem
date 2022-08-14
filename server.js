import express from 'express'
import cors from 'cors'
import connect from './db/connection.js'

import testScraper from './scraper/test.js'
import scraper from './scraper/index.js'

import { deleteWorlds } from './controllers/worldController.js'
import calcStats from './statistics/index.js'

import dotenv from 'dotenv'
import { calcRanks } from './controllers/rankController.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.get('/hello', async (req, res) => {
    console.log('Hello')
    return res.json('Hello')
})

app.get('/:p/testScraper/:world', async (req, res) => {
    try {
        if (req.params.p !== process.env.P) return res.status(401).send('nieprawidłowe P')
        const world = req.params.world
        await testScraper(world) 
        return res.status(201).send('Jest dobrze, dobrze robi, robi git.')
    } catch (err) {
        return res.status(500).send(err)
    }
})

app.get('/:p/deleteWorlds', async (req, res) => {
    try {
        if (req.params.p !== process.env.P) return res.status(401).send('nieprawidłowe P')
        await deleteWorlds()
        return res.status(201).send('Usunięto pomyślnie.')
    } catch (err) {
        return res.status(500).send('Nie udało się usunąć!')
    }
})

app.get('/:p/scraper/:world', async (req, res) => {
    try {
        if (req.params.p !== process.env.P) return res.status(401).send('nieprawidłowe P')
        const world = req.params.world
        await scraper(world) 
        return res.status(201).send('Jest dobrze, dobrze robi, robi git.')
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
})

app.get('/:p/statistics/insert', async (req, res) => {
    try {
        if (req.params.p !== process.env.P) return res.status(401).send('nieprawidłowe P')
        const response = await calcStats()
        console.log(response)
        console.log('koniec-------------------------------------------------')
        return res.status(200).send({ msg: 'Dobrze jest jest dobrze, dobrze robią' })
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
})

app.get('/:p/ranks/insert', async (req, res) => {
    try {
        if (req.params.p !== process.env.P) return res.status(401).send('nieprawidłowe P')
        const response = await calcRanks()
        console.log(response)
        return res.status(200).send({ msg: 'Dobrze jest jest dobrze, dobrze robią' })
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`>>Działa na porcie: ${ PORT }`))
await connect(process.env.MONGO_URI)
