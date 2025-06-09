"use client";

import type React from "react";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  MessageSquare,
  Users,
  Send,
  Settings,
  MoreVertical,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
}

export default function MeetingRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = params.roomId as string;
  const userName = searchParams.get("user") || "Anonymous";

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", name: userName, isAudioEnabled: true, isVideoEnabled: true },
    {
      id: "2",
      name: "Alice Johnson",
      isAudioEnabled: true,
      isVideoEnabled: true,
    },
    { id: "3", name: "Bob Smith", isAudioEnabled: false, isVideoEnabled: true },
    {
      id: "4",
      name: "Carol Davis",
      isAudioEnabled: true,
      isVideoEnabled: false,
    },
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Alice Johnson",
      message: "Hello everyone!",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      sender: "Bob Smith",
      message: "Great to see you all",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: "3",
      sender: "Carol Davis",
      message: "Can everyone hear me clearly?",
      timestamp: new Date(Date.now() - 180000),
    },
  ]);

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === "1" ? { ...p, isAudioEnabled: !isAudioEnabled } : p
      )
    );
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === "1" ? { ...p, isVideoEnabled: !isVideoEnabled } : p
      )
    );
  };

  const leaveRoom = () => {
    router.push("/");
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: userName,
        message: chatMessage.trim(),
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, newMessage]);
      setChatMessage("");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-screen bg-zinc-900 flex flex-col">
      {/* Header */}
      <div className="bg-zinc-800 border-b border-zinc-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Video className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-medium text-white">
              {decodeURIComponent(roomId)}
            </h1>
            <p className="text-sm text-zinc-300">
              {participants.length} participants
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-zinc-300">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-zinc-300">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 p-6">
          <div className="h-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {participants.map((participant) => (
              <Card
                key={participant.id}
                className="relative bg-zinc-800 border-zinc-700 overflow-hidden"
              >
                <CardContent className="p-0 h-full">
                  <div className="relative h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                    {participant.isVideoEnabled ? (
                      <div className="w-full h-full bg-zinc-600 flex items-center justify-center">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-lg">
                            {participant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-zinc-600 rounded-full flex items-center justify-center mb-2">
                          <VideoOff className="h-6 w-6 text-zinc-400" />
                        </div>
                        <span className="text-zinc-300 text-sm">
                          Camera off
                        </span>
                      </div>
                    )}

                    {/* Participant Info */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                        {participant.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        {!participant.isAudioEnabled && (
                          <div className="bg-red-500 p-1 rounded">
                            <MicOff className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-zinc-800 border-l border-zinc-700 flex flex-col">
          {/* Sidebar Tabs */}
          <div className="border-b border-zinc-700 flex">
            <Button
              variant={!isChatOpen ? "default" : "ghost"}
              onClick={() => setIsChatOpen(false)}
              className="flex-1 text-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
            >
              <Users className="h-4 w-4 mr-2" />
              Participants
            </Button>
            <Button
              variant={isChatOpen ? "default" : "ghost"}
              onClick={() => setIsChatOpen(true)}
              className="flex-1 text-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 flex flex-col">
            {!isChatOpen ? (
              /* Participants List */
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-700"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {participant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium">
                          {participant.name}
                        </span>
                        {participant.name === userName && (
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {participant.isAudioEnabled ? (
                          <Mic className="h-4 w-4 text-green-500" />
                        ) : (
                          <MicOff className="h-4 w-4 text-red-500" />
                        )}
                        {participant.isVideoEnabled ? (
                          <Video className="h-4 w-4 text-green-500" />
                        ) : (
                          <VideoOff className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              /* Chat */
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">
                            {message.sender}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-200 bg-zinc-700 p-2 rounded-lg">
                          {message.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-zinc-600">
                  <form onSubmit={sendMessage} className="flex space-x-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!chatMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-zinc-800 border-t border-zinc-700 px-6 py-4">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isAudioEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-12 h-12 p-0"
          >
            {isAudioEnabled ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant={isVideoEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-12 h-12 p-0"
          >
            {isVideoEnabled ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={leaveRoom}
            className="rounded-full w-12 h-12 p-0 bg-red-500 hover:bg-red-600"
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
