import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Phone, Calendar } from "lucide-react"
import Link from "next/link"

// Моковые данные для демонстрации
const salonData = {
  id: "1",
  name: "Beauty Studio Elegance",
  description:
    "Премиальный салон красоты с полным спектром услуг. Профессиональные мастера и современное оборудование для создания вашего идеального образа.",
  address: "ул. Амира Темура, 15, Ташкент",
  phone: "+998 90 123 45 67",
  rating: 4.8,
  reviews_count: 127,
  images: ["/luxury-beauty-salon.png", "/modern-hair-salon.png", "/spa-salon-interior.png"],
  working_hours: {
    monday: { open: "09:00", close: "20:00" },
    tuesday: { open: "09:00", close: "20:00" },
    wednesday: { open: "09:00", close: "20:00" },
    thursday: { open: "09:00", close: "20:00" },
    friday: { open: "09:00", close: "20:00" },
    saturday: { open: "10:00", close: "18:00" },
    sunday: { open: "10:00", close: "18:00" },
  },
  services: [
    {
      id: "1",
      name: "Женская стрижка",
      description: "Профессиональная стрижка с укладкой",
      price: 150000,
      duration_minutes: 60,
      category: "Стрижка",
    },
    {
      id: "2",
      name: "Окрашивание волос",
      description: "Полное окрашивание волос премиум красками",
      price: 300000,
      duration_minutes: 120,
      category: "Окрашивание",
    },
    {
      id: "3",
      name: "Маникюр",
      description: "Классический маникюр с покрытием гель-лак",
      price: 80000,
      duration_minutes: 90,
      category: "Маникюр",
    },
    {
      id: "4",
      name: "Массаж лица",
      description: "Расслабляющий массаж лица с увлажняющими средствами",
      price: 120000,
      duration_minutes: 45,
      category: "Косметология",
    },
  ],
  masters: [
    {
      id: "1",
      name: "Анна Петрова",
      specialization: "Стилист-парикмахер",
      experience_years: 8,
      rating: 4.9,
      reviews_count: 89,
      avatar_url: "/female-hairstylist.png",
    },
    {
      id: "2",
      name: "Мария Иванова",
      specialization: "Мастер маникюра",
      experience_years: 5,
      rating: 4.7,
      reviews_count: 67,
      avatar_url: "/female-nail-artist.png",
    },
    {
      id: "3",
      name: "Елена Сидорова",
      specialization: "Косметолог",
      experience_years: 12,
      rating: 4.8,
      reviews_count: 134,
      avatar_url: "/female-cosmetologist.jpg",
    },
  ],
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-accent text-accent" : "text-muted-foreground"}`}
    />
  ))
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price) + " сум"
}

const getWorkingHoursText = (hours: Record<string, { open: string; close: string }>) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
  const todayHours = hours[today]
  return todayHours ? `${todayHours.open} - ${todayHours.close}` : "Закрыто"
}

export default function SalonPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Галерея изображений */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-96">
            <div className="md:col-span-2">
              <img
                src={salonData.images[0] || "/placeholder.svg"}
                alt={salonData.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <img
                src={salonData.images[1] || "/placeholder.svg"}
                alt={`${salonData.name} интерьер`}
                className="w-full h-full object-cover rounded-lg"
              />
              <img
                src={salonData.images[2] || "/placeholder.svg"}
                alt={`${salonData.name} интерьер`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Информация о салоне */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-foreground">{salonData.name}</h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">{renderStars(salonData.rating)}</div>
                    <span className="text-sm text-muted-foreground">
                      {salonData.rating} ({salonData.reviews_count} отзывов)
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-lg">{salonData.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{salonData.address}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-5 h-5" />
                  <span>{salonData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>Сегодня: {getWorkingHoursText(salonData.working_hours)}</span>
                </div>
              </div>

              {/* Услуги */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Услуги</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {salonData.services.map((service) => (
                    <Card key={service.id} className="border-border bg-card hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <Badge variant="secondary" className="bg-accent/10 text-accent">
                            {service.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-lg font-semibold text-primary">{formatPrice(service.price)}</div>
                            <div className="text-sm text-muted-foreground">{service.duration_minutes} минут</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Мастера */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Наши мастера</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {salonData.masters.map((master) => (
                    <Card key={master.id} className="border-border bg-card">
                      <CardContent className="p-4 text-center space-y-3">
                        <img
                          src={master.avatar_url || "/placeholder.svg"}
                          alt={master.name}
                          className="w-20 h-20 rounded-full mx-auto object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-card-foreground">{master.name}</h3>
                          <p className="text-sm text-muted-foreground">{master.specialization}</p>
                          <p className="text-xs text-muted-foreground">Опыт: {master.experience_years} лет</p>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          {renderStars(master.rating)}
                          <span className="text-sm text-muted-foreground ml-1">({master.reviews_count})</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Боковая панель с бронированием */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Забронировать
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      от {formatPrice(Math.min(...salonData.services.map((s) => s.price)))}
                    </div>
                    <p className="text-sm text-muted-foreground">Выберите услугу и время для бронирования</p>
                  </div>

                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
                    <Link href={`/salons/${salonData.id}/booking`}>Забронировать сейчас</Link>
                  </Button>

                  <div className="pt-4 border-t border-border space-y-2">
                    <h4 className="font-semibold text-card-foreground">Режим работы:</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {Object.entries(salonData.working_hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize">
                            {day === "monday" && "Пн"}
                            {day === "tuesday" && "Вт"}
                            {day === "wednesday" && "Ср"}
                            {day === "thursday" && "Чт"}
                            {day === "friday" && "Пт"}
                            {day === "saturday" && "Сб"}
                            {day === "sunday" && "Вс"}
                          </span>
                          <span>
                            {hours.open} - {hours.close}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
