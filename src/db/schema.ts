import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const askBoxTable = sqliteTable("ask_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  showName: int().notNull(),
  ip: text(),
  showIP: int().notNull(),
  answer: text(),
  public: int().notNull().default(0),
  createdAt: int().default(Date.now()),
});
