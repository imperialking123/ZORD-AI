import { connect } from "mongoose";

const ConnectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    const Connector = await connect(MONGO_URI);

    console.log(
      "Database Connected Successfully, Connection Name",
      Connector.connection.name
    );
  } catch (error) {
    console.log("Error Connecting to MongoDB", error.message);
  }
};

export default ConnectDB
