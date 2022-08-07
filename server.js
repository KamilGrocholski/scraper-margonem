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

const whitelistIp = [ "198.27.83.222", "192.99.21.124", "167.114.64.88", "167.114.64.21" ]

const corsOptionsDelegate = function (req, callback) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    let corsOptions;
    
    if (whitelistIp.indexOf(ip) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    
    callback(null, corsOptions) // callback expects two parameters: error and options
}


app.use(cors())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ limit: '50mb', extended: true }))


app.get('/hello', async (req, res) => {
    console.log('Hello')
    return res.json('Hello')
})

app.get('/testScraper', async (req, res) => {
    try {
        const world = req.params.world
        await testScraper(world) 
        return res.status(201).send('Jest dobrze, dobrze robi, robi git.')
    } catch (err) {
        return res.status(500).send(err)
    }
})

app.get('/deleteWorlds', async (req, res) => {
    try {
        await deleteWorlds()
        return res.status(201).send('Usunięto pomyślnie.')
    } catch (err) {
        return res.status(500).send('Nie udało się usunąć!')
    }
})

app.get('/scraper/:world', async (req, res) => {
    try {
        const world = req.params.world
        await scraper(world) 
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
