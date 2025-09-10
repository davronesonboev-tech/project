import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock } from "lucide-react"

interface SalonCardProps {
  salon: {
    id: string
    name: string
    description: string
    address: string
    rating: number
    reviews_count: number
    images: string[]
    working_hours: Record<string, { open: string; close: string }>
  }
}

export function SalonCard({ salon }: SalonCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-accent text-accent" : "text-muted-foreground"}`}
      />
    ))
  }

  const getTodayHours = () => {
    const today = new Date().toLocaleLowerCase().slice(0, 3) // "mon", "tue", etc.
    const todayRu =
      {
        sun: "sunday",
        mon: "monday",
        tue: "tuesday",
        wed: "wednesday",
        thu: "thursday",
        fri: "friday",
        sat: "saturday",
      }[today] || "monday"

    const hours = salon.working_hours[todayRu]
    return hours ? `${hours.open} - ${hours.close}` : "Закрыто"
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={salon.images[0] || "/placeholder.svg?height=200&width=300&query=salon interior"}
            alt={salon.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90 text-foreground">
              <Star className="w-3 h-3 mr-1 fill-accent text-accent" />
              {salon.rating.toFixed(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {salon.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{salon.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{salon.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{getTodayHours()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {renderStars(salon.rating)}
              <span className="text-sm text-muted-foreground ml-1">({salon.reviews_count})</span>
            </div>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href={`/salons/${salon.id}`}>Подробнее</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
