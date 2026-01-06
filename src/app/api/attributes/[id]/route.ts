import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_req:Request, {params}){
 const {id} = await params;

 try{
    const supabase = await supabaseServer()

 const {data,error} = await supabase.from("attributes").select(`
        id,
        name,
        attribute_values (
          id,
          value,
          attribute_id
        )
      `).eq("id", id).single()

 if (error) throw error;
 return NextResponse.json({attribute:data}, {status:200})
 }catch (error:any){
    console.log("Ocurrio un error", error)
    return NextResponse.json({
        error:"Salio mal algo "
    }, {status:500})
 }



}

// export async function PATCH(req: Request, { params }) {
//   try {
//     const { id } = await params;
//     const body = await req.json();
//    console.log(body, "A actualizaaaar", id)
//     if (!body || Object.keys(body).length === 0) {
//       return NextResponse.json(
//         { error: "No se enviaron datos para actualizar." },
//         { status: 400 }
//       );
//     }

//     const supabase = await supabaseServer();

//     const { data, error } = await supabase
//       .from("attributes")
//       .update(body)
//       .eq("id", id)
//       .select()
//       .single()

//     if (error) throw error;
//     console.log(data, "ASDASDASDAS")
//     return NextResponse.json({ data }, { status: 200 });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }


export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    console.log("GONZAAAAAAAAAAAA", "DATOS DEL FORMULARIO", body);

    const {
      id,
      name,
      newValues = [],
      deletedValueIds = [],
      // existingValues lo dejamos por si lo usas después para updates
    } = body;

    if (!id || !name?.trim()) {
      return NextResponse.json(
        { error: "ID y nombre del atributo son requeridos" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // 1. Actualizar el atributo
    const { data: attribute, error: updateError } = await supabase
      .from("attributes")
      .update({ name: name.trim() })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      throw new Error("No se pudo editar el atributo");
    }

    // 2. Borrar valores eliminados
    if (deletedValueIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("attribute_values")
        .delete()
        .in("id", deletedValueIds)
        .select(); // ← importante agregarlo

      if (deleteError) {
        // Caso específico: valor usado en variantes
        if (deleteError.code === "23503") {
          return NextResponse.json(
            {
              error:
                "No se pueden eliminar uno o más valores porque están siendo usados en variantes de productos.",
            },
            { status: 400 }
          );
        }

        // Otros errores (permisos, etc.)
        console.error("Error borrando attribute_values:", deleteError);
        throw new Error("Error al eliminar valores del atributo");
      }
    }

    // 3. Insertar nuevos valores
    let insertedValues: any[] = [];
    if (newValues.length > 0) {
      const valuesToInsert = newValues.map((value: string) => ({
        value: value.trim(),
        attribute_id: id,
      }));

      const { data: values, error: insertError } = await supabase
        .from("attribute_values")
        .insert(valuesToInsert)
        .select();

      if (insertError) {
        console.error("Error insertando valores:", insertError);
        throw new Error("No se pudieron insertar los nuevos valores");
      }

      insertedValues = values || [];
    }

    // 4. Respuesta exitosa
    return NextResponse.json(
      {
        message: "Atributo actualizado correctamente",
        data: {
          attribute,
          newValues: insertedValues,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error inesperado en PATCH attribute:", error);
    return NextResponse.json(
      {
        error: error.message || "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_req:Request, {params}) {
  try{
     const {id} = await params;
    const supabase = await supabaseServer()
    const {error:deleteError} = await supabase.from("attributes").delete().eq("id", id)

    if (deleteError) {
        // Caso específico: valor usado en variantes
        if (deleteError.code === "23503") {
          return NextResponse.json(
            {
              error:
                "No se pueden eliminar uno o más valores porque están siendo usados en variantes de productos.",
            },
            { status: 400 }
          );
        }

        // Otros errores (permisos, etc.)
        console.error("Error borrando attribute_values:", deleteError);
        throw new Error("Error al eliminar valores del atributo");
      }
   console.log("SE BORRA CREO")
    return NextResponse.json({
      message:"Parece que se borro correctamente"
    }, {
      status:200
    })
  }catch (error){
    console.log("Ocurrio un error al borrar el atributo", error)
    return NextResponse.json({
      error:error
    }, {status:500})
  }
}
