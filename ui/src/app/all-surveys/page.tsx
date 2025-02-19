"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface Survey {
  _id: string;
  title: string;
  description: string;
}

export default function AllSurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.replace("/login");
    } else {
      const fetchSurveys = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/poll/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSurveys(response.data.data);
        } catch (error) {
          console.error("Anketleri yüklerken bir hata oluştu:", error);
        }
        setLoading(false);
      };

      fetchSurveys();
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tüm Anketler</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {surveys.map((survey) => (
          <Card key={survey._id} className="p-4 shadow-md h-32">
            <h2 className="text-lg font-bold">{survey.title}</h2>
            <p className="mb-2">{survey.description}</p>
            <Button
              onClick={() => router.push(`/survey/${survey._id}`)}
              variant="outline"
              className="w-full bg-gradient-to-r from-blue-950 to-purple-800 text-white hover:bg-opacity-80"
            >
              Detayları Gör
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
