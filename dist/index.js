"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const queries_1 = require("./queries");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware to parse JSON requests
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Routes for CRUD operations
app.get("/users", queries_1.getUsers);
app.get("/users/:id", queries_1.getUserById);
app.post("/users", queries_1.createUser);
app.put("/users/:id", queries_1.updateUser);
app.delete("/users/:id", queries_1.deleteUser);
app.post("/signup", queries_1.signUp);
// Start the server
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
