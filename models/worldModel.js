import mongoose from 'mongoose'

const worldSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	characters: [
		{
			name: String,
			lvl: Number,
			prof: String,
			ph: Number,
			lastOnline: String
		}
	]
}, { 
	collection: 'Worlds'
}
)

export default mongoose.model('World', worldSchema)