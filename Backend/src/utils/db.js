import { connect } from "mongoose";
import imagekit from "imagekit";

export const ConnectDB = async () => {
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

export const ImageKitUploader = new imagekit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});
