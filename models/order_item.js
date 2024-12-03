import mongoose from 'mongoose';

// TodoItem model schema
const order = new mongoose.Schema({
	id: Number,
	order: String,
	date: {
		type: Date,
		default: Date.now, // Automatically sets the current date
	  },
	
});

export default mongoose.model('Order', order);
