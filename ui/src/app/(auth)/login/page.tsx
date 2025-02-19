"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/all-surveys");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { userName, password }
      );

      const successMessage = res.data.message;
      toast({
        title: "Giriş Başarılı!",
        description: successMessage,
      });

      const token = res.data.data.token;
      Cookies.set("token", token, { expires: 1 / 24 });

      const userData = {
        userName: res.data.data.user.userName,
      };
      Cookies.set("user", JSON.stringify(userData), { expires: 1 / 24 });

      router.push("/all-surveys");
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage = err.response.data.data;
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6 shadow-md">
        <h2 className="text-lg font-bold mb-4">Giriş Yap</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="Kullanıcı Adı"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button type="submit" className="w-full mb-2">
            Giriş Yap
          </Button>
        </form>
        <p className="text-center">
          Hesabınız yok mu?
          <a href="/register" className="text-blue-500 hover:underline">
            Kayıt Ol
          </a>
        </p>
      </Card>
    </div>
  );
}
