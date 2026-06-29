import Elysia, { t } from "elysia";
import { askBoxTable } from "../db/schema";
import { db } from "../utils";
import { eq } from "drizzle-orm";
import { validateJWT } from "../plugin/auth";
import { push } from "../bot";

const app = new Elysia({ prefix: "/ask-box" });

app.use(
  new Elysia().use(validateJWT).post(
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
      push(`New question from ${body.name}: ${body.question}`);
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
  ),
);

app.get("/", async () => {
  const res = await db
    .select({
      name: askBoxTable.name,
      showName: askBoxTable.showName,
      ip: askBoxTable.ip,
      showIP: askBoxTable.showIP,
      question: askBoxTable.question,
      answer: askBoxTable.answer,
      askedAt: askBoxTable.askedAt,
      answeredAt: askBoxTable.answeredAt,
    })
    .from(askBoxTable)
    .where(eq(askBoxTable.public, 1));
  return res.map((item) => ({
    ...item,
    question: item.question || "",
    answer: item.answer || "",
    askedAt: item.askedAt,
    answeredAt: item.answeredAt !== 0 ? item.answeredAt : undefined,
  }));
});

export { app as RouteAskBox };
