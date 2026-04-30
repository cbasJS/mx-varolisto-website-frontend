import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { baseUrls } from "@/lib/solicitud/infrastructure/config/apiConfig";
import type { CopomexResponse } from "@/lib/solicitud/types";

export type { CopomexResponse }

const CP_REGEX = /^\d{5}$/;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const cp = request.nextUrl.searchParams.get("cp") ?? "";

  if (!CP_REGEX.test(cp)) {
    return NextResponse.json(
      { error: "El parámetro cp debe ser un número de 5 dígitos." },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(
      `${baseUrls.copomex}/info_cp/${cp}?token=${env.copomex.token}`,
      { next: { revalidate: 86400 } },
    );
  } catch {
    return NextResponse.json({ error: "No pudimos consultar tu código postal. Intenta de nuevo en un momento." }, { status: 503 });
  }

  if (upstream.status === 404) {
    return NextResponse.json({ error: "CP no encontrado" }, { status: 404 });
  }

  if (!upstream.ok) {
    return NextResponse.json({ error: "No pudimos consultar tu código postal. Intenta de nuevo en un momento." }, { status: 503 });
  }

  const data: unknown = await upstream.json();

  if (!Array.isArray(data) || data.length === 0) {
    return NextResponse.json({ error: "CP no encontrado" }, { status: 404 });
  }

  return NextResponse.json(data as CopomexResponse[]);
}
