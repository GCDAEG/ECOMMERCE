import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_req:Request, {params}){
    const {id} = await params;

    try{
        const supabase = await supabaseServer()

        const { data, error} = await supabase.from("attribute_values").select("*").eq('attribute_id', id).single()

        if (error) throw error;

        return NextResponse.json({data:data}, {status:200})
    }catch(error:any){
        console.log(error, "Ocurrio un error")
        return NextResponse.json({error:error.message}, {status:500})
    }

}

export async function DELETE(_res:Request, {params}){
    
    try{
        const {id} = await params
        
        const supabase = await supabaseServer()

        const {data, error} = await supabase.from("attribute_values").delete().eq("id", id)

        if (error) throw error;

        return NextResponse.json({data:data}, {status:200})
    }catch (error:any) {
        console.log(error, "Ocurrio un error")
        return NextResponse.json({error:error.message}, {status:500})
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
      .from("attributes_values")
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