import mongoose from "mongoose";

export default function connectDB() {
    if (!process.env.DB_URI) {
        throw new Error("uri is required");
    }

    mongoose
        .connect(process.env.DB_URI)
        .then(() => {
            console.log("Database connection established");
        })
        .catch((err) => {
            console.error(`ERROR: ${err}`);
        });
}
