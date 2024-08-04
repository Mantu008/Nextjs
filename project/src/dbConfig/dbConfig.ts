import mongoose from "mongoose";

async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB connected Sucessfully");
    });

    connection.on("error", (err) => {
      console.log(
        "MongoDB connection error, plese make sure mongodb is running. " + err
      );
      process.exit();
    });
  } catch (error) {
    console.log("Somthing goes wrong..");
    console.log(error);
  }
}
