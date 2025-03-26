// // This is your drizzle schema file.

// import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   name: text("name").default("not_provided"),
//   email: text("email").notNull(),
// });

// export const schema = {
//   users,
// };
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").default("not_provided"),
  email: text("email").notNull(),
});

export const raffles = sqliteTable("raffles", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  numberCount: integer("numberCount").notNull(),
  pricePerNumber: integer("pricePerNumber").notNull(),
});

export const schema = {
  users,
  raffles,
};
