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

export async function POST(req:Request){
    
    try{
        const {value, attribute_id} = await req.json();
        if (!value) {
            return NextResponse.json({error: "No hay valor indicado"}, {status:500})
        }
        const supabase = await supabaseServer()

        const {data, error} = await supabase.from("attribute_values").insert([{
            value,
            attribute_id
        }]).select().single()

        if (error) throw error;

        return NextResponse.json({data:data}, {status:200})
    }catch (error:any) {
        console.log(error, "Ocurrio un error")
        return NextResponse.json({error:error.message}, {status:500})
    }

}