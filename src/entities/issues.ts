import { GraphQLError } from "graphql";
import { DBIssue, Issue, IssueType, Product } from "../types";
import { logger } from "../utils/logger";
import { getProductById } from "./products";
import { query } from "../utils/database";
import crypto from "crypto";

// Function to get all issues
export async function getIssues(): Promise<Issue[]> {
  const rows = await query<DBIssue>(`
    SELECT * FROM issues
  `)
  logger.debug('Database response rows', rows);

  const uniqueProductIds = Array.from(new Set(rows.map(row => row.productId)))
  const products = await Promise.all(uniqueProductIds.map(productId => getProductById(productId)))
  const productMap = products.reduce<Record<string, Product>>((acc, product) => ({
    ...acc,
    [product.id]: product
  }), {})
  logger.debug('Product map', productMap);

  return Promise.all(rows.map(async (row) => ({
    id: row.id,
    type: row.type,
    comment: row.comment,
    product: productMap[row.productId]
  })));
}

// Function to create an issue
export async function createIssue(type: IssueType, comment: string, productId: string): Promise<Issue> {
  const product = await getProductById(productId)
  if (!product) {
    logger.error('Error getting product');
    throw new GraphQLError('Product not found', {
      extensions: {
        code: 'PRODUCT_NOT_FOUND',
        http: {
          status: 404
        },
      },
    });
  }

  const id = crypto.randomUUID()
  await query<DBIssue>(`
    INSERT INTO issues(id, type, comment, productId) VALUES(?, ?, ?, ?);
  `, [id, type, comment, productId])
  return { id, type, comment, product }
}