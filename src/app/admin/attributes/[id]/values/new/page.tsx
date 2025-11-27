"use client";

import { useState } from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";

const supabase = createClient();

export default function CreateAttributeValueForm() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();

  const attributeId = params.id as string; // viene de /attributes/[id]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("attribute_values")
      .insert({ attribute_id: attributeId, value });

    if (error) {
      setError(error.message);
    } else {
      router.push(`/admin/attributes/${attributeId}`);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4">
      <FieldSet>
        <FieldLegend>Agregar valor</FieldLegend>

        <FieldGroup>
          <Field>
            <FieldLabel>Valor</FieldLabel>
            <Input
              placeholder="Ej: Rojo, Azul, Verde, XL..."
              required
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
            />
          </Field>

          {error && (
            <Field>
              <FieldError>{error}</FieldError>
            </Field>
          )}

          <Field>
            <Button disabled={loading} type="submit">
              {loading ? "Guardando..." : "Crear valor"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
