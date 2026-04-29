import { NextResponse } from "next/server";

const BACKEND_URL = "http://127.0.0.1:5000/api/movements/report";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const url = new URL(BACKEND_URL);
    if (startDate) url.searchParams.append("startDate", startDate);
    if (endDate) url.searchParams.append("endDate", endDate);

    const res = await fetch(url.toString(), {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch movements report" }, { status: 500 });
  }
}
