// This is your drizzle schema file.

// import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   name: text("name").default("not_provided"),
//   email: text("email").notNull(),
// });

// export const schema = {
//   users,
// };
import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").default("not_provided"),
  email: text("email").notNull(),
});

export const raffles = sqliteTable("raffles", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  numberCount: integer("numberCount").notNull(),
  pricePerNumber: real("pricePerNumber").notNull(),
  uuid: text("uuid").notNull().unique(),
  creatorId: integer("creatorId").references(() => users.id),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp"}).notNull().default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(new Date())
    .$onUpdateFn(() => new Date()),
  expiresAt: integer("expiresAt", { mode: "timestamp"}).notNull().default(new Date()),
  isTemporary: integer({ mode: 'boolean' }).default(false),
});

// New table for raffle numbers
export const raffleNumbers = sqliteTable("raffleNumbers", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  raffleId: integer("raffleId").notNull().references(() => raffles.id),
  number: integer("number").notNull(), // Raffle number (1, 2, 3, etc.)
  buyerName: text("buyerName"), // Name of the buyer
  buyerPhone: text("buyerPhone"), // Optional: buyer's phone number
  status: text("status").notNull().default("no_vendido"), // Status: "unsold", "sold", "pending_payment"
  paymentStatus: integer({ mode: 'boolean' }).default(false), // true if paid
  notes: text("notes"), // Additional notes
  createdAt: integer("createdAt", { mode: "timestamp"}).notNull().default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(new Date())
    .$onUpdateFn(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  raffles: many(raffles),
}));

export const rafflesRelations = relations(raffles, ({ one, many }) => ({
  creator: one(users, {
    fields: [raffles.creatorId],
    references: [users.id],
    relationName: 'creator',
  }),
  // Add relation with raffle numbers
  numbers: many(raffleNumbers),
}));

export const raffleNumbersRelations = relations(raffleNumbers, ({ one }) => ({
  raffle: one(raffles, {
    fields: [raffleNumbers.raffleId],
    references: [raffles.id],
  }),
}));

export const schema = {
  users,
  raffles,
  raffleNumbers,
};
