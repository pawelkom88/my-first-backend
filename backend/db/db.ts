
import mongoose from "mongoose";

export default function connectDB() {
    mongoose
        .connect(process.env.DB_URI)
        .then(() => {
            console.log("Database connection established");
        })
        .catch((err) => {
            console.error(`ERROR: ${err}`);
        });
}
