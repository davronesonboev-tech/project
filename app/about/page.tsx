import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scissors, Users, Star, Calendar, Heart, Target, Zap, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Заголовок */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              О LocalBook
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Мы создаем удобную платформу для связи клиентов с лучшими салонами красоты Ташкента
            </p>
          </div>

          {/* Наша миссия */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Наша миссия</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-lg text-muted-foreground">
                Сделать процесс поиска и бронирования услуг красоты максимально простым и удобным,
                объединяя тысячи клиентов с профессиональными мастерами Ташкента.
              </p>
            </CardContent>
          </Card>

          {/* Преимущества */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border bg-card text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Простота</h3>
                <p className="text-sm text-muted-foreground">
                  Легко найти и забронировать нужную услугу за несколько кликов
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Надежность</h3>
                <p className="text-sm text-muted-foreground">
                  Только проверенные салоны и опытные мастера
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Скорость</h3>
                <p className="text-sm text-muted-foreground">
                  Мгновенное бронирование без ожидания и звонков
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Удобство</h3>
                <p className="text-sm text-muted-foreground">
                  Доступно 24/7 с любого устройства
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Салонов</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Мастера</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Бронирований</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground">Средний рейтинг</div>
            </div>
          </div>

          {/* Как это работает */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Как мы работаем</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Scissors className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">1. Выбор салона</h3>
                  <p className="text-sm text-muted-foreground">
                    Найдите подходящий салон по рейтингу, отзывам и расположению
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">2. Бронирование</h3>
                  <p className="text-sm text-muted-foreground">
                    Выберите удобное время и мастера для нужной услуги
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Star className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">3. Посещение</h3>
                  <p className="text-sm text-muted-foreground">
                    Приходите в назначенное время и наслаждайтесь качественными услугами
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Призыв к действию */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              Готовы начать?
            </h2>
            <p className="text-lg text-muted-foreground">
              Присоединяйтесь к тысячам довольных клиентов LocalBook
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="/salons">Найти салон</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <a href="/auth/register">Создать аккаунт</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
