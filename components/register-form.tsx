"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RegisterFormProps {
  onRegister: (data: any) => void
}

export function RegisterForm({ onRegister }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "parent",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRegister(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="João Silva"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label>Tipo de usuário</Label>
        <RadioGroup
          value={formData.userType}
          onValueChange={(value) => setFormData({ ...formData, userType: value })}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="parent" id="parent" />
            <Label htmlFor="parent" className="font-normal">
              Sou pai/mãe procurando babá
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="babysitter" id="babysitter" />
            <Label htmlFor="babysitter" className="font-normal">
              Sou babá procurando trabalho
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Cadastrar
      </Button>
    </form>
  )
}
