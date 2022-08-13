import Statistics from '../models/statisticsModel.js'

export const insertStatistics = async (statistics) => {


    const start = Date.now()
    console.log(start)
    const result = await Statistics.create({
        maxLvl: statistics.total.maxLvl,
        numberOfCharacters: statistics.total.numberOfCharacters,
        profsByLvl: statistics.total.profsByLvl,
        worlds: newWorlds
    })

    const end = Date.now()  
    console.log(end)
    
    const totalTime = end - start
    console.log(totalTime)  

    return { msg: 'Jest ok', result }
}

