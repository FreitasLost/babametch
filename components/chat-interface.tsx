"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ChatInterfaceProps {
  matches: any[]
  currentUser: any
  onBack: () => void
}

export function ChatInterface({ matches, currentUser, onBack }: ChatInterfaceProps) {
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [messages, setMessages] = useState<{ [key: number]: any[] }>({})
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedMatch) return

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages({
      ...messages,
      [selectedMatch.id]: [...(messages[selectedMatch.id] || []), newMessage],
    })
    setInputMessage("")

    // Simular resposta automática
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        text: "Olá! Obrigada pelo interesse. Quando você precisaria dos meus serviços?",
        sender: "babysitter",
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => ({
        ...prev,
        [selectedMatch.id]: [...(prev[selectedMatch.id] || []), autoReply],
      }))
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Mensagens</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Lista de matches */}
          <div className="border-r border-gray-200 bg-white">
            <div className="p-4">
              <h2 className="font-semibold text-gray-700 mb-4">Seus Matches</h2>
              {matches.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Você ainda não tem matches</p>
              ) : (
                <div className="space-y-2">
                  {matches.map((match) => (
                    <button
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className={`w-full p-3 rounded-lg flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                        selectedMatch?.id === match.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {match.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-medium">{match.name}</p>
                        <p className="text-sm text-gray-500">{match.location}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Área de chat */}
          <div className="col-span-2 flex flex-col bg-white">
            {selectedMatch ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {selectedMatch.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedMatch.name}</h3>
                      <p className="text-sm text-gray-500">{selectedMatch.hourlyRate}</p>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {(messages[selectedMatch.id] || []).map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p>{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-gray-200">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSendMessage()
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1"
                    />
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p>Selecione uma conversa para começar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
