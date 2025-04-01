import mongoose from "mongoose";

const mongodbUrl = 'mongodb+srv://prajwalkamdi18:prajwal123@cluster0.rvwdl00.mongodb.net/express';
export const connectDB = async () => {
  await mongoose.connect(mongodbUrl).then(() => {
    console.log("Database connected...")
  })
}