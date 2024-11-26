import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./queries";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes for CRUD operations
app.get("/users", getUsers);
app.get("/users/:id", getUserById);
app.post("/users", createUser);
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);

// Start the server
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
