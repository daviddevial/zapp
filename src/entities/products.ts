import { Product } from "../types";
import { query } from "../utils/database";
import { logger } from "../utils/logger";

// Function to get a single product by its ID
export async function getProductById(productId: string): Promise<Product> {
  logger.info('Getting product by id')
  const [product] = await query<Product>(`
    SELECT * FROM products WHERE id = ?;
  `, [productId])
  return product
}
