export const BASIC_URL = 'https://www.margonem.pl/ladder/players,'

export const SERVERS = [
    'Aether', //check
    'Aldous', //check
    'Berufs', //check
    'Brutal', //check
    'Classic', //check
    'Fobos', //check
    'Gefion', //check
    'Hutena', //check
    'Jaruna', //check
    'Katahha', //check
    'Lelwani', //check
    'Majuna', //check
    'Nomada', //check ?
    'Perkun', //check
    'Tarhuna', //check
    'Telawel', //check
    'Tempest', //check
    'Zemyna', //check
    'Zorza', //check
]

export const SELECTORS = {
    N_PAGINATIONS: 
        'body > div.background-logged-wrapper > div > div.body-container > div > div.pagination > div > div.total-pages > a',
    TABLE: 
        'body > div.background-logged-wrapper > div > div.body-container > div > div.light-brown-box.mb-4 > div > table',
    TABLE_ROW: 
        'body > div.background-logged-wrapper > div > div.body-container > div > div.light-brown-box.mb-4 > div > table > tbody > tr',
    NICK: function(n) {
        return `body > div.background-logged-wrapper > div > div.body-container > div > div.light-brown-box.mb-4 > div > table > tbody > tr:nth-child(${n}) > td.long-clan > a`
    },
    LVL: function(n) {
        return `body > div.background-logged-wrapper > div > div.body-container > div > div.light-brown-box.mb-4 > div > table > tbody > tr:nth-child(${n}) > td.long-level`
    },
    PROF: function(n) {
        return `body > div.background-logged-wrapper > div > div.body-container > div > div.light-brown-box.mb-4 > div > table > tbody > tr:nth-child(${n}) > td.long-players`
    },
    PH: function(n) {
        return `body > div.background-logged-wrapper > div > div.body-container > div > div.light-brown-box.mb-4 > div > table > tbody > tr:nth-child(${n}) > td.long-ph`
    },
    LAST_ONLINE: function(n) {
        return `body > div.background-logged-wrapper > div > div.body-container > div > div.light-brown-box.mb-4 > div > table > tbody > tr:nth-child(${n}) > td.long-last-online`
    }   
}