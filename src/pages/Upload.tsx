"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { assemblyAiService } from "@/services/assemblyAiService";

const supabase = createClient(
  "https://czevtnxzdaxgkjvqeogf.supabase.co", // substitua
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZXZ0bnh6ZGF4Z2tqdnFlb2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4ODY5NzksImV4cCI6MjA2MjQ2Mjk3OX0.b1B_oJtSyfFmS2jv7v2w8FjdFNFkcR2J3-JSmGeanCk" 
);

export default function UploadPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleUpload = async () => {
    if (!videoFile) {
      alert("Selecione um vídeo primeiro.");
      return;
    }

    setStatus("Enviando para o Supabase...");

    const filename = `${Date.now()}_${videoFile.name}`;
    const { data, error } = await supabase.storage
      .from("videos")
      .upload(filename, videoFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erro ao enviar vídeo:", error);
      setStatus("Erro no upload");
      return;
    }

    // Pegar URL pública do vídeo enviado
    const { data: publicUrlData } = supabase.storage
      .from("videos")
      .getPublicUrl(filename);

    const videoUrl = publicUrlData?.publicUrl;
    if (!videoUrl) {
      setStatus("Erro ao obter URL pública");
      return;
    }

    setStatus("Enviando para AssemblyAI...");

    try {
      const { transcriptionId } = await assemblyAiService.submitTranscription(
        videoUrl,
        {
          language: "pt",
          speakerDetection: true,
        }
      );

      setStatus(`Transcrição iniciada! ID: ${transcriptionId}`);
      // Aqui você pode salvar o transcriptionId no banco ou localStorage se quiser acompanhar depois
    } catch (err: any) {
      console.error("Erro na transcrição:", err);
      setStatus("Erro ao enviar para transcrição");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload de vídeo</h2>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Enviar e Transcrever
      </button>

      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}
