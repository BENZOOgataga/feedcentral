import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { articlesQuerySchema } from "@/lib/validation";
import { errorToResponse, ValidationError } from "@/lib/errors";
import type { Article, PaginatedResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parsed = articlesQuerySchema.safeParse({
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
    });

    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.message);
    }

    const { category, search, page, limit } = parsed.data;
    const offset = (page - 1) * limit;

    let whereClause = "";
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      whereClause += `category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      if (whereClause) whereClause += " AND ";
      // Try full-text search first, fallback to ILIKE
      whereClause += `(
        search_vector @@ plainto_tsquery('english', $${paramIndex})
        OR title ILIKE $${paramIndex + 1}
        OR description ILIKE $${paramIndex + 1}
      )`;
      params.push(search, `%${search}%`);
      paramIndex += 2;
    }

    const finalWhere = whereClause ? `WHERE ${whereClause}` : "";

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM articles ${finalWhere}`;
    const countResult = await sql.query(countQuery, params);
    const total = parseInt(countResult.rows[0]?.total || "0");

    // Get paginated articles
    const articlesQuery = `
      SELECT id, title, description, url, source_name, source_id, category, pub_date, created_at, image_url
      FROM articles
      ${finalWhere}
      ORDER BY pub_date DESC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const articlesResult = await sql.query<Article>(articlesQuery, [
      ...params,
      limit,
      offset,
    ]);

    const response: PaginatedResponse<Article> = {
      items: articlesResult.rows,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };

    return NextResponse.json(response);
  } catch (error) {
    return errorToResponse(error);
  }
}
