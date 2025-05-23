"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, X, MessageCircle } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { ChatInterface } from "@/components/chat-interface"
import { BabysitterCard } from "@/components/babysitter-card"
import { ProfileMenu } from "@/components/profile-menu"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentBabysitterIndex, setCurrentBabysitterIndex] = useState(0)
  const [matches, setMatches] = useState<any[]>([])

  // Mock data de babás
  const babysitters = [
    {
      id: 1,
      name: "Maria Silva",
      age: 28,
      experience: "5 anos",
      location: "São Paulo, SP",
      bio: "Adoro crianças e tenho experiência com bebês e crianças até 10 anos.",
      image: "/placeholder.svg?height=400&width=300",
      hourlyRate: "R$ 50/hora",
      skills: ["Primeiros socorros", "Pedagogia", "Recreação"],
    },
    {
      id: 2,
      name: "Ana Santos",
      age: 32,
      experience: "8 anos",
      location: "Rio de Janeiro, RJ",
      bio: "Formada em pedagogia, especializada em desenvolvimento infantil.",
      image: "/placeholder.svg?height=400&width=300",
      hourlyRate: "R$ 60/hora",
      skills: ["Pedagogia", "Música", "Inglês"],
    },
    {
      id: 3,
      name: "Carla Oliveira",
      age: 25,
      experience: "3 anos",
      location: "Belo Horizonte, MG",
      bio: "Estudante de psicologia com paixão por cuidar de crianças.",
      image: "/placeholder.svg?height=400&width=300",
      hourlyRate: "R$ 45/hora",
      skills: ["Psicologia infantil", "Jogos educativos", "Culinária"],
    },
  ]

  const handleLogin = (email: string, password: string) => {
    // Simulação de login
    setCurrentUser({ email, name: email.split("@")[0] })
    setIsAuthenticated(true)
  }

  const handleRegister = (data: any) => {
    // Simulação de registro
    setCurrentUser({ ...data })
    setIsAuthenticated(true)
  }

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right" && currentBabysitterIndex < babysitters.length) {
      setMatches([...matches, babysitters[currentBabysitterIndex]])
    }

    if (currentBabysitterIndex < babysitters.length - 1) {
      setCurrentBabysitterIndex(currentBabysitterIndex + 1)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setShowChat(false)
    setCurrentBabysitterIndex(0)
    setMatches([])
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">BabáMatch</h1>
              <p className="text-gray-600">Encontre a babá perfeita para sua família</p>
            </div>

            {showLogin ? (
              <>
                <LoginForm onLogin={handleLogin} />
                <p className="text-center mt-4 text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <button onClick={() => setShowLogin(false)} className="text-blue-600 hover:underline font-medium">
                    Cadastre-se
                  </button>
                </p>
              </>
            ) : (
              <>
                <RegisterForm onRegister={handleRegister} />
                <p className="text-center mt-4 text-sm text-gray-600">
                  Já tem uma conta?{" "}
                  <button onClick={() => setShowLogin(true)} className="text-blue-600 hover:underline font-medium">
                    Faça login
                  </button>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showChat) {
    return <ChatInterface matches={matches} currentUser={currentUser} onBack={() => setShowChat(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">BabáMatch</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setShowChat(true)} className="relative">
                <MessageCircle className="h-5 w-5" />
                {matches.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {matches.length}
                  </span>
                )}
              </Button>
              <ProfileMenu currentUser={currentUser} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {currentBabysitterIndex < babysitters.length ? (
          <div className="relative">
            <BabysitterCard babysitter={babysitters[currentBabysitterIndex]} />

            <div className="flex justify-center gap-4 mt-6">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-16 w-16 border-2 border-red-500 hover:bg-red-50"
                onClick={() => handleSwipe("left")}
              >
                <X className="h-8 w-8 text-red-500" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-16 w-16 border-2 border-green-500 hover:bg-green-50"
                onClick={() => handleSwipe("right")}
              >
                <Heart className="h-8 w-8 text-green-500" />
              </Button>
            </div>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Você viu todas as babás disponíveis!</h2>
            <p className="text-gray-600 mb-6">Verifique seus matches ou volte mais tarde para ver novas babás.</p>
            <Button onClick={() => setShowChat(true)} className="bg-blue-600 hover:bg-blue-700">
              Ver Matches ({matches.length})
            </Button>
          </Card>
        )}
      </main>
    </div>
  )
}
