import mongoose from 'mongoose'

const ranksSchema = new mongoose.Schema({
    creationTime: {
        index: true,
        type: Date,
        required: true,
        unique: true
    },
    worlds: [
        {
            name: {
                index: true,
                type: String,
                required: true
            },
            maxLvl: {
                type: Number,
                required: true
            },
            nCharacters: {
                n: {
                    type: Number,
                    required: true
                },
                gainFromLast: {
                    type: Number,
                    required: true,
                },
                gainAvg: {
                    type: Number,
                    required: true
                }
            },
            nProfs: [
                {
                    prof: {
                        type: String,
                        required: true,
                    },
                    n: {
                        type: Number,
                        required: true
                    },
                    gainFromLast: {
                        type: Number,
                        required: true
                    },
                    gainAvg: {
                        type: Number,
                        required: true
                    }
                }
            ]
        }
    ]
}, {
    collection: 'Ranks',
    timestamps: true
}) 

export default mongoose.model('Ranks', ranksSchema)