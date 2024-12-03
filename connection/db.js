import mongoose from 'mongoose';
// import process from 'process';

// MongoDB connection
const connectDB = async uri => {
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB connected');
	} catch (error) {
		console.error('MongoDB connection error:', error);
	}
};

export default connectDB;
