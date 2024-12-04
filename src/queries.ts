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

//Sign In Function
export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { username, password, type } = req.body;

  try {
    if (type === "buyer") {
      // Query to check if the buyer exists with matching credentials
      const result = await pool.query(
        `SELECT * FROM Customer WHERE c_username = $1 AND c_password = $2`,
        [username, password]
      );
      if (result.rows.length > 0) {
        res.status(200).json({ success: true, message: "Buyer signed in successfully." });
      } else {
        res.status(401).json({ success: false, message: "Invalid buyer credentials." });
      }
    } else if (type === "seller") {
      // Query to check if the seller exists with matching credentials
      const result = await pool.query(
        `SELECT * FROM Seller WHERE s_username = $1 AND s_password = $2`,
        [username, password]
      );
      if (result.rows.length > 0) {
        res.status(200).json({ success: true, message: "Seller signed in successfully." });
      } else {
        res.status(401).json({ success: false, message: "Invalid seller credentials." });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid type. Must be 'buyer' or 'seller'." });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

//Query Clothing For Sale
export const getClothingForSale = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query to retrieve clothing items with status "for sale"
    const result = await pool.query(
      `SELECT cl_id FROM Clothing WHERE cl_status = 'for sale'`
    );
    
    // Extract and return the array of clothing item IDs
    const clothingIds = result.rows.map((row) => row.cl_id);
    res.status(200).json(clothingIds);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//Add Item to Liked Items
export const addItemToLiked = async (req: Request, res: Response): Promise<void> => {
  const { customerId, itemId } = req.body;

  try {
    // Insert the customer ID and item ID into the Liked table
    await pool.query(
      `INSERT INTO Liked (l_customerId, l_item) VALUES ($1, $2)`,
      [customerId, itemId]
    );
    
    res.status(201).json({ message: "Item successfully added to liked items." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//Display Liked Items
export const getLikedItems = async (req: Request, res: Response): Promise<void> => {
  const { customerId } = req.params;

  try {
    // Query to retrieve all item IDs from the Liked table for the given customer ID
    const result = await pool.query(
      `SELECT l_item FROM Liked WHERE l_customerId = $1`,
      [customerId]
    );

    // Extract and return the array of item IDs
    const itemIds = result.rows.map((row) => row.l_item);
    res.status(200).json(itemIds);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//Query Specific Items
export const getSpecificItem = async (req: Request, res: Response): Promise<void> => {
  const { itemId } = req.params;

  try {
    // Query to fetch the clothing item's name, price, and size based on the item ID
    const result = await pool.query(
      `SELECT cl_name, cl_price, cl_size FROM Clothing WHERE cl_id = $1`,
      [itemId]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
