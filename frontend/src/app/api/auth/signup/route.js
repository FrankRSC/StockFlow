import { NextResponse } from "next/server";

const BACKEND_URL = `${process.env.BACKEND_URL || "http://127.0.0.1:5000"}/api/auth/signup`;

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 });
  }
}
