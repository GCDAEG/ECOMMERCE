import { ProductFormState } from "@/components/ui/Products/productForm";
import { supabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server";

export async function GET(_req:Request, {params}){ 
    try{
        const {id} = await params
        const supabase = await supabaseServer()
        const {data, error} = await supabase.from("products").select(`
    id,
    name,
    price,
    description,
    slug,
    product_variants (
      id,
      sku,
      price,
      stock,
      variant_values (
        id,
        attribute_value_id,
        attribute_values (
          id,
          value,
          attribute:attributes(name, id)
        )
      )
    )
  `).eq("id", id).single()


        console.log("Esto se response", data)
        if (error) throw error;
        const cleanData = {
  product: {
    id: data.id,
    name: data.name,
    price: data.price,
    description: data.description
  },

  product_variants: data.product_variants.map(variant => ({
    id: variant.id,
    sku: variant.sku,
    price: variant.price,
    stock: variant.stock,

    attributes: variant.variant_values.map(vv => ({
      name: vv.attribute_values.attribute.name,
      value: vv.attribute_values.value,
      attributeId: vv.attribute_values.attribute.id,
      attributeValueId: vv.attribute_value_id
    }))
  }))
};

        return NextResponse.json({data:cleanData}, {status:200})
    }catch (error) {
        console.log("Ocurrio un error al pedir el producto", error)
        return NextResponse.json({error:error}, {status:500})
    }
}
export async function PATCH(req: Request) {
  try {
    const body: ProductFormState = await req.json();
    console.log("SE INICIA EL EDITAR, SE RECIBE", body);

    const { id, name, slug, description, price, categories = [] } = body;

    if (!id || !name || !slug || !price) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // 1️⃣ Actualizar producto
    const { data: product, error: productError } = await supabase
      .from("products")
      .update({
        name,
        slug,
        description,
        price,
      })
      .eq("id", id)
      .select('id, name, price, description, slug, categories(*), product_variants (id, sku )')
      .single();

    if (productError) throw productError;

    // 2️⃣ Borrar categorías actuales
    const { error: deleteError } = await supabase
      .from("product_categories")
      .delete()
      .eq("product_id", id);

    if (deleteError) throw deleteError;

    // 3️⃣ Insertar nuevas categorías
    let categoriesInsert = [];
    if (categories.length > 0) {
      const {data, error: insertError } = await supabase
        .from("product_categories")
        .insert(
          categories.map((cat) => ({
            product_id: id,
            category_id: cat.id,
          }))
        ).select('categories(*)');

      if (insertError) throw insertError;
      categoriesInsert = data
    }
    const cleanData = {
      ...product,
      categories:[...categoriesInsert.map(categorie => ({...categorie.categories}))]
    }
    console.log("|||||||||||||||||||||||||| CLEAAAAN DATAAA", cleanData)
    return NextResponse.json({ data: cleanData }, { status: 200 });
  } catch (error: any) {
    console.error("Error editando producto:", error.message);
    return NextResponse.json(
      { error: "No se pudo editar el producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req:Request, {params}){
    try{
        const {id} = await params;
        const supabase = await supabaseServer();
        const {error} = await supabase.from("products").delete().eq("id", id)

        if (error) throw error;

        console.log("Se borro el producto correctamente")
        return NextResponse.json({
            message:"Se borro correctamente"
        }, {
            status:200
        })
    }catch (error) {
        console.log(error, "Ocurrio un error al borrar el producto")
        return NextResponse.json({
            error:error
        }, {
            status:500
        })
    }
}