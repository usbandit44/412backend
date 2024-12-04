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

//Add Item to Shopping Cart
export const addItemToCart = async (req: Request, res: Response): Promise<void> => {
  const { customerId, itemId } = req.body;

  try {
    // Insert the customer ID and item ID into the Cart table
    await pool.query(
      `INSERT INTO Cart (ca_customerId, ca_item) VALUES ($1, $2)`,
      [customerId, itemId]
    );
    
    res.status(201).json({ message: "Item successfully added to shopping cart." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//Query All Shopping Cart Items
export const getCartItems = async (req: Request, res: Response): Promise<void> => {
  const { customerId } = req.params;

  try {
    // Query to retrieve all item IDs from the Cart table for the given customer ID
    const result = await pool.query(
      `SELECT ca_item FROM Cart WHERE ca_customerId = $1`,
      [customerId]
    );

    // Extract and return the array of item IDs
    const itemIds = result.rows.map((row) => row.ca_item);
    res.status(200).json(itemIds);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//Remove Item From Shopping Cart
export const removeItemFromCart = async (req: Request, res: Response): Promise<void> => {
  const { customerId, itemId } = req.body;

  try {
    // Query to delete the specific item from the Cart table for the given customer ID
    const result = await pool.query(
      `DELETE FROM Cart WHERE ca_customerId = $1 AND ca_item = $2`,
      [customerId, itemId]
    );

    // Check if rowCount exists and is greater than 0
    if (result.rowCount && result.rowCount > 0) {
      res.status(200).json({ message: "Item successfully removed from the cart." });
    } else {
      res.status(404).json({ message: "Item not found in the cart." });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//Query User
export const getUserByIdAndType = async (req: Request, res: Response): Promise<void> => {
  const { id, type } = req.params;

  try {
    let query = "";

    // Determine the table to query based on the type
    if (type === "customer") {
      query = `SELECT * FROM Customer WHERE c_id = $1`;
    } else if (type === "seller") {
      query = `SELECT * FROM Seller WHERE s_id = $1`;
    } else {
      // Explicitly return the response for invalid type
      res.status(400).json({ message: "Invalid type. Must be 'customer' or 'seller'." });
      return; // Add return to ensure function ends here
    }

    // Execute the query
    const result = await pool.query(query, [id]);

    // Check if a user was found
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//Edit User
export const editUser = async (req: Request, res: Response): Promise<void> => {
  const { id, username, password, birthday, number, address, type } = req.body;

  try {
    let query = "";
    const values = [username, password, birthday, number, address, id];

    // Determine the table to update based on the type
    if (type === "customer") {
      query = `
        UPDATE Customer 
        SET c_username = $1, c_password = $2, c_birthday = $3, c_number = $4, c_address = $5 
        WHERE c_id = $6
        RETURNING *`;
    } else if (type === "seller") {
      query = `
        UPDATE Seller 
        SET s_username = $1, s_password = $2, s_birthday = $3, s_number = $4, s_address = $5 
        WHERE s_id = $6
        RETURNING *`;
    } else {
      res.status(400).json({ message: "Invalid type. Must be 'customer' or 'seller'." });
      return; // Exit the function for invalid type
    }

    // Execute the query
    const result = await pool.query(query, values);

    // Check if a user was updated
    if (result.rows.length > 0) {
      res.status(200).json({ message: "User updated successfully.", user: result.rows[0] });
    } else {
      res.status(404).json({ message: "User not found or no changes made." });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//Sellers Items
export const getSellerItems = async (req: Request, res: Response): Promise<void> => {
  const { sellerId } = req.params;

  try {
    // Query to get all clothing item IDs for the specified seller
    const result = await pool.query(
      `SELECT cl_id FROM Clothing WHERE cl_sellerId = $1`,
      [sellerId]
    );

    // Extract the array of item IDs
    const itemIds = result.rows.map((row) => row.cl_id);

    res.status(200).json(itemIds);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//Add Item
export const addItem = async (req: Request, res: Response): Promise<void> => {
  const { name, description, size, price, image, status, sellerId } = req.body;

  try {
    // Query to insert a new clothing item into the Clothing table
    const result = await pool.query(
      `INSERT INTO Clothing (cl_name, cl_desc, cl_size, cl_price, cl_image, cl_status, cl_sellerId) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING cl_id`,
      [name, description, size, price, image, status, sellerId]
    );

    // Return the ID of the newly created item
    res.status(201).json({
      message: "Item successfully added.",
      itemId: result.rows[0].cl_id,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};