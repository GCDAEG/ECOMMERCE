import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function GET(_req:Request, {params}){
    try{
        const {id} = await params;
        const supabase = await supabaseServer()
        const {data, error} = await supabase.from("categories").select("id, name, slug,  products:product_categories(products(*))").eq("id", id).single()
        if (error) throw error;

        const cleanData = {
            ...data,
            products:[...data.products.map(p => ({...p.products}))]
        }
        
        return NextResponse.json({
            data:cleanData
        }, {
            status:200
        })
    }catch(error){
        console.log(error)
        return NextResponse.json({
            error
        }, {
            status:500
        })
    }
}
export async function PATCH(req: Request, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
   console.log(body, "A actualizaaaar", id)
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No se enviaron datos para actualizar." },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("categories")
      .update(body)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error;
    console.log(data, "ASDASDASDAS")
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
export async function DELETE(_req:Request, {params}){
    try{
        const {id} = await params;
        const supabase = await supabaseServer();
        const {error} = await supabase.from("categories").delete().eq("id", id)

        if (error) throw error;

        console.log("Se borro la categoria correctamente")
        return NextResponse.json({
            message:"Se borro correctamente"
        }, {
            status:200
        })
    }catch (error) {
        console.log(error, "Ocurrio un error al borrar la categoria")
        return NextResponse.json({
            error:error
        }, {
            status:500
        })
    }
}