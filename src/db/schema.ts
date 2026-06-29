import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("ask_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  showName: text().notNull(),
  email: text().notNull().unique(),
  showEmail: text().notNull(),
  ip: text().notNull(),
  createdAt: text().default("now()"),
  answer: text(),
  public: int().default(0),
});
