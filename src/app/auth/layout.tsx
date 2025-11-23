import "./../globals.css";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si hay session, redirigir a la Home o donde queras
  if (session) {
    redirect("/");
  }
  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        {children} {/* 👈 solo formulario, sin header */}
      </body>
    </html>
  );
}
