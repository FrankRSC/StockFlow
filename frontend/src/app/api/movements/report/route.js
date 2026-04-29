import { NextResponse } from "next/server";

const BACKEND_URL = `${process.env.BACKEND_URL }/api/movements/report`;

export async function GET(request) {
  try {
    const token = request.headers.get("authorization");
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const url = new URL(BACKEND_URL);
    if (startDate) url.searchParams.append("startDate", startDate);
    if (endDate) url.searchParams.append("endDate", endDate);

    const headers = {};
    if (token) headers["Authorization"] = token;

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el reporte de movimientos" }, { status: 500 });
  }
}
