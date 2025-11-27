import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_req:Request, {params}){
 const {id} = await params;

 try{
    const supabase = await supabaseServer()

 const {data,error} = await supabase.from("attributes").select("*").eq("id", id).single()

 if (error) throw error;
 return NextResponse.json({attribute:data}, {status:200})
 }catch (error:any){
    console.log("Ocurrio un error", error)
    return NextResponse.json({
        error:"Salio mal algo "
    }, {status:500})
 }



}