"use client";
import React, { useState } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../field";
import { Input } from "../input";
import { Button } from "../button";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
interface SignUpProps {}

const supabase = createClient();

const SignUp: React.FC<SignUpProps> = ({}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setError("Password not match");
      setIsRegister(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:3000/auth/confirm",
        },
      });
      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error ocurred.");
    } finally {
      setIsRegister(false);
      redirect(`/auth/sign-up/success?email=${email}`);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="w-80 md:w-96 xl:w-[500px] p-2 rounded-md"
    >
      <FieldSet>
        <FieldLegend>Register</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              placeholder="email"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            ></Input>
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            ></Input>
          </Field>
          <Field>
            <FieldLabel>Repeat password</FieldLabel>
            <Input
              type="password"
              placeholder="Repeat password"
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.currentTarget.value)}
            ></Input>
          </Field>
          <Field>
            {error && <FieldError>{error}</FieldError>}
            <Button>{isRegister ? "Registrando..." : "Registrarse"}</Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default SignUp;
