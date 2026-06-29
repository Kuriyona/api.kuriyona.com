import Elysia, { t } from "elysia";
import { askBoxTable } from "../db/schema";
import { db } from "../utils";
import { eq } from "drizzle-orm";

const app = new Elysia({ prefix: "/ask-box" });

app.post(
  "/",
  async ({ body, headers }) => {
    const ip = headers["x-forwarded-for"] || headers["x-real-ip"] || "127.0.0.1";
    const q: typeof askBoxTable.$inferInsert = {
      name: body.name,
      showName: Number(body.showName),
      ip,
      showIP: Number(body.showIP),
      public: 0,
    };
    await db.insert(askBoxTable).values(q);
    return { message: "Success" };
  },
  {
    body: t.Object({
      name: t.String(),
      showName: t.Boolean(),
      showIP: t.Boolean(),
      question: t.String(),
    }),
  },
);

app.get("/", async () => {
  const res = await db
    .selectDistinct({
      name: askBoxTable.showName ? askBoxTable.name : {},
      ip: askBoxTable.showIP ? askBoxTable.ip : {},
      question: askBoxTable.question,
      answer: askBoxTable.answer,
    })
    .from(askBoxTable)
    .where(eq(askBoxTable.public, 1));
  return res;
});

export { app as RouteAskBox };
