import { NextResponse } from "next/server";

const BACKEND_URL = `${process.env.BACKEND_URL || "http://127.0.0.1:5000"}/api/products`;

export async function GET(request) {
  try {
    const token = request.headers.get("authorization");
    const headers = {};
    if (token) headers["Authorization"] = token;

    const res = await fetch(BACKEND_URL, {
      cache: "no-store",
      headers
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get("authorization");
    const body = await request.json();
    
    const headers = {
      "Content-Type": "application/json"
    };
    if (token) headers["Authorization"] = token;

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
