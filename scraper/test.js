import puppeteer from 'puppeteer'
import { insertWorld } from '../controllers/worldController.js'
import calcStats from '../statistics/index.js'

import { BASIC_URL } from './consts.js'
const URL = BASIC_URL

import { SERVERS } from './consts.js'
import { SELECTORS } from './consts.js'
const TEST = {
    PAGINATION_LOOP: 1,
    ROWS_LOOP: 50,
}
const testScraper = async (world) => {

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
            "--incognito",
            '--no-zygote',
            '--single-process', // <- this one doesn't work in Windows
            '--disable-gpu'
        ],
    })

        if (!SERVERS.some(s => s === world)) return 'Nieprawidowa nazwa świata.'

        const DATA = []
    
        const page = await browser.newPage()
    
        await page.setRequestInterception(true)
        page.on('request', (req) => {
            if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
                req.abort()
            }
            else {
                req.continue()
            }
        })
    
            DATA[world] = []
    
            const currentServer = URL + world
    
            console.log(`Wchodzę na stronę: ${currentServer}`)
            await page.goto(currentServer)
    
            //Pobiera liczbę stron tabeli
            const nPaginations = await page.$eval(SELECTORS.N_PAGINATIONS, pagination => pagination.textContent)
            let isDone = false
            console.log(nPaginations)
    
    
            for (let pagination = 1; pagination <= TEST.PAGINATION_LOOP; pagination++) {
    
                console.log('Wchodzę na stronę tabeli...')
                const currentPage = currentServer + '?page=' + pagination
                console.log(currentPage)
                await page.goto(currentPage)
    
                //Pobiera liczbę rekordów z tabeli
                const nRows = await page.$$eval(SELECTORS.TABLE_ROW, tr => tr.length)
                console.log(nRows)
    
                for (let row = 1; row <= TEST.ROWS_LOOP; row++) {
    
                    console.log(`Row tabeli nr: ${row}`)
                    //Pobiera Nick z rekordu tabeli
                    const nick = await page.$eval(SELECTORS.NICK(row), nick => nick.textContent)
                    console.log(nick)
    
                    //Pobiera Lvl z rekordu tabeli
                    const lvl = await page.$eval(SELECTORS.LVL(row), lvl => lvl.textContent)
                    console.log(lvl)
    
                    //Pobiera Profesję z rekordu tabeli
                    const prof = await page.$eval(SELECTORS.PROF(row), prof => prof.textContent)
                    console.log(prof)
    
                    //Pobiera PH z rekordu tabeli
                    const ph = await page.$eval(SELECTORS.PH(row), ph => ph.textContent)
                    console.log(ph)
    
                    //Pobiera Ostatnio online z rekordu tabeli
                    const lastOnline = await page.$eval(SELECTORS.LAST_ONLINE(row), lastOnline => lastOnline.textContent)
                    console.log(lastOnline)
    
                    const character = {
                        name: nick.trim(),
                        lvl: parseInt(lvl.trim()),
                        prof: prof.trim(),
                        ph: parseInt(ph.trim()),
                        lastOnline: lastOnline.trim()
                    }
    
                    DATA.push(character)
    
                }
                if (pagination === TEST.PAGINATION_LOOP) isDone = true
            }
        
        
        console.log('Zamykam przeglądarkę...')
        await page.close()
        await browser.close()
        
        console.log(DATA)
        
        
        const END = new Date()
        console.log(`KONIEC: ${END}`)
        
        const TOTAL_TIME = END - START
        console.log(`CZAS: ${new Date(TOTAL_TIME).toISOString().slice(11, 19)}`)
        
        console.log(`Czy udało się pobrać wszystko: ${isDone}`)
        
        console.log('Wkładam do bazy danych...')
        await insertWorld({ world, characters: DATA })
}

export default testScraper
// testScraper()
