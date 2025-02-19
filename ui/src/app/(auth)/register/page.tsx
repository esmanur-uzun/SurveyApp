"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          fullName,
          userName,
          password,
        }
      );

      const successMessage =
        response.data.message || "Hesabınız başarıyla oluşturuldu.";
      toast({
        title: "Kayıt Başarılı!",
        description: successMessage,
      });
      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.data || "Kayıt işlemi başarısız.";
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6 shadow-md">
        <h2 className="text-lg font-bold mb-4">Kayıt Ol</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
        <form onSubmit={handleRegister}>
          <Input
            type="text"
            placeholder="Tam Ad"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mb-4"
          />
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
            Kayıt Ol
          </Button>
        </form>
        <p className="text-center">
          Zaten hesabınız var mı?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Giriş Yap
          </a>
        </p>
      </Card>
    </div>
  );
}
