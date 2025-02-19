"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import Cookies from "js-cookie";

const socketUrl = process.env.NEXT_PUBLIC_API_URL;

if (!socketUrl) {
  throw new Error(
    "Socket URL is not defined. Please check your environment variables."
  );
}

const socket = io(socketUrl);

interface Option {
  text: string;
  votes: number;
}

interface Survey {
  id: number;
  title: string;
  description: string;
  options: Option[];
}

export default function SurveyDetailPage() {
  const { id } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/poll/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSurvey(response.data);
        setOptions(response.data.options);
      } catch (error) {
        console.error("Anket detayları yüklenirken bir hata oluştu:", error);
      }
    };

    fetchSurveyDetails();

    socket.on("voteUpdate", (updatedOptions: Option[]) => {
      setOptions(updatedOptions);
    });

    return () => {
      socket.off("voteUpdate");
    };
  }, [id]);

  const handleVote = () => {
    if (selectedOption) {
      socket.emit("vote", { surveyId: id, option: selectedOption });
      console.log("Seçilen seçenek:", selectedOption);
    }
  };

  if (!survey) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto flex justify-center items-center min-h-screen">
      <Card className="p-6 shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold">{survey.title}</h2>
        <p className="mb-4">{survey.description}</p>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                id={`option-${index}`}
                name="survey-option"
                value={option.text}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2"
              />
              <label htmlFor={`option-${index}`} className="text-gray-700">
                {option.text} - {option.votes} oy
              </label>
            </div>
          ))}
        </div>
        <Button
          onClick={handleVote}
          className="mt-4 w-full bg-gradient-to-r from-blue-950 to-purple-800 text-white hover:bg-opacity-80"
        >
          Oy Ver
        </Button>
        <Button
          onClick={() => window.history.back()}
          className="mt-2 w-full"
          variant="outline"
        >
          Geri Dön
        </Button>
      </Card>
    </div>
  );
}
