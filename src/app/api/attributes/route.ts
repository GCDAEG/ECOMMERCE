import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// ----------------------------------------------------
// GET → obtiene los atributos (con o sin valores)
// ----------------------------------------------------
export async function GET() {

  try {
    
    const supabase = await supabaseServer();

    // Trae atributos y sus valores
    const { data, error } = await supabase
      .from("attributes")
      .select(`
        id,
        name,
        attribute_values (
          id,
          value
        )
      `);

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });

  } catch (err: any) {
    console.error("GET ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Error obteniendo atributos" },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// POST → crea un atributo o un valor de atributo
// body.type = "attribute" | "value"
// ----------------------------------------------------
export async function POST(req: Request) {
    
  try{
    
    const  { name } = await req.json()
      if (!name) {
        return NextResponse.json({message:"No se coloco el nombre del atributo"}, { status:403 })
      }
      const supabase = await supabaseServer()
      const {data, error} = await supabase.from("attributes").insert([{name:name}]).select().single()

      if (error) throw error;
      
      return NextResponse.json({message:data}, {status: 200})
  }catch(error:any){
    console.log("Hubo un error al crear el atributo", error.message)
    return NextResponse.json({error: "No se pudo crear el atributo"}, {status:500})
  }

}
