import Elysia, { t } from "elysia";
import { askBoxTable } from "../db/schema";
import { db } from "../utils";

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

export { app as RouteAskBox };
