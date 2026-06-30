import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const askBoxTable = sqliteTable("ask_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text(),
  showName: int().notNull(),
  ip: text(),
  showIP: int().notNull(),
  question: text(),
  answer: text(),
  note: text(),
  public: int().notNull().default(0),
  askedAt: int(),
  answeredAt: int(),
});
