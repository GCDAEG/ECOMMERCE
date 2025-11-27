import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data: products, error } = await supabase
      .from("categories")
      .select("*");

    console.log("PRODUCTS:", products);
    console.log("SUPABASE ERROR:", error);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("ROUTE ERROR:", err);
    return NextResponse.json(
      { error: "Server crashed", details: String(err) },
      { status: 500 }
    );
  }
}

//CREAR CATEGORIA

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("categories")
      .insert([
        {
          name,
          slug,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error: any) {
    console.error("Error creando producto:", error.message);
    return NextResponse.json(
      { error: "No se pudo crear el producto" },
      { status: 500 }
    );
  }
}