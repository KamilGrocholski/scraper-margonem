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

    const nFoundRanks = await Ranks.find().estimatedDocumentCount()
    // console.log(nFoundRanks)
    const foundRanksTheLatest = await Ranks.findOne({ creationTime: beforeTimestamp })
    // console.log(foundRanksTheLatest)

    for (let i = 0; i < worldNamesArray.length; i++) {
        const foundWorldTheLatest = await Statistics.findOne({ name: worldNamesArray[i], creationTime: theLatestTimestamp }).select('name maxLvl nCharacters nW nM nP nH nT nBd creationTime')
        // console.log(foundWorldTheLatest)
        const foundWorldBefore = await Statistics.findOne({ name: worldNamesArray[i], creationTime: beforeTimestamp }).select('name maxLvl nCharacters nW nM nP nH nT nBd creationTime')
        // console.log(foundWorldBefore)
        if (!foundWorldBefore) {
            console.log('Zaczynam if !foundWorldBefore')
            const world = {
                maxLvl: foundWorldTheLatest.maxLvl,
                name: foundWorldTheLatest.name,
                nCharacters: {
                    gainFromLast: 0,
                    gainAvg: 0
                },
                nProfs: [
                        {
                            prof: 'Wojownik',
                            gainFromLast: 0,
                            gainAvg: 0
                        },
                        {
                            prof: 'Mag',
                            gainFromLast: 0,
                            gainAvg: 0
                        },
                        {
                            prof: 'Paladyn',
                            gainFromLast: 0,
                            gainAvg: 0
                        },
                        {
                            prof: 'Łowca',
                            gainFromLast: 0,
                            gainAvg: 0
                        },
                        {
                            prof: 'Tropiciel',
                            gainFromLast: 0,
                            gainAvg: 0
                        },
                        {
                            prof: 'Tancerz ostrzy',
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
                nH: worldInRanks.nProfs.find(prof => prof.prof === 'Łowca'),
                nT: worldInRanks.nProfs.find(prof => prof.prof === 'Tropiciel'),
                nBd: worldInRanks.nProfs.find(prof => prof.prof === 'Tancerz ostrzy'),
            }
            console.log(nProfs)
            const world = {
                maxLvl: foundWorldTheLatest.maxLvl,
                name: foundWorldTheLatest.name,
                nCharacters: {
                    gainFromLast: foundWorldBefore.nCharacters - foundWorldTheLatest.nCharacters,
                    gainAvg: ((worldInRanks.nCharacters.gainAvg * nFoundRanks) + foundWorldBefore.nCharacters - foundWorldTheLatest.nCharacters) / (nFoundRanks + 1)
                },
                nProfs: [
                    {
                        prof: 'Wojownik',
                        gainFromLast: foundWorldTheLatest.nW - foundWorldBefore.nW ,
                        gainAvg: ((nProfs.nW.gainAvg * nFoundRanks) + foundWorldBefore.nW - foundWorldTheLatest.nW) / (nFoundRanks + 1)
                    },
                    {
                        prof: 'Mag',
                        gainFromLast: foundWorldTheLatest.nM - foundWorldBefore.nM ,
                        gainAvg: ((nProfs.nM.gainAvg * nFoundRanks) + foundWorldBefore.nM - foundWorldTheLatest.nM) / (nFoundRanks + 1)
                    },
                    {
                        prof: 'Paladyn',
                        gainFromLast: foundWorldTheLatest.nP - foundWorldBefore.nP ,
                        gainAvg: ((nProfs.nP.gainAvg * nFoundRanks) + foundWorldBefore.nP - foundWorldTheLatest.nP) / (nFoundRanks + 1)
                    },
                    {
                        prof: 'Łowca',
                        gainFromLast: foundWorldTheLatest.nH - foundWorldBefore.nH ,
                        gainAvg: ((nProfs.nH.gainAvg * nFoundRanks) + foundWorldBefore.nH - foundWorldTheLatest.nH) / (nFoundRanks + 1)
                    },
                    {
                        prof: 'Tropiciel',
                        gainFromLast: foundWorldTheLatest.nT - foundWorldBefore.nT ,
                        gainAvg: ((nProfs.nT.gainAvg * nFoundRanks) + foundWorldBefore.nT - foundWorldTheLatest.nT) / (nFoundRanks + 1)
                    },
                    {
                        prof: 'Tancerz ostrzy',
                        gainFromLast: foundWorldTheLatest.nBd - foundWorldBefore.nBd ,
                        gainAvg: ((nProfs.nBd.gainAvg * nFoundRanks) + foundWorldBefore.nBd - foundWorldTheLatest.nBd) / (nFoundRanks + 1)
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

    return 'Chyba dobrze, nie no, dobrze jest, jest dobrze, pewnie, że dobrze.'
}