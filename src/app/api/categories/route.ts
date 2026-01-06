import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, products:product_categories(product:products(*))");

    console.log("SUPABASE ERROR:", error);

    if (error) throw error;
    const cleanData = [...data.map(cat => ({
      ...cat,
      products: [...cat.products.map(product => product.product)]
    }))]
    return NextResponse.json({data:cleanData}, { status: 200 });
  } catch (error) {
    console.error("ROUTE ERROR:", error);
    return NextResponse.json(
      { error },
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