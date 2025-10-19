import { db } from './db';
import { productsTable, salesTable } from './schema';

export async function seed() {
  console.log("🌱 Seeding database...");
  await db.insert(productsTable).values([
    { name: 'Laptop', category: 'Electronics', price: 999.99, stock: 50 },
    { name: 'Mouse', category: 'Electronics', price: 25.99, stock: 200 },
    { name: 'Keyboard', category: 'Electronics', price: 75.0, stock: 150 },
    { name: 'Monitor', category: 'Electronics', price: 299.99, stock: 75 },
    { name: 'Desk Chair', category: 'Furniture', price: 199.99, stock: 40 },
    { name: 'Desk', category: 'Furniture', price: 399.99, stock: 30 },
    { name: 'Notebook', category: 'Stationery', price: 5.99, stock: 500 },
    { name: 'Pen Set', category: 'Stationery', price: 12.99, stock: 300 },
  ]);


  await db.insert(salesTable).values([
    {
      product_id: 1,
      quantity: 2,
      total_amount: 1999.98,
      customer_name: 'John Doe',
      region: 'North',
    },
    {
      product_id: 2,
      quantity: 3,
      total_amount: 77.97,
      customer_name: 'Henry Chen',
      region: 'South',
    },
    {
      product_id: 3,
      quantity: 2,
      total_amount: 150.0,
      customer_name: 'Ivy Wang',
      region: 'East',
    },
    {
      product_id: 1,
      quantity: 1,
      total_amount: 999.99,
      customer_name: 'Jack Taylor',
      region: 'West',
    },
  ]);
  console.log("Seeding successful");
}

seed();