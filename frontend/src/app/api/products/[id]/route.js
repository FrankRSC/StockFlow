import { NextResponse } from "next/server";

const BACKEND_URL = `${process.env.BACKEND_URL }/api/products`;

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const token = request.headers.get("authorization");
    const headers = {};
    if (token) headers["Authorization"] = token;

    const res = await fetch(`${BACKEND_URL}/${id}`, {
      cache: "no-store",
      headers
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el producto" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const token = request.headers.get("authorization");
    const body = await request.json();
    
    const headers = {
      "Content-Type": "application/json"
    };
    if (token) headers["Authorization"] = token;

    const res = await fetch(`${BACKEND_URL}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar el producto" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const token = request.headers.get("authorization");
    const headers = {};
    if (token) headers["Authorization"] = token;

    const res = await fetch(`${BACKEND_URL}/${id}`, {
      method: "DELETE",
      headers
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 });
  }
}
