"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Users, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "join">("create");
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  const handleCreateRoom = () => {
    setModalType("create");
    setIsModalOpen(true);
  };

  const handleJoinRoom = () => {
    setModalType("join");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && roomName.trim()) {
      // Navigate to meeting room with parameters
      router.push(
        `/room/${encodeURIComponent(roomName)}?user=${encodeURIComponent(
          userName
        )}`
      );
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserName("");
    setRoomName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center flex-col gap-4 text-center mb-12">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
              <Video className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">LinkUp</h1>
          </div>
          <p className="text-lg text-zinc-300 max-w-md mx-auto">
            Comece ou participe de uma reunião por vídeo com apenas alguns
            cliques
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-zinc-800 hover:bg-zinc-750">
            <CardContent className="p-8 text-center">
              <div className="bg-blue-900/20 p-4 rounded-full w-16 h-16 mx-auto mb-6 group-hover:bg-blue-900/30 transition-colors">
                <Plus className="h-8 w-8 text-blue-600 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">
                Criar uma sala
              </h3>
              <p className="text-zinc-300 mb-6">
                Inicie uma nova reunião e convide outras pessoas para participar
              </p>
              <Button
                onClick={handleCreateRoom}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Criar Sala
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-zinc-800 hover:bg-zinc-750">
            <CardContent className="p-8 text-center">
              <div className="bg-green-900/20 p-4 rounded-full w-16 h-16 mx-auto mb-6 group-hover:bg-green-900/30 transition-colors">
                <Users className="h-8 w-8 text-green-600 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">
                Participar de uma sala
              </h3>
              <p className="text-zinc-300 mb-6">
                Entre em uma reunião existente usando o código da sala
              </p>
              <Button
                onClick={handleJoinRoom}
                variant="outline"
                className="w-full border-2 border-green-600 bg-transparent hover:border-green-500 hover:bg-green-900/20 hover:text-green-500 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Participar da Sala
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-light text-center text-white">
                {modalType === "create" ? "Criar Sala" : "Participar da Sala"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-zinc-200 font-medium">
                  Seu Nome
                </Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Digite seu nome"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="border-zinc-600 bg-zinc-700 text-white placeholder:text-zinc-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl py-3"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomName" className="text-zinc-200 font-medium">
                  {modalType === "create" ? "Nome da Sala" : "Código da Sala"}
                </Label>
                <Input
                  id="roomName"
                  type="text"
                  placeholder={
                    modalType === "create"
                      ? "Digite o nome da sala"
                      : "Digite o código da sala"
                  }
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="border-zinc-600 bg-zinc-700 text-white placeholder:text-zinc-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl py-3"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="flex-1 border-zinc-600 bg-zinc-700 text-white hover:bg-zinc-600 rounded-xl py-3"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
                >
                  {modalType === "create" ? "Criar" : "Entrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
