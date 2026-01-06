import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_req:Request, {params}){
    try{
        const {id} = await params;
        const supabase = await supabaseServer()
        const { data, error } = await supabase
  .from("product_variants")
  .select(`
    id,
    sku,
    price,
    stock,
    product_id,
    variant_values (
      id,
      attribute_value_id,
      attribute_values (
        id,
        value,
        attributes (
          id,
          name,
          attribute_values(
          id,
          value
          )
        )
      )
    )
  `)
  .eq("id", id)
  .single();

        if (error) throw error;

        const cleanVariant = {
  id: data.id,
  sku: data.sku,
  price: data.price,
  stock: data.stock,
  attributesSelected: data.variant_values.map(vv => ({
    id: vv.attribute_values.attributes.id,
    name: vv.attribute_values.attributes.name,
    selectedValue: {
      id: vv.attribute_values.id,
      value: vv.attribute_values.value
    },
    values:[...vv.attribute_values.attributes.attribute_values]
  }))
};
  console.log(cleanVariant, "AAAAAAAAAAAAAAAAAA")
        return NextResponse.json({
            data:cleanVariant
        }, {
            status:200
        })
    }catch(error){
        console.log(error, "Ocurrio un erro al querer devolver las variantes.")
        return NextResponse.json({
            error
        }, {
            status:500
        })
    }
}

export async function DELETE(_req:Request, {params}){
    try{
        const {id} = await params;
        const supabase = await supabaseServer();
        const {error} = await supabase.from("product_variants").delete().eq("id", id)

        if (error) throw error;

        console.log("Se borro la variante correctamente")
        return NextResponse.json({
            message:"Se borro correctamente",
            variantId:id
        }, {
            status:200
        })
    }catch (error) {
        console.log(error, "Ocurrio un error al borrar la variante")
        return NextResponse.json({
            error:error
        }, {
            status:500
        })
    }
}