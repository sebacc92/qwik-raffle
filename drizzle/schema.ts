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
  isPublic: integer({ mode: 'boolean' }).default(true),
  createdAt: integer("createdAt", { mode: "timestamp"}).notNull().default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(new Date())
    .$onUpdateFn(() => new Date()),
  expiresAt: integer("expiresAt", { mode: "timestamp"}).notNull().default(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
  isTemporary: integer({ mode: 'boolean' }).default(false),
});

// New table for raffle numbers
export const raffleNumbers = sqliteTable("raffleNumbers", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  raffleId: integer("raffleId").notNull().references(() => raffles.id),
  number: integer("number").notNull(),
  buyerName: text("buyerName"),
  buyerPhone: text("buyerPhone"),
  status: text("status").notNull().default("no_vendido"),
  paymentStatus: integer({ mode: 'boolean' }).default(false),
  notes: text("notes"), // Additional notes
  createdAt: integer("createdAt", { mode: "timestamp"}).notNull().default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(new Date())
    .$onUpdateFn(() => new Date()),
});

// Tabla de premios
export const prizes = sqliteTable("prizes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  raffleId: integer("raffleId").notNull().references(() => raffles.id),
  name: text("name").notNull(),
  description: text("description"),
  position: integer("position").notNull(),
  imageUrl: text("imageUrl"),
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
  numbers: many(raffleNumbers),
  prizes: many(prizes),
}));

export const raffleNumbersRelations = relations(raffleNumbers, ({ one }) => ({
  raffle: one(raffles, {
    fields: [raffleNumbers.raffleId],
    references: [raffles.id],
  }),
}));

export const prizesRelations = relations(prizes, ({ one }) => ({
  raffle: one(raffles, {
    fields: [prizes.raffleId],
    references: [raffles.id],
  }),
}));

export const schema = {
  users,
  raffles,
  raffleNumbers,
  prizes,
};
