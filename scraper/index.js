import puppeteer from 'puppeteer'
import { insertWorld } from '../controllers/worldController.js'
import calcStats from '../statistics/index.js'

import { BASIC_URL } from './consts.js'
const URL = BASIC_URL

import { SERVERS } from './consts.js'
import { SELECTORS } from './consts.js'

const scraper = async (worlds) => {

    const START = new Date()
    console.log(`START: ${START}`)

    console.log('Otwieram przeglądarkę...')
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            "--incognito",
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu'
        ]
    })

    for (let i = 0; i < worlds.length; i++) {
        const world = worlds[i]
        if (!SERVERS.some(s => s === world)) return 'Nieprawidowa nazwa świata.'

        const DATA = []
    
        // const page = await browser.newPage()
        const [page] = await browser.pages()
    
        await page.setRequestInterception(true)
        page.on('request', (req) => {
            if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
                req.abort()
            }
            else {
                req.continue()
            }
        })
    
            const currentServer = URL + world
    
            console.log(`Wchodzę na stronę: ${currentServer}`)
            await page.goto(currentServer)
    
            //Pobiera liczbę stron tabeli
            const nPaginations = await page.$eval(SELECTORS.N_PAGINATIONS, pagination => pagination.textContent)
            // console.log(nPaginations)
    
            //Kontroler, czy udało się pobrać każdą stronę danego świata
            let isDone = false
    
    
            for (let pagination = 1; pagination <= nPaginations; pagination++) {
    
                console.log('Wchodzę na stronę tabeli...')
                const currentPage = currentServer + '?page=' + pagination
                console.log(`${pagination} z ${nPaginations}`)
                await page.goto(currentPage)
    
                //Pobiera liczbę rekordów z tabeli
                const nRows = await page.$$eval(SELECTORS.TABLE_ROW, tr => tr.length)
                console.log(nRows)
    
                for (let row = 1; row <= nRows; row++) {
                    console.log(`Row tabeli nr: ${row}`)
                    //Pobiera Nick z rekordu tabeli
                    const nick = await page.$eval(SELECTORS.NICK(row), nick => nick.textContent)
                    // console.log(nick)
    
                    //Pobiera Lvl z rekordu tabeli
                    const lvl = await page.$eval(SELECTORS.LVL(row), lvl => lvl.textContent)
                    // console.log(lvl)
    
                    //Pobiera Profesję z rekordu tabeli
                    const prof = await page.$eval(SELECTORS.PROF(row), prof => prof.textContent)
                    // console.log(prof)
    
                    //Pobiera PH z rekordu tabeli
                    const ph = await page.$eval(SELECTORS.PH(row), ph => ph.textContent)
                    // console.log(ph)
    
                    //Pobiera Ostatnio online z rekordu tabeli
                    const lastOnline = await page.$eval(SELECTORS.LAST_ONLINE(row), lastOnline => lastOnline.textContent)
                    // console.log(lastOnline)
    
                    const character = {
                        name: nick.trim(),
                        lvl: parseInt(lvl.trim()),
                        prof: prof.trim(),
                        ph: parseInt(ph.trim()),
                        lastOnline: lastOnline.trim()
                    }    
                    DATA.push(character)
                    // console.log(character)
                }
                if (pagination === nPaginations - 1) isDone = true
            }
        
        const END = new Date()
        console.log(`KONIEC: ${END}`)
        
        console.log(`Czy udało się pobrać wszystkie dane: ${isDone}`)
        await insertWorld({ world, DATA })

        const TOTAL_TIME = END - START
        console.log(new Date(TOTAL_TIME).toISOString().slice(11, 19))
    }
    await calcStats()
    await browser.close()
}

export default scraper
// scraper()