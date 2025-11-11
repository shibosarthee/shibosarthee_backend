import dotenv from "dotenv";
dotenv.config(); // loads .env file
import generateToken from "./generateToken.js";

const testToken = generateToken("68f1ddac0e9710562d2319d7");
console.log("Test Token:", testToken);