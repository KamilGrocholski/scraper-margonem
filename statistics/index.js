import World from "../models/worldModel.js"
import Statistics from "../models/statisticsModel.js"

const calcStats = async () => {
    const globalStatistics = {
        name: 'Wszystkie',
        nCharacters: 0,
        maxLvl: 0,
        profsByLvl: [],
        'Wojownik': 0,
        'Mag': 0,
        'Paladyn': 0,
        'Łowca': 0,
        'Tropiciel': 0,
        'Tancerz ostrzy': 0
    }

    for (let i = 0; i < 500; i++) {
        globalStatistics.profsByLvl.push({
            lvl: i + 1,
            profs: {
                'Wojownik': 0,
                'Mag': 0,
                'Paladyn': 0,
                'Łowca': 0,
                'Tropiciel': 0,
                'Tancerz ostrzy': 0
            }
        })
    }

    //Tablica creationTimes w bazie danych
    const creationTimesArray = await World // WIELKA ZMIANA UWAGA!!!! 30.09 przypomnienie
        .find()
        .select('creationTime')
        .distinct('creationTime')
    //Tablica nazw światów w bazie danych
    const worldsInCollection = await World
        .find()
        .select('name')
        .distinct('name')

    console.log(worldsInCollection)

    const calcSingleWorld = async (name) => {

        const worldData = await World
            .find({ name, creationTime: creationTimesArray[creationTimesArray.length - 1] })   // WIELKA ZMIANA UWAGA!!!! 30.09 przypomnienie

        console.log(name)
        const worldMaxLvl = worldData[0].characters[0].lvl

        if (worldMaxLvl > globalStatistics.maxLvl) globalStatistics.maxLvl = worldMaxLvl

        const worldStatistics = {
            name,
            nCharacters: 0,
            maxLvl: worldMaxLvl,
            profsByLvl: [],
            'Wojownik': 0,
            'Mag': 0,
            'Paladyn': 0,
            'Łowca': 0,
            'Tropiciel': 0,
            'Tancerz ostrzy': 0
        }

        for (let i = 0; i < worldMaxLvl; i++) {
            worldStatistics.profsByLvl.push({
                lvl: i + 1,
                profs: {
                    'Wojownik': 0,
                    'Mag': 0,
                    'Paladyn': 0,
                    'Łowca': 0,
                    'Tropiciel': 0,
                    'Tancerz ostrzy': 0
                }
            })
        }

        worldData[0].characters.map(char => {
            worldStatistics.nCharacters++
            worldStatistics.profsByLvl[char.lvl - 1].profs[char.prof]++
            worldStatistics[char.prof]++
            
            globalStatistics.nCharacters++
            globalStatistics.profsByLvl[char.lvl - 1].profs[char.prof]++
            globalStatistics[char.prof]++
        })

        await Statistics.create({
            name,
            nCharacters: worldStatistics.nCharacters,
            maxLvl: worldStatistics.maxLvl,
            profsByLvl: worldStatistics.profsByLvl,
            nW: worldStatistics['Wojownik'],
            nM: worldStatistics['Mag'],
            nP: worldStatistics['Paladyn'],
            nH: worldStatistics['Łowca'],
            nT: worldStatistics['Tropiciel'],
            nBd: worldStatistics['Tancerz ostrzy']
        })
    }


    //Iteracja dla każdego świata w tablicy nazw
    await Promise.all(worldsInCollection.map(async world => {
        await calcSingleWorld(world.name)
    }))

    // //Globalne staty, dopiero po policzeniu wszystkich światów
    const globalInsert = await Statistics.create({
        name: globalStatistics.name,
        nCharacters: globalStatistics.nCharacters,
        maxLvl: globalStatistics.maxLvl,
        profsByLvl: globalStatistics.profsByLvl,
        nW: globalStatistics['Wojownik'],
        nM: globalStatistics['Mag'],
        nP: globalStatistics['Paladyn'],
        nH: globalStatistics['Łowca'],
        nT: globalStatistics['Tropiciel'],
        nBd: globalStatistics['Tancerz ostrzy']
    })

    console.log(globalInsert)
}

export default calcStats