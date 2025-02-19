"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SurveyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, options: string[], expiresAt: string) => void;
  initialTitle?: string; 
  initialOptions?: string[]; 
  initialExpiresAt?: string; 
}

const SurveyDialog: React.FC<SurveyDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [expiresAt, setExpiresAt] = useState("");

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    onSubmit(title, options, expiresAt);
    setTitle("");
    setOptions([""]);
    setExpiresAt("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogTitle>Anket Ekle</DialogTitle>
        <DialogDescription>
          Anket başlığını, seçeneklerini ve geçerlilik tarihini girin.
        </DialogDescription>
        <Input
          type="text"
          placeholder="Anket Başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
        />
        {options.map((option, index) => (
          <div key={index} className="flex mb-2">
            <Input
              type="text"
              placeholder={`Seçenek ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="mb-2"
            />
          </div>
        ))}
        <Button onClick={handleAddOption} className="mb-4">
          Seçenek Ekle
        </Button>
        <Input
          type="date"
          placeholder="Geçerlilik Tarihi"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="mb-4"
        />
        <div className="flex justify-end">
          <Button onClick={onClose} className="mr-2">
            İptal
          </Button>
          <Button onClick={handleSubmit}>Ekle</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyDialog;
