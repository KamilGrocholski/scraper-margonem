import mongoose from 'mongoose'

const statisticsTotalSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        required: true
    },
    nCharacters: Number,
    nW: Number,
    nM: Number,
    nP: Number,
    nH: Number,
    nT: Number,
    nBd: Number,
    maxLvl: Number,
    profsByLvl: [
        {
            lvl: {
                type: Number,
                index: true
            },
            profs: {
                'Wojownik': Number,
                'Mag': Number,
                'Paladyn': Number,
                'Łowca': Number,
                'Tropiciel': Number,
                'Tancerz ostrzy': Number
            }
        }
    ],
    creationTime: {
        type: Date,
        // default: Date.now,
        default: () => (new Date('2022-11-29')).toISOString().slice(0, 10),
        index: true,
        unique: true
    }
}, { 
    collection: 'Statistics',
}
)

export default mongoose.model('Statistics', statisticsTotalSchema)