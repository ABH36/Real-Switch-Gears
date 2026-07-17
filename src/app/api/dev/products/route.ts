import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ALLOWED_BRANDS = [
  "lauritz-knudsen",
  "polycab",
  "salzer",
  "gic",
  "braco",
  "newtek",
  "esbee",
  "connectwell",
];

function filePath(brand: string) {
  if (!ALLOWED_BRANDS.includes(brand)) return null;
  return path.join(process.cwd(), "src", "data", "catalog", `${brand}.products.json`);
}

export async function GET(req: Request) {
  if (process.env.NODE_ENV !== "development")
    return new NextResponse("Not found", { status: 404 });

  const brand = new URL(req.url).searchParams.get("brand") ?? "";
  const file = filePath(brand);
  if (!file) return new NextResponse("Unknown brand", { status: 400 });

  try {
    const data = await fs.readFile(file, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json([]); // file doesn't exist yet
  }
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development")
    return new NextResponse("Not found", { status: 404 });

  const brand = new URL(req.url).searchParams.get("brand") ?? "";
  const file = filePath(brand);
  if (!file) return new NextResponse("Unknown brand", { status: 400 });

  const products = await req.json();
  if (!Array.isArray(products))
    return new NextResponse("Expected an array", { status: 400 });

  await fs.writeFile(file, JSON.stringify(products, null, 2) + "\n", "utf8");
  return NextResponse.json({ ok: true, count: products.length });
}