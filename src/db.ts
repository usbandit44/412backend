import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: "arvinedouard",
  host: "127.0.0.1",
  database: "arvinedouard",
  port: 9999,
});

export default pool;
