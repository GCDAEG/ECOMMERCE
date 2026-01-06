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
          value,
          attribute_id
        )
      `);

    if (error) throw error;
        const cleanData = [...data.map(att => ({
          id:att.id,
          name:att.name,
          attributeValues:[...att.attribute_values.map(value => ({id:value.id, value:value.value}))]
        }))]
    return NextResponse.json({data:cleanData}, { status: 200 });

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
    const  { name, newValues } = await req.json()
      if (!name) {
        return NextResponse.json({message:"No se coloco el nombre del atributo"}, { status:403 })
      }
      const supabase = await supabaseServer()
      const {data, error} = await supabase.from("attributes").insert([{name:name}]).select(`
        id,
        name
      `).single()

      if (error) throw error;
      
      let attributeValues = []
      if (newValues) {
        const valuesToInsert = [...newValues.map(newValue => ({attribute_id:data.id, value:newValue}))]
        const {data:values} = await supabase.from("attribute_values").insert(valuesToInsert).select()

        attributeValues = values || []
      }

      const cleanData = {
        ...data,
        attributeValues
      }
      
      return NextResponse.json({data:cleanData}, {status: 200})
  }catch(error:any){
    console.log("Hubo un error al crear el atributo", error.message)
    return NextResponse.json({error: "No se pudo crear el atributo"}, {status:500})
  }

}

