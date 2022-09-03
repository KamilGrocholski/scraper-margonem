import mongoose from 'mongoose'

const worldSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	characters: [
		{
			name: String,
			lvl: Number,
			prof: String,
			ph: Number,
			lastOnline: String
		}
	],
	creationTime: { //to zmieniłem UWAGA!!! a raczej dodałem
		type: Date,
		default: () => (new Date()).toISOString().slice(0, 10),
		index: true
	}
}, { 
	collection: 'Worlds',
	timestamps: true
}
)

export default mongoose.model('World', worldSchema)