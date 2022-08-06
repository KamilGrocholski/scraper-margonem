import World from '../models/worldModel.js'

export const insertWorld = async ({ world, characters }) => {
    try {
        const result = await World.create({
            name: world,
            characters
        })
        console.log(result)
        return 'Jest dobrze, dobrze robi, robi dobrze, dobrze jest.'
    } catch (err) {
        console.log(err)
        return err
    }
}

export const deleteWorlds = async () => {
    try {
        const result = await World.deleteMany()
        console.log(result)
    } catch (err) {
        console.log(err)
        return err
    }
}