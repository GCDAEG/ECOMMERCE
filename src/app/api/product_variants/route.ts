import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { generateSku } from "@/lib/utils";
export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data: products, error } = await supabase
      .from("product_variants")
      .select("*");

    console.log("PRODUCTS:", products);
    console.log("SUPABASE ERROR:", error);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(products, { status: 200 });
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
    const body = await req.json();
    console.log("Llega, se intenta crear la variante", body);
    const {
      productName,
      product_id,
      attributesSelected,
      sku,
      price,
      stock,
      autoSku,
    } = body;

    const supabase = await supabaseServer();

    // 1️⃣ Generar el SKU si corresponde
    const finalSku = autoSku
      ? generateSku(productName, attributesSelected)
      : sku;
    console.log("SKU FINAL", finalSku);
    if (!finalSku || !price || !stock) {
      console.log("Faltan campos obligatorios", price, stock, finalSku);
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // 2️⃣ Crear la variante
    const { data: variant, error: variantError } = await supabase
      .from("product_variants")
      .insert([
        {
          sku: finalSku,
          price,
          stock,
          product_id: product_id,
        },
      ])
      .select()
      .single();

    if (variantError) throw variantError;

    // 3️⃣ Extraer todos los attribute_value_ids seleccionados
    const valuesToInsert = attributesSelected.flatMap((att) => {
      return {
        variant_id: variant.id,
        attribute_value_id: att.selectedValue.id,
      };
    });

    // Si no seleccionó atributos, no insertar nada
    if (valuesToInsert.length > 0) {
      const { error: valuesError } = await supabase
        .from("variant_values")
        .insert(valuesToInsert);

      if (valuesError) throw valuesError;
    }

    return NextResponse.json({ variant }, { status: 201 });
  } catch (error: any) {
    console.error("Error creando la variante del producto:", error.message);
    return NextResponse.json(
      { error: "No se pudo crear la variante de producto" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    console.log(body, "Datos desde frontend");

    const {
      productName,
      product_id,
      idVariant,
      attributesSelected,
      sku,
      price,
      stock,
      editAttributes,
      autoSku, // default vacío
    } = body;

    if (!idVariant) {
      return NextResponse.json(
        { error: "Falta el ID de la variante" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // Generar SKU
    const finalSku = autoSku
      ? generateSku(productName, attributesSelected)
      : sku;

    // Validaciones básicas
    if (!price || stock === undefined || !finalSku) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: precio, stock o SKU" },
        { status: 400 }
      );
    }

    // 1. Actualizar siempre los campos básicos de la variante
    const { data: updatedVariant, error: updateError } = await supabase
      .from("product_variants")
      .update({
        sku: finalSku,
        price,
        stock,
      })
      .eq("id", idVariant)
      .select()
      .single();

    if (updateError) {
      console.error("Error actualizando product_variants:", updateError);
      throw updateError;
    }

    // 2. Solo tocar variant_values SI el frontend envía attributesSelected
    // y además es diferente a lo que ya tenía (opcional, pero recomendado)
    if (editAttributes) {
      // Opción segura: borrar e insertar solo si se enviaron atributos
      // (asumiendo que el frontend siempre envía la lista completa cuando quiere cambiarlos)

      // Borrar anteriores
      const { error: deleteError } = await supabase
        .from("variant_values")
        .delete()
        .eq("variant_id", idVariant);

      if (deleteError) {
        console.error("Error borrando variant_values:", deleteError);
        throw deleteError;
      }

      // Preparar nuevos
      const valuesToInsert = attributesSelected.map((att: any) => ({
        variant_id: idVariant,
        attribute_value_id: att.selectedValue.id, // ← asegurate de que att.id exista y sea válido
      }));

      // Insertar nuevos
      const { error: insertError } = await supabase
        .from("variant_values")
        .insert(valuesToInsert);

      if (insertError) {
        console.error("Error insertando variant_values:", insertError);
        // Este es el que te está dando el error de foreign key
        throw new Error(
          "Uno o más valores de atributo seleccionados no existen. Verifica los IDs."
        );
      }
    }
    // Si attributesSelected está vacío → no tocamos variant_values → perfecto para solo editar precio/stock

    return NextResponse.json(
      {
        data: updatedVariant,
        message: "Variante actualizada correctamente",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error actualizando la variante:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "No se pudo actualizar la variante. Posible valor de atributo inválido.",
      },
      { status: 500 }
    );
  }
}
