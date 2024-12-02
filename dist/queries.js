"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const db_1 = __importDefault(require("./db"));
const crypto = __importStar(require("crypto"));
// Get all users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query("SELECT * FROM Customer");
        console.log("test");
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.log("test2");
        res.status(500).json({ error: error.message });
    }
});
exports.getUsers = getUsers;
// Get a user by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const result = yield db_1.default.query("SELECT * FROM Customer");
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getUserById = getUserById;
// Create a new user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    try {
        const result = yield db_1.default.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", [name, email]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createUser = createUser;
// Update a user by ID
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    try {
        const result = yield db_1.default.query("UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *", [name, email, id]);
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateUser = updateUser;
// Delete a user by ID
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        yield db_1.default.query("DELETE FROM users WHERE id = $1", [id]);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteUser = deleteUser;
//Sign Up Function
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, password, birthday, phoneNumber, address, type } = req.body;
    // Generate a unique ID
    const id = parseInt(crypto.randomBytes(4).toString("hex"), 16); // Converts random bytes to a unique numeric ID
    try {
        if (type === "buyer") {
            // Insert into Customer table
            const result = yield db_1.default.query(`INSERT INTO Customer (c_id, c_name, c_username, c_password, c_birthday, c_number, c_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING c_id`, [id, name, username, password, birthday, phoneNumber, address]);
            res.status(201).json({ id: result.rows[0].c_id });
        }
        else if (type === "seller") {
            // Insert into Seller table
            const result = yield db_1.default.query(`INSERT INTO Seller (s_id, s_name, s_username, s_password, s_birthday, s_number, s_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING s_id`, [id, name, username, password, birthday, phoneNumber, address]);
            res.status(201).json({ id: result.rows[0].s_id });
        }
        else {
            // Invalid type provided
            res.status(400).json({ error: "Invalid type. Must be 'buyer' or 'seller'." });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.signUp = signUp;
