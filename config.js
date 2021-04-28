// Read environment variables
// https://12factor.net/
// Dotenv is a zero-dependency module that loads environment variables from a .env file 
//into process.env. Storing configuration in the environment separate from code is based 
// on The Twelve-Factor App methodology.

// .env file in the root directory 
// DB_HOST=localhost
// DB_USER=root
// DB_PASS=s1mpl3
import { config } from "dotenv";
config();

const configurations = {
  PORT: process.env.PORT || 4000,
  MONGODB_HOST: process.env.MONGODB_HOST || "localhost",
  MONGODB_DATABASE: process.env.MONGODB_DB || "linknote-app",
  MONGODB_URI: `mongodb://${process.env.MONGODB_HOST || "localhost"}/${
    process.env.MONGODB_DATABASE || "linknote-app"
  }`,
};

export default configurations;
