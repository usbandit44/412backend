import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  signUp,
  signIn,
  getClothingForSale,
  addItemToLiked,
  getLikedItems,
  getSpecificItem,
  addItemToCart,
  getCartItems,
  removeItemFromCart,
  getUserByIdAndType,
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
app.post("/signup", signUp);
app.post("/signIn", signIn);
app.get("/clothing-for-sale", getClothingForSale);
app.post("/liked-items", addItemToLiked);
app.get("/liked-items/:customerId", getLikedItems);
app.get("/item/:itemId", getSpecificItem);
app.post("/cart", addItemToCart);
app.get("/cart/:customerId", getCartItems);
app.delete("/cart", removeItemFromCart);
app.get("/user/:id/:type", getUserByIdAndType);

// Start the server
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
