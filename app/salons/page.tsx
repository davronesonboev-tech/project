import { Navigation } from "@/components/navigation"
import { SalonCard } from "@/components/salon-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Star } from "lucide-react"

// Расширенные моковые данные
const allSalons = [
  {
    id: "1",
    name: "Beauty Studio Elegance",
    description:
      "Премиальный салон красоты с полным спектром услуг. Профессиональные мастера и современное оборудование.",
    address: "ул. Амира Темура, 15, Ташкент",
    rating: 4.8,
    reviews_count: 127,
    images: ["/luxury-beauty-salon.png"],
    working_hours: {
      monday: { open: "09:00", close: "20:00" },
      tuesday: { open: "09:00", close: "20:00" },
      wednesday: { open: "09:00", close: "20:00" },
      thursday: { open: "09:00", close: "20:00" },
      friday: { open: "09:00", close: "20:00" },
      saturday: { open: "10:00", close: "18:00" },
      sunday: { open: "10:00", close: "18:00" },
    },
  },
  {
    id: "2",
    name: "Barbershop Classic",
    description: "Классический мужской барбершоп. Стрижки, бритье, уход за бородой от опытных мастеров.",
    address: "пр. Шахрисабз, 42, Ташкент",
    rating: 4.6,
    reviews_count: 89,
    images: ["/classic-barbershop.png"],
    working_hours: {
      monday: { open: "10:00", close: "21:00" },
      tuesday: { open: "10:00", close: "21:00" },
      wednesday: { open: "10:00", close: "21:00" },
      thursday: { open: "10:00", close: "21:00" },
      friday: { open: "10:00", close: "21:00" },
      saturday: { open: "09:00", close: "19:00" },
      sunday: { open: "11:00", close: "18:00" },
    },
  },
  {
    id: "3",
    name: "Nail Art Studio",
    description: "Специализируемся на маникюре, педикюре и nail-арте. Используем только качественные материалы.",
    address: "ул. Бабура, 8, Ташкент",
    rating: 4.9,
    reviews_count: 156,
    images: ["/nail-art-studio-interior.jpg"],
    working_hours: {
      monday: { open: "09:00", close: "19:00" },
      tuesday: { open: "09:00", close: "19:00" },
      wednesday: { open: "09:00", close: "19:00" },
      thursday: { open: "09:00", close: "19:00" },
      friday: { open: "09:00", close: "19:00" },
      saturday: { open: "10:00", close: "17:00" },
      sunday: { open: "10:00", close: "17:00" },
    },
  },
  {
    id: "4",
    name: "Hair & Style",
    description: "Современный салон для всей семьи. Стрижки, укладки, окрашивание волос любой сложности.",
    address: "ул. Навои, 23, Ташкент",
    rating: 4.7,
    reviews_count: 203,
    images: ["/modern-hair-salon.png"],
    working_hours: {
      monday: { open: "08:00", close: "20:00" },
      tuesday: { open: "08:00", close: "20:00" },
      wednesday: { open: "08:00", close: "20:00" },
      thursday: { open: "08:00", close: "20:00" },
      friday: { open: "08:00", close: "20:00" },
      saturday: { open: "09:00", close: "19:00" },
      sunday: { open: "10:00", close: "18:00" },
    },
  },
  {
    id: "5",
    name: "Spa Relax",
    description: "Спа-салон с полным комплексом расслабляющих процедур. Массаж, косметология, уход за телом.",
    address: "ул. Мустакиллик, 67, Ташкент",
    rating: 4.5,
    reviews_count: 78,
    images: ["/spa-salon-interior.png"],
    working_hours: {
      monday: { open: "10:00", close: "22:00" },
      tuesday: { open: "10:00", close: "22:00" },
      wednesday: { open: "10:00", close: "22:00" },
      thursday: { open: "10:00", close: "22:00" },
      friday: { open: "10:00", close: "22:00" },
      saturday: { open: "09:00", close: "21:00" },
      sunday: { open: "10:00", close: "20:00" },
    },
  },
  {
    id: "6",
    name: "Beauty Corner",
    description: "Уютный салон красоты в центре города. Индивидуальный подход к каждому клиенту.",
    address: "ул. Алишера Навои, 12, Ташкент",
    rating: 4.4,
    reviews_count: 95,
    images: ["/cozy-beauty-salon.png"],
    working_hours: {
      monday: { open: "09:00", close: "19:00" },
      tuesday: { open: "09:00", close: "19:00" },
      wednesday: { open: "09:00", close: "19:00" },
      thursday: { open: "09:00", close: "19:00" },
      friday: { open: "09:00", close: "19:00" },
      saturday: { open: "10:00", close: "18:00" },
      sunday: { open: "11:00", close: "17:00" },
    },
  },
]

const categories = ["Все", "Стрижка", "Маникюр", "Окрашивание", "Массаж", "Косметология", "Барбершоп"]
const districts = ["Все районы", "Мирзо-Улугбекский", "Шайхантахурский", "Яшнабадский", "Юнусабадский"]

export default function SalonsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Заголовок и поиск */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Салоны красоты в Ташкенте</h1>
              <p className="text-lg text-muted-foreground">Найдено {allSalons.length} салонов</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по названию салона или услуге..."
                    className="pl-10 bg-input border-border focus:ring-ring h-12"
                  />
                </div>
              </div>
              <Button variant="outline" className="bg-transparent border-border hover:bg-card">
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Боковая панель с фильтрами */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Фильтры
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Категории услуг */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-card-foreground">Категории</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={category === "Все" ? "default" : "secondary"}
                          className={`w-full justify-start cursor-pointer transition-colors ${
                            category === "Все"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Районы */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-card-foreground">Район</h3>
                    <div className="space-y-2">
                      {districts.map((district) => (
                        <Badge
                          key={district}
                          variant={district === "Все районы" ? "default" : "secondary"}
                          className={`w-full justify-start cursor-pointer transition-colors text-xs ${
                            district === "Все районы"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          {district}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Рейтинг */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-card-foreground">Рейтинг</h3>
                    <div className="space-y-2">
                      {[5, 4, 3].map((rating) => (
                        <div
                          key={rating}
                          className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                        >
                          <div className="flex items-center">
                            {Array.from({ length: rating }, (_, i) => (
                              <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                            ))}
                            {Array.from({ length: 5 - rating }, (_, i) => (
                              <Star key={i} className="w-4 h-4 text-muted-foreground" />
                            ))}
                          </div>
                          <span className="text-sm">и выше</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Список салонов */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allSalons.map((salon) => (
                  <SalonCard key={salon.id} salon={salon} />
                ))}
              </div>

              {/* Пагинация */}
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" disabled className="bg-transparent">
                    Предыдущая
                  </Button>
                  <Button variant="default" className="bg-primary text-primary-foreground">
                    1
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    2
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    3
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    Следующая
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
