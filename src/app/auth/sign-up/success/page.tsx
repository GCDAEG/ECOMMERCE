"use client";

import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function VerifyEmailScreen() {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [cooldown, setCooldown] = useState(30); // ⏳ 30 segundos de espera

  // ⏱️ ↓ Regresivo automático
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return; // prevención adicional

    setLoading(true);
    setMessage(null);
    setError(null);

    const email = new URLSearchParams(window.location.search).get("email");

    if (!email) {
      setError(
        "No se pudo obtener tu email. Intenta iniciar sesión nuevamente."
      );
      setLoading(false);
      return;
    }

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (resendError) {
      setError("No se pudo reenviar el correo. Inténtalo otra vez.");
    } else {
      setMessage("Correo reenviado. Revisa tu bandeja de entrada.");
      setCooldown(30); // ⏳ reiniciamos cooldown
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <Mail className="w-20 h-20 text-blue-600 mb-4" />

      <h1 className="text-2xl font-semibold mb-2">Verifica tu correo</h1>

      <p className="text-gray-600 max-w-xs">
        Te enviamos un enlace para confirmar tu cuenta. Revisa tu bandeja de
        entrada o correo no deseado.
      </p>

      {/* Mensajes */}
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Botón */}
      <button
        onClick={handleResend}
        disabled={loading || cooldown > 0}
        className="mt-6 px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading
          ? "Enviando..."
          : cooldown > 0
          ? `Reenviar en ${cooldown}s`
          : "Reenviar correo de verificación"}
      </button>

      <Link
        href="/auth"
        className="mt-6 text-blue-500 underline text-sm hover:text-blue-700"
      >
        Ya verifiqué mi correo — Iniciar sesión
      </Link>
    </div>
  );
}
