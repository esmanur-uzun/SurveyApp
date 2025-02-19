"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import SurveyDialog from "@/components/surveyDialog/SurveyDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import io from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_API_URL;

if (!socketUrl) {
  throw new Error(
    "Socket URL is not defined. Please check your environment variables."
  );
}

const socket = io(socketUrl);

interface Survey {
  _id: string;
  title: string;
  options: string[];
  expiresAt: string;
}

interface SurveyExpiredData {
  surveyId: string;
  message: string;
}

interface NewSurveyData {
  surveyId: string;
  title: string;
  options: string[];
  expiresAt: string;
}

export default function MySurveysPage() {
  const [surveyList, setSurveyList] = useState<Survey[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSurveys = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/poll/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSurveyList(response.data.data);
      } catch (error) {
        console.error("Anketleri yüklerken bir hata oluştu:", error);
      }
    };

    fetchSurveys();

    socket.on("surveyExpired", (data: SurveyExpiredData) => {
      toast({
        title: "Anket Süresi Doldu!",
        description: `Anketinizin süresi doldu: ${data.message}`,
      });
    });

    socket.on("newSurvey", (data: NewSurveyData) => {
      setSurveyList((prevSurveys) => [
        ...prevSurveys,
        {
          _id: data.surveyId,
          title: data.title,
          options: data.options,
          expiresAt: data.expiresAt,
        },
      ]);
      toast({
        title: "Yeni Anket Eklendi!",
        description: `Yeni anket: ${data.title}`,
      });
    });

    return () => {
      socket.off("surveyExpired");
      socket.off("newSurvey");
    };
  }, [toast]);

  const handleAddSurvey = async (
    title: string,
    options: string[],
    expiresAt: string
  ) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/poll/create-poll`,
        {
          title,
          options,
          expiresAt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newSurvey = response.data;
      setSurveyList([...surveyList, newSurvey]);
      toast({
        title: "Anket Eklendi!",
        description: "Yeni anket başarıyla eklendi.",
      });
    } catch (error) {
      console.error("Anket eklenirken bir hata oluştu:", error);
    }
  };

  const handleEditSurvey = async (
    title: string,
    options: string[],
    expiresAt: string
  ) => {
    if (selectedSurvey) {
      try {
        const token = Cookies.get("token");
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/poll/${selectedSurvey._id}`,
          {
            title,
            options,
            expiresAt,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedSurvey = response.data;
        setSurveyList((prevSurveys) =>
          prevSurveys.map((survey) =>
            survey._id === updatedSurvey._id ? updatedSurvey : survey
          )
        );
        toast({
          title: "Anket Güncellendi!",
          description: "Anket başarıyla güncellendi.",
        });
      } catch (error) {
        console.error("Anket güncellenirken bir hata oluştu:", error);
      }
    }
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/poll/${surveyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSurveyList((prevSurveys) =>
        prevSurveys.filter((survey) => survey._id !== surveyId)
      );
      toast({
        title: "Anket Silindi!",
        description: "Anket başarıyla silindi.",
      });
    } catch (error) {
      console.error("Anket silinirken bir hata oluştu:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Benim Anketlerim</h1>
      <Button onClick={() => setIsAdding(true)} className="mb-4">
        Anket Ekle
      </Button>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Başlık</th>
            <th className="border border-gray-300 p-2">Seçenekler</th>
            <th className="border border-gray-300 p-2">Geçerlilik Tarihi</th>
            <th className="border border-gray-300 p-2">Eylemler</th>
          </tr>
        </thead>
        <tbody>
          {surveyList.map((survey) => (
            <tr key={survey._id}>
              <td className="border border-gray-300 p-2">{survey.title}</td>
              <td className="border border-gray-300 p-2">
                <td className="border border-gray-300 p-2">
                  {Array.isArray(survey.options)
                    ? survey.options.join(", ")
                    : "Veri Yok"}
                </td>
              </td>
              <td className="border border-gray-300 p-2">{survey.expiresAt}</td>
              <td className="border border-gray-300 p-2">
                <Button
                  onClick={() => {
                    setSelectedSurvey(survey);
                    setIsEditing(true);
                  }}
                  className="mr-2"
                >
                  Düzenle
                </Button>
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setSelectedSurvey(survey);
                        setIsDeleteDialogOpen(true);
                      }}
                      variant="destructive"
                    >
                      Sil
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Emin misiniz?</DialogTitle>
                      <DialogDescription>
                        Bu anketi silmek istediğinize emin misiniz?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        onClick={() => setIsDeleteDialogOpen(false)}
                        className="mr-2"
                      >
                        İptal
                      </Button>
                      <Button
                        onClick={() => {
                          if (selectedSurvey) {
                            handleDeleteSurvey(selectedSurvey._id);
                          }
                          setIsDeleteDialogOpen(false);
                        }}
                      >
                        Sil
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Anket Ekleme Dialogu */}
      <SurveyDialog
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onSubmit={handleAddSurvey}
      />

      {/* Düzenleme Dialogu */}
      <SurveyDialog
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setSelectedSurvey(null);
        }}
        onSubmit={handleEditSurvey}
        initialTitle={selectedSurvey?.title}
        initialOptions={selectedSurvey?.options}
        initialExpiresAt={selectedSurvey?.expiresAt}
      />
    </div>
  );
}
