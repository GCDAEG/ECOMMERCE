"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [messageError, setMessageError] = useState<string>("");
  const supabase = createClient();

  useEffect(() => {
    async function confirm() {
      const token = new URLSearchParams(window.location.search).get(
        "token_hash"
      );
      console.log(token);
      if (!token) {
        setStatus("error");
        return;
      }

      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "email",
      });

      if (error) {
        setStatus("error");
        setMessageError(error.message);
        return;
      }

      setStatus("success");
      // Aquí podrías redirigir al usuario si quisieras
      // setTimeout(redirect("/"), 2000);
    }

    confirm();
  }, []);

  if (status === "loading") return <p>Verificando…</p>;
  if (status === "error")
    return (
      <div className="bg-black w-full h-screen flex justify-center items-center">
        <p>Error al verificar el correo {messageError || "FALOPA"}</p>
      </div>
    );
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Spinner className="w-52 h-52"></Spinner>
      <p>
        <span className="font-bold text-green-500">Correo verificado</span>,
        redirigiendo…
      </p>
    </div>
  );
}
