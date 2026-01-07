const db = require('../db/database');

const menuData = [
  // Coffee Based
  {
    name: 'Espresso',
    category: 'Coffee Based',
    price: 22000,
    description: 'Single shot espresso',
    image_url: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400'
  },
  {
    name: 'Americano',
    category: 'Coffee Based',
    price: 25000,
    description: 'Espresso dengan air panas',
    image_url: 'https://images.unsplash.com/photo-1532004491497-ba35c367d634?w=400'
  },
  {
    name: 'Long Black',
    category: 'Coffee Based',
    price: 25000,
    description: 'Air panas dengan espresso di atasnya',
    image_url: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400'
  },
  {
    name: 'Cappuccino',
    category: 'Coffee Based',
    price: 30000,
    description: 'Espresso, susu, dan foam',
    image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400'
  },
  {
    name: 'Cafe Latte',
    category: 'Coffee Based',
    price: 32000,
    description: 'Espresso dengan susu creamy',
    image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'
  },
  {
    name: 'Flat White',
    category: 'Coffee Based',
    price: 32000,
    description: 'Espresso dengan microfoam',
    image_url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400'
  },
  {
    name: 'Mocha',
    category: 'Coffee Based',
    price: 34000,
    description: 'Espresso, coklat, dan susu',
    image_url: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400'
  },
  
  // Manual Brew
  {
    name: 'V60',
    category: 'Manual Brew',
    price: 35000,
    description: 'Seduhan manual pour over',
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'
  },
  {
    name: 'Japanese Iced Coffee',
    category: 'Manual Brew',
    price: 38000,
    description: 'Manual brew dengan es',
    image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400'
  },
  {
    name: 'French Press',
    category: 'Manual Brew',
    price: 33000,
    description: 'Kopi seduh metode press',
    image_url: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400'
  },
  
  // Non-Coffee
  {
    name: 'Matcha Latte',
    category: 'Non-Coffee',
    price: 32000,
    description: 'Matcha Jepang dan susu',
    image_url: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400'
  },
  {
    name: 'Chocolate Drink',
    category: 'Non-Coffee',
    price: 28000,
    description: 'Coklat premium panas/dingin',
    image_url: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400'
  },
  {
    name: 'Taro Latte',
    category: 'Non-Coffee',
    price: 30000,
    description: 'Minuman taro creamy',
    image_url: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400'
  },
  {
    name: 'Red Velvet Latte',
    category: 'Non-Coffee',
    price: 32000,
    description: 'Red velvet dan susu',
    image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400'
  },
  
  // Tea Series
  {
    name: 'English Breakfast Tea',
    category: 'Tea Series',
    price: 25000,
    description: 'Teh hitam klasik',
    image_url: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400'
  },
  {
    name: 'Lemon Tea',
    category: 'Tea Series',
    price: 25000,
    description: 'Teh dengan lemon segar',
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'
  },
  {
    name: 'Peach Tea',
    category: 'Tea Series',
    price: 28000,
    description: 'Teh dengan rasa peach',
    image_url: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400'
  },
  
  // Pastry & Snack
  {
    name: 'Butter Croissant',
    category: 'Pastry & Snack',
    price: 22000,
    description: 'Pastry butter flaky',
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'
  },
  {
    name: 'Chocolate Croissant',
    category: 'Pastry & Snack',
    price: 25000,
    description: 'Croissant isi coklat',
    image_url: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400'
  },
  {
    name: 'Banana Bread',
    category: 'Pastry & Snack',
    price: 24000,
    description: 'Roti pisang lembut',
    image_url: 'https://images.unsplash.com/photo-1605090930601-26ca50ca6a7c?w=400'
  },
  {
    name: 'French Fries',
    category: 'Pastry & Snack',
    price: 20000,
    description: 'Kentang goreng crispy',
    image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'
  },
  {
    name: 'Onion Rings',
    category: 'Pastry & Snack',
    price: 22000,
    description: 'Bawang goreng crispy',
    image_url: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400'
  },
  
  // Light Meal
  {
    name: 'Chicken Sandwich',
    category: 'Light Meal',
    price: 35000,
    description: 'Roti lapis ayam dan sayur',
    image_url: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400'
  },
  {
    name: 'Beef Burger',
    category: 'Light Meal',
    price: 45000,
    description: 'Burger daging sapi',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
  },
  {
    name: 'Spaghetti Aglio Olio',
    category: 'Light Meal',
    price: 38000,
    description: 'Pasta bawang putih dan olive oil',
    image_url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400'
  }
];

// Clear existing menu data
db.prepare('DELETE FROM menus').run();

// Insert menu data
const insert = db.prepare(`
  INSERT INTO menus (name, category, price, description, image_url, is_available)
  VALUES (?, ?, ?, ?, ?, 1)
`);

menuData.forEach(item => {
  insert.run(item.name, item.category, item.price, item.description, item.image_url);
});

console.log(`Seeded ${menuData.length} menu items successfully!`);
process.exit(0);
