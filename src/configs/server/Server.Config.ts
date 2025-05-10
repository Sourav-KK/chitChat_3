import dotenv from "dotenv";
dotenv.config();

interface I_Server_Config {
  PORT_NO: number;
}

const Server_Config = (): I_Server_Config => {
  return Object.freeze({
    PORT_NO: parseInt(process.env.SERVER_PORT_NO || "4000", 10),
  });
};

export { Server_Config };
