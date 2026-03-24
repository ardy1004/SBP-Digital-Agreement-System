import { Router, type IRouter } from "express";
import { db, agreementsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import {
  CreateAgreementBody,
  SignAgreementBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateNomor(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `SBP/${year}/${month}${day}/${random}`;
}

router.post("/agreements", async (req, res) => {
  const parsed = CreateAgreementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const id = randomUUID();
  const nomor = generateNomor();

  const [agreement] = await db
    .insert(agreementsTable)
    .values({
      id,
      nomor,
      nama_owner: data.nama_owner,
      nik: data.nik,
      alamat_owner: data.alamat_owner,
      jenis_properti: data.jenis_properti,
      luas_tanah: data.luas_tanah,
      legalitas: data.legalitas,
      alamat_properti: data.alamat_properti,
      harga_nett: data.harga_nett,
      tanggal_perjanjian: data.tanggal_perjanjian,
      status: "draft",
    })
    .returning();

  res.status(201).json(formatAgreement(agreement));
});

router.get("/agreements", async (_req, res) => {
  const agreements = await db
    .select()
    .from(agreementsTable)
    .orderBy(agreementsTable.created_at);

  res.json(agreements.map(formatAgreement));
});

router.get("/agreements/:id", async (req, res) => {
  const { id } = req.params;
  const [agreement] = await db
    .select()
    .from(agreementsTable)
    .where(eq(agreementsTable.id, id));

  if (!agreement) {
    res.status(404).json({ error: "Agreement not found" });
    return;
  }

  res.json(formatAgreement(agreement));
});

router.post("/agreements/:id/sign", async (req, res) => {
  const { id } = req.params;
  const parsed = SignAgreementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(agreementsTable)
    .where(eq(agreementsTable.id, id));

  if (!existing) {
    res.status(404).json({ error: "Agreement not found" });
    return;
  }

  if (existing.status === "signed") {
    res.status(400).json({ error: "Agreement already signed" });
    return;
  }

  const { signature_data } = parsed.data;

  const [updated] = await db
    .update(agreementsTable)
    .set({
      signature_url: signature_data,
      status: "signed",
    })
    .where(eq(agreementsTable.id, id))
    .returning();

  res.json(formatAgreement(updated));
});

function formatAgreement(a: typeof agreementsTable.$inferSelect) {
  return {
    id: a.id,
    nomor: a.nomor,
    nama_owner: a.nama_owner,
    nik: a.nik,
    alamat_owner: a.alamat_owner,
    jenis_properti: a.jenis_properti,
    luas_tanah: a.luas_tanah,
    legalitas: a.legalitas,
    alamat_properti: a.alamat_properti,
    harga_nett: a.harga_nett,
    tanggal_perjanjian: a.tanggal_perjanjian,
    signature_url: a.signature_url ?? null,
    pdf_url: a.pdf_url ?? null,
    status: a.status,
    created_at: a.created_at.toISOString(),
  };
}

export default router;
