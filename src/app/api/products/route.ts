import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { ProductFormState } from "@/components/ui/Products/productForm";

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, price, description, slug, categories(*), product_variants (id, sku )");

    console.log("PRODUCTS:", products);
    console.log("SUPABASE ERROR:", error);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({data:products}, { status: 200 });
  } catch (err) {
    console.error("ROUTE ERROR:", err);
    return NextResponse.json(
      { error: "Server crashed", details: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: ProductFormState = await req.json();

    const { name, slug, description, price, categories = [] } = body;

    if (!name || !slug || !price) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // Crear producto
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert([
        {
          name,
          slug,
          description: description || null,
          price,
        },
      ])
      .select()
      .single();

    if (productError) throw productError;

    // Insertar categorías
    if (categories.length > 0) {
      const { error: pivotError } = await supabase
        .from("product_categories")
        .insert(
          categories.map((cat) => ({
            product_id: product.id,
            category_id: cat,
          }))
        );

      if (pivotError) throw pivotError;
    }

    return NextResponse.json({ data:product }, { status: 201 });
  } catch (error: any) {
    console.error("Error creando producto:", error.message);
    return NextResponse.json(
      { error: "No se pudo crear el producto" },
      { status: 500 }
    );
  }
}
