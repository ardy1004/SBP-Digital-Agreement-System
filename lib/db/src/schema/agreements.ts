import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const agreementsTable = pgTable("agreements", {
  id: text("id").primaryKey(),
  nomor: text("nomor").notNull(),
  nama_owner: text("nama_owner").notNull(),
  nik: text("nik").notNull(),
  alamat_owner: text("alamat_owner").notNull(),
  jenis_properti: text("jenis_properti").notNull(),
  luas_tanah: text("luas_tanah").notNull(),
  legalitas: text("legalitas").notNull(),
  alamat_properti: text("alamat_properti").notNull(),
  harga_nett: text("harga_nett").notNull(),
  tanggal_perjanjian: text("tanggal_perjanjian").notNull(),
  signature_url: text("signature_url"),
  pdf_url: text("pdf_url"),
  status: text("status").notNull().default("draft"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertAgreementSchema = createInsertSchema(agreementsTable).omit({
  id: true,
  nomor: true,
  created_at: true,
  status: true,
  signature_url: true,
  pdf_url: true,
});

export type InsertAgreement = z.infer<typeof insertAgreementSchema>;
export type Agreement = typeof agreementsTable.$inferSelect;
