import dotenv from "dotenv";
dotenv.config();

interface I_DB_Config {
  MONGO_URI: string;
  APP_NAME: string;
  DB_NAME: string;
  serverSelectionTimeoutMS: number;
  socketTimeoutMS: number;
}

const CreateDBConfigs = (): I_DB_Config => {
  return Object.freeze({
    MONGO_URI: process.env.MONGO_URI || "",
    APP_NAME: process.env.APP_NAME || "",
    DB_NAME: process.env.DB_NAME || "",
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 1000,
  });
};

export { CreateDBConfigs };
