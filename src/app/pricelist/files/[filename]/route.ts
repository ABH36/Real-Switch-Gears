import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Serves the pricelist PDFs from our own domain instead of linking straight
// to res.cloudinary.com — keeps the URL (and any SEO/backlink value) on our
// own site while the actual file still lives on Cloudinary.
const CLOUD_NAME = "aokdwbfg";

// Files too large for Cloudinary's free plan (>10MB) are bundled locally
// under public/pricelist-pdfs/ instead and served straight from disk.
const LOCAL_PDF_DIR = path.join(process.cwd(), "public", "pricelist-pdfs");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!/^[\w-]+\.pdf$/.test(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const localBuffer = await readFile(path.join(LOCAL_PDF_DIR, filename));
    return new NextResponse(localBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    // not a local file — fall through to Cloudinary
  }

  const upstream = await fetch(
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/pricelist/${filename}`,
    { next: { revalidate: 3600 } }
  );

  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
