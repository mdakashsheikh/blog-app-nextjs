import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('DB Connection Successfully!')
        })

        connection.on('error', () => {
            console.log('MongoDB connection Error, Please make sure your db connection!')
            process.exit();
        })
    } catch (error) {
        console.log('Error from DB Connection!')
        console.log(error)
    }
}