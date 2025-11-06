import express from "express";
import Database from "better-sqlite3";
import cors from "cors";
import path from "path";
const app = express();
const port = 5001;
const db = new Database("jiitcafe.db");
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
db.prepare(`
  CREATE TABLE IF NOT EXISTS menu_items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image_url TEXT
  )
`).run();
db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL DEFAULT 'Pending',
    total_price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();
db.prepare(`
  CREATE TABLE IF NOT EXISTS order_items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    menu_item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (order_id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items (item_id)
  )
`).run();
const seedDb = db.transaction(() => {
  const count = db.prepare("SELECT COUNT(*) as count FROM menu_items").get().count;
  if (count === 0) {
    console.log("No menu items found, seeding database...");
    const insert = db.prepare("INSERT INTO menu_items (name, price, image_url) VALUES (?, ?, ?)");
    insert.run("Espresso", 50, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGzMk0YMLzQLzO3rPsIe6YA346nmMDVN_htw&s");
    insert.run("Samosa", 20, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSfzwyIb2VY5-zNKn8hvOVxAXTgvmIv7azHw&s");
    insert.run("Veg Sandwich", 70, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5mxPW-2W_xvjQBjAAn4Go4OGQVlTpCAU4nA&s");
    insert.run("Cold Coffee", 80, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP2dg_B9SDBIoErfWae--3VaWNxD2nmoa0xg&s");
    insert.run("Margherita Pizza", 150, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1bdKKaTySsc4t8ahzTXQIG87Ls_J8ph907w&s");
    insert.run("Iced Tea", 60, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8PguLBHJGK6eksOdt49JYIpqeCwSah7NsAg&s");
    insert.run("Veg Burger", 100, "https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg");
    insert.run("Fries", 65, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5Wn8kqLfBzqQ7gBGuNClgIudF4lz0NlMMNg&s");
    insert.run("Brownie", 90, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyf6UPXmAbbM9j3b5tseCPnXD34sWBuL11tA&s");
    console.log("Database seeded with 9 items.");
  }
});
seedDb();
app.get("/api/menu", (req, res) => {
  try {
    const query = "SELECT * FROM menu_items";
    const items = db.prepare(query).all();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/order", (req, res) => {
  const { cart } = req.body;
  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }
  try {
    const itemIds = cart.map(item => item.id);
    const placeholders = itemIds.map(() => '?').join(',');
    const menuItems = db.prepare(`SELECT * FROM menu_items WHERE item_id IN (${placeholders})`).all(itemIds);
    const menuItemsMap = new Map();
    menuItems.forEach(item => menuItemsMap.set(item.item_id, item));
    let totalPrice = 0;
    cart.forEach(item => {
      const menuItem = menuItemsMap.get(item.id);
      if (menuItem) {
        totalPrice += menuItem.price * item.quantity;
      }
    });
    const createOrder = db.transaction(() => {
      const orderInfo = db.prepare("INSERT INTO orders (status, total_price) VALUES ('Pending', ?)")
                          .run(totalPrice);
      const newOrderId = orderInfo.lastInsertRowid;
      const insertItem = db.prepare("INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)");
      cart.forEach(item => {
        const menuItem = menuItemsMap.get(item.id);
        if (menuItem) {
          insertItem.run(newOrderId, item.id, item.quantity, menuItem.price);
        }
      });
      return newOrderId;
    });
    const orderId = createOrder();
    res.status(201).json({ orderId: orderId });
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/order/:id", (req, res) => {
  const { id } = req.params;
  try {
    const order = db.prepare("SELECT * FROM orders WHERE order_id = ?").get(id);
    if (!order) {
      return res.status(44).json({ error: "Order not found" });
    }
    const items = db.prepare(`
      SELECT oi.*, mi.name 
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.item_id
      WHERE oi.order_id = ?
    `).all(id);
    res.json({ order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(port, () => {
  console.log(`🚀 JiitCafe Server running at http://localhost:${port}`);
});