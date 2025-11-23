"use client";
import React, { useEffect, useState } from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { useStore } from "@/lib/stores/useStore";
interface LoginFormProps {}
const supabase = createClient();
const LoginForm: React.FC<LoginFormProps> = ({}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      const user = data.user;
      useStore.getState().setUser({
        id: user.id,
        email: user.email!,
      });
      router.push("/");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-2 w-80 md:w-96 rounded-md">
      <FieldSet>
        <FieldLegend>Login</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="name"
              autoComplete="off"
              placeholder="example@example.com"
              required
              type="email"
              onChange={(e) => setEmail(e.currentTarget.value)}
              value={email}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              autoComplete="off"
              required
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.currentTarget.value)}
              value={password}
            ></Input>
          </Field>
          <Field>
            {error && <FieldError>{error}</FieldError>}
            <Button
              type="submit"
              className=" hover:text-blue-400 p-2 bg-slate-800 rounded-md text-gray-50"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
            <p>¿No tienes cuenta?</p>
            <Link href={"/auth/sign-up"} className="text-blue-400 ">
              Registrate
            </Link>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default LoginForm;
