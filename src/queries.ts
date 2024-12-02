import { Request, Response } from "express";
import pool from "./db";
import * as crypto from "crypto";


// Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM Customer");
    console.log("test");
    res.status(200).json(result.rows);
  } catch (error) {
    console.log("test2");
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get a user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM Customer");
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update a user by ID
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Delete a user by ID
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//Sign Up Function
export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { name, username, password, birthday, phoneNumber, address, type } = req.body;
  // Generate a unique ID
  const id = parseInt(crypto.randomBytes(4).toString("hex"), 16); // Converts random bytes to a unique numeric ID
  try {
    if (type === "buyer") {
      // Insert into Customer table
      const result = await pool.query(
        `INSERT INTO Customer (c_id, c_name, c_username, c_password, c_birthday, c_number, c_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING c_id`,
        [id, name, username, password, birthday, phoneNumber, address]
      );
      res.status(201).json({ id: result.rows[0].c_id });
    } else if (type === "seller") {
      // Insert into Seller table
      const result = await pool.query(
        `INSERT INTO Seller (s_id, s_name, s_username, s_password, s_birthday, s_number, s_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING s_id`,
        [id, name, username, password, birthday, phoneNumber, address]
      );
      res.status(201).json({ id: result.rows[0].s_id });
    } else {
      // Invalid type provided
      res.status(400).json({ error: "Invalid type. Must be 'buyer' or 'seller'." });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
