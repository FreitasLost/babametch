import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"

interface BabysitterCardProps {
  babysitter: {
    id: number
    name: string
    age: number
    experience: string
    location: string
    bio: string
    image: string
    hourlyRate: string
    skills: string[]
  }
}

export function BabysitterCard({ babysitter }: BabysitterCardProps) {
  return (
    <Card className="overflow-hidden shadow-xl">
      <div className="relative h-96">
        <img
          src={babysitter.image || "/placeholder.svg"}
          alt={babysitter.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
          <h2 className="text-2xl font-bold">
            {babysitter.name}, {babysitter.age}
          </h2>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {babysitter.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {babysitter.experience}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">{babysitter.hourlyRate}</span>
        </div>

        <p className="text-gray-700 mb-4">{babysitter.bio}</p>

        <div className="flex flex-wrap gap-2">
          {babysitter.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
