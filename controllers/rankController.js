import Statistics from "../models/statisticsModel.js"
import Ranks from "../models/ranksModel.js"

export const calcRanks = async () => {
    const creationTimesArray = await Statistics.find().select('creationTime').distinct('creationTime')
    if (!creationTimesArray) console.log('!creationTimesArray')
    if (creationTimesArray === null) console.log('creationTimesArray === null')
    console.log(creationTimesArray)
    const theLatestTimestamp = creationTimesArray[creationTimesArray.length - 1]
    console.log(theLatestTimestamp)
    const beforeTimestamp = creationTimesArray[creationTimesArray.length - 2]
    console.log(beforeTimestamp)

    const worldNamesArray = await Statistics.find().select('name').distinct('name')
    if(!worldNamesArray) console.log('!worldNames')
    console.log(worldNamesArray)


    const foundTheLatestData = await Statistics
        .find({ creationTime: theLatestTimestamp })
        .select('name nCharacters nW nM nP nH nT nBd maxLvl creationTime')

    if (!foundTheLatestData) return 'nie ma'

    // console.log(foundTheLatestData)

    const ranks = {
        creationTime: theLatestTimestamp,
        worlds: []
    }

    const foundRanksDocs = await Ranks.find().estimatedDocumentCount()
    console.log(`foundRanksDocs ${ foundRanksDocs }`)
    const nFoundRanks = foundRanksDocs === 1 ? 1 : foundRanksDocs - 1
    console.log(`nFoundRanks ${ nFoundRanks }`)
    const foundRanksTheLatest = await Ranks.findOne({ creationTime: beforeTimestamp })
    // console.log(foundRanksTheLatest)

    for (let i = 0; i < worldNamesArray.length; i++) {
        const foundWorldTheLatest = await Statistics.findOne({ name: worldNamesArray[i], creationTime: theLatestTimestamp }).select('name maxLvl nCharacters nW nM nP nH nT nBd creationTime')
        // console.log(foundWorldTheLatest)
        const foundWorldBefore = await Statistics.findOne({ name: worldNamesArray[i], creationTime: beforeTimestamp }).select('name maxLvl nCharacters nW nM nP nH nT nBd creationTime')
        // console.log(foundWorldBefore)
        if (!foundWorldBefore) {
            console.log('Zaczynam if !foundWorldBefore')
            console.log('foundWorldTheLatest: ')
            console.log(foundWorldTheLatest)
            const world = {
                maxLvl: foundWorldTheLatest.maxLvl,
                name: foundWorldTheLatest.name,
                nCharacters: {
                    n: foundWorldTheLatest.nCharacters,
                    gainFromLast: 0,
                    gainAvg: 0
                },
                nProfs: [
                        {
                            prof: 'Wojownik',
                            n: foundWorldTheLatest.nW,
                            gainFromLast: 0,
                            gainAvg: 0
                        },
                        {
                            prof: 'Mag',
                            n: foundWorldTheLatest.nM,
                            gainFromLast: 0,
                            gainAvg: 0
                        },
                        {
                            prof: 'Paladyn',
                            n: foundWorldTheLatest.nP,
                            gainFromLast: 0,
                            gainAvg: 0
                        },
                        {
                            prof: '??owca',
                            n: foundWorldTheLatest.nH,
                            gainFromLast: 0,
                            gainAvg: 0
                        },
                        {
                            prof: 'Tropiciel',
                            n: foundWorldTheLatest.nT,
                            gainFromLast: 0,
                            gainAvg: 0
                        },
                        {
                            prof: 'Tancerz ostrzy',
                            n: foundWorldTheLatest.nBd,
                            gainFromLast: 0,
                            gainAvg: 0
                        }
                ]
            }
            // console.log(world)
            ranks.worlds.push(world)
        }
        else if (foundWorldBefore && foundWorldTheLatest && nFoundRanks) {
            console.log('Zaczynam else')
            const worldInRanks = foundRanksTheLatest.worlds.find(world => world.name === worldNamesArray[i])
            console.log(worldInRanks)
            const nProfs = {
                nW: worldInRanks.nProfs.find(prof => prof.prof === 'Wojownik'),
                nM: worldInRanks.nProfs.find(prof => prof.prof === 'Mag'),
                nP: worldInRanks.nProfs.find(prof => prof.prof === 'Paladyn'),
                nH: worldInRanks.nProfs.find(prof => prof.prof === '??owca'),
                nT: worldInRanks.nProfs.find(prof => prof.prof === 'Tropiciel'),
                nBd: worldInRanks.nProfs.find(prof => prof.prof === 'Tancerz ostrzy'),
            }
            console.log(nProfs)
            const world = {
                maxLvl: foundWorldTheLatest.maxLvl,
                name: foundWorldTheLatest.name,
                nCharacters: {
                    n: foundWorldTheLatest.nCharacters,
                    gainFromLast: foundWorldTheLatest.nCharacters - foundWorldBefore.nCharacters,
                    gainAvg: foundRanksDocs === 1 ? foundWorldTheLatest.nCharacters - foundWorldBefore.nCharacters : (foundWorldTheLatest.nCharacters - foundWorldBefore.nCharacters + (worldInRanks.nCharacters.gainAvg * nFoundRanks) ) / (nFoundRanks)
                },
                nProfs: [
                    {
                        prof: 'Wojownik',
                        n: foundWorldTheLatest.nW,
                        gainFromLast: foundWorldTheLatest.nW - foundWorldBefore.nW ,
                        gainAvg: foundRanksDocs === 1 ? foundWorldTheLatest.nW - foundWorldBefore.nW : (foundWorldTheLatest.nW - (nProfs.nW.gainAvg * nFoundRanks) ) / (nFoundRanks)
                    },
                    {
                        prof: 'Mag',
                        n: foundWorldTheLatest.nM,
                        gainFromLast: foundWorldTheLatest.nM - foundWorldBefore.nM ,
                        gainAvg: foundRanksDocs === 1 ? foundWorldTheLatest.nM - foundWorldBefore.nM : (foundWorldTheLatest.nM - (nProfs.nM.gainAvg * nFoundRanks) ) / (nFoundRanks)
                    },
                    {
                        prof: 'Paladyn',
                        n: foundWorldTheLatest.nP,
                        gainFromLast: foundWorldTheLatest.nP - foundWorldBefore.nP ,
                        gainAvg: foundRanksDocs === 1 ? foundWorldTheLatest.nP - foundWorldBefore.nP : (foundWorldTheLatest.nP - (nProfs.nP.gainAvg * nFoundRanks) ) / (nFoundRanks)
                    },
                    {
                        prof: '??owca',
                        n: foundWorldTheLatest.nH,
                        gainFromLast: foundWorldTheLatest.nH - foundWorldBefore.nH ,
                        gainAvg: foundRanksDocs === 1 ? foundWorldTheLatest.nH - foundWorldBefore.nH : (foundWorldTheLatest.nH - (nProfs.nH.gainAvg * nFoundRanks) ) / (nFoundRanks)
                    },
                    {
                        prof: 'Tropiciel',
                        n: foundWorldTheLatest.nT,
                        gainFromLast: foundWorldTheLatest.nT - foundWorldBefore.nT ,
                        gainAvg: foundRanksDocs === 1 ? foundWorldTheLatest.nT - foundWorldBefore.nT : (foundWorldTheLatest.nT - (nProfs.nT.gainAvg * nFoundRanks) ) / (nFoundRanks)
                    },
                    {
                        prof: 'Tancerz ostrzy',
                        n: foundWorldTheLatest.nBd,
                        gainFromLast: foundWorldTheLatest.nBd - foundWorldBefore.nBd ,
                        gainAvg: foundRanksDocs === 1 ? foundWorldTheLatest.nBd - foundWorldBefore.nBd : (foundWorldTheLatest.nBd - (nProfs.nBd.gainAvg * nFoundRanks) ) / (nFoundRanks)
                    },
                ]
            }
            ranks.worlds.push(world)
        }

    }

    // console.log(ranks.worlds[0])

    const createResult = await Ranks.create({
        creationTime: ranks.creationTime,
        worlds: ranks.worlds
    })

    // console.log(createResult)

    return 'Chyba dobrze, nie no, dobrze jest, jest dobrze, pewnie, ??e dobrze.'
}