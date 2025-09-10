import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SalonCard } from "@/components/salon-card"
import { Search, Scissors, Star, Users, Calendar } from "lucide-react"
import Link from "next/link"
import InstallPrompt from "@/components/install-prompt"

// Моковые данные для демонстрации
const featuredSalons = [
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
]

const stats = [
  { icon: Scissors, label: "Салонов", value: "150+" },
  { icon: Users, label: "Мастеров", value: "500+" },
  { icon: Calendar, label: "Бронирований", value: "10K+" },
  { icon: Star, label: "Средний рейтинг", value: "4.8" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero секция */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
                Найдите идеальный салон красоты в <span className="text-primary">Ташкенте</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                Бронируйте услуги в лучших салонах красоты и барбершопах города. Более 150 салонов и 500 мастеров к
                вашим услугам.
              </p>
            </div>

            {/* Поиск */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2 p-2 bg-card rounded-lg border border-border shadow-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по названию салона или услуге..."
                    className="pl-10 border-0 bg-transparent focus:ring-0 text-base"
                  />
                </div>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  Найти
                </Button>
              </div>
            </div>

            {/* Популярные категории */}
            <div className="flex flex-wrap justify-center gap-3">
              {["Стрижка", "Маникюр", "Окрашивание", "Массаж", "Косметология"].map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-card hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Рекомендуемые салоны */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Рекомендуемые салоны</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Лучшие салоны красоты с высокими рейтингами и отличными отзывами
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSalons.map((salon) => (
                <SalonCard key={salon.id} salon={salon} />
              ))}
            </div>

            <div className="text-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Link href="/salons">Посмотреть все салоны</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Как это работает</h2>
              <p className="text-lg text-muted-foreground">Простой процесс бронирования в 3 шага</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Выберите салон",
                  description: "Найдите подходящий салон по местоположению, услугам и рейтингу",
                  icon: Search,
                },
                {
                  step: "2",
                  title: "Забронируйте время",
                  description: "Выберите удобное время и мастера для нужной вам услуги",
                  icon: Calendar,
                },
                {
                  step: "3",
                  title: "Приходите и наслаждайтесь",
                  description: "Приходите в назначенное время и получайте качественные услуги",
                  icon: Star,
                },
              ].map((item, index) => (
                <Card key={index} className="text-center border-border bg-card">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-primary-foreground font-bold">{item.step}</span>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Готовы преобразиться?</h2>
            <p className="text-lg text-primary-foreground/90">
              Присоединяйтесь к тысячам довольных клиентов и найдите своего идеального мастера уже сегодня
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90"
              >
                <Link href="/salons">Найти салон</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                <Link href="/auth/register">Создать аккаунт</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">LocalBook</span>
              </div>
              <p className="text-muted-foreground">
                Платформа для онлайн бронирования услуг салонов красоты в Узбекистане
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Компания</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                  О нас
                </Link>
                <Link href="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                  Контакты
                </Link>
                <Link href="/careers" className="block text-muted-foreground hover:text-primary transition-colors">
                  Карьера
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Для салонов</h3>
              <div className="space-y-2">
                <Link
                  href="/salon-registration"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Регистрация салона
                </Link>
                <Link
                  href="/salon-dashboard"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Панель управления
                </Link>
                <Link href="/pricing" className="block text-muted-foreground hover:text-primary transition-colors">
                  Тарифы
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Поддержка</h3>
              <div className="space-y-2">
                <Link href="/help" className="block text-muted-foreground hover:text-primary transition-colors">
                  Помощь
                </Link>
                <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                  Конфиденциальность
                </Link>
                <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                  Условия использования
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 LocalBook. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <InstallPrompt />
    </div>
  )
}
