import { Database } from 'sqlite3';

// Initialize a new database instance
let db = new Database(':memory:');

// Function to query the database
export function query<T>(sql: string, args?: Array<string | string[]>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all<T>(sql, args, function (err, rows) {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

// Function to initialise database tables and insert dummy product
export async function setupDB(): Promise<void> {
  // Create issues table
  await query(`
    CREATE TABLE IF NOT EXISTS issues (id varchar PRIMARY KEY, type varchar, comment varchar, productId uuid);
  `)

  // Create products table
  await query(`
    CREATE TABLE IF NOT EXISTS products (id varchar PRIMARY KEY, name varchar, imageUrl varchar);
  `)

  // Insert dummy product data
  await query(`
    INSERT INTO products (id, name, imageUrl) VALUES ('1', 'product 1', 'example.com/1');
  `)
  await query(`
    INSERT INTO products (id, name, imageUrl) VALUES ('2', 'product 2', 'example.com/2');
  `)
}
