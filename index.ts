import { Elysia, t } from "elysia";
import { RouterR2 } from "./src/router/r2";
import { RouteWeather } from "./src/router/weather";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysia/jwt";
import { RouteNekoApi } from "./src/router/neko";
import { verifyTurnstile } from "./src/utils";
import { drizzle } from "drizzle-orm/bun-sqlite";

const db = drizzle(process.env.DB_FILE_NAME!);

const app = new Elysia()
  .use(
    cors({
      origin: "*",
    }),
  )
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    }),
  )
  .get("/", () => "This API site of Kuriyona.com")
  .use(RouterR2)
  .use(RouteWeather)
  .use(RouteNekoApi)
  .get(
    "/turnstile",
    async ({ jwt, query: { token } }) => {
      const result = await verifyTurnstile(token);
      if (result) {
        const value = await jwt.sign({
          pass: true,
          exp: "2h",
        });
        return value;
      }
      return null;
    },
    {
      query: t.Object({
        token: t.String(),
      }),
    },
  );

app.listen(62802);
console.log("Server is running on port 62802");
