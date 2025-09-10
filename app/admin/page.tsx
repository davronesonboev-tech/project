import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Моковые данные для демонстрации
const analytics = {
  totalBookings: 156,
  completedBookings: 142,
  pendingBookings: 8,
  cancelledBookings: 6,
  totalRevenue: 18750000,
  averageBookingValue: 132042,
  dailyStats: [
    { date: "2024-12-14", bookings: 12, revenue: 1580000 },
    { date: "2024-12-15", bookings: 15, revenue: 1980000 },
    { date: "2024-12-16", bookings: 18, revenue: 2340000 },
    { date: "2024-12-17", bookings: 14, revenue: 1850000 },
    { date: "2024-12-18", bookings: 20, revenue: 2650000 },
    { date: "2024-12-19", bookings: 16, revenue: 2100000 },
    { date: "2024-12-20", bookings: 22, revenue: 2890000 },
  ],
}

const recentBookings = [
  {
    id: "1",
    client_name: "Анна Иванова",
    service: "Женская стрижка",
    master: "Мария Петрова",
    date: "2024-12-20",
    time: "14:00",
    status: "confirmed",
    price: 150000,
  },
  {
    id: "2",
    client_name: "Елена Сидорова",
    service: "Маникюр",
    master: "Ольга Козлова",
    date: "2024-12-20",
    time: "15:30",
    status: "pending",
    price: 80000,
  },
  {
    id: "3",
    client_name: "Мария Николаева",
    service: "Окрашивание волос",
    master: "Анна Смирнова",
    date: "2024-12-20",
    time: "16:00",
    status: "completed",
    price: 300000,
  },
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price) + " сум"
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-primary/10 text-primary border-primary/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Подтверждено
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-chart-5/10 text-chart-5 border-chart-5/20">
          <AlertCircle className="w-3 h-3 mr-1" />
          Ожидает
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-accent/10 text-accent border-accent/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Завершено
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
          <XCircle className="w-3 h-3 mr-1" />
          Отменено
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
          <div className="space-y-8">
            {/* Заголовок */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Дашборд</h1>
              <p className="text-muted-foreground">Обзор вашего салона за последние 30 дней</p>
            </div>

            {/* Метрики */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Всего бронирований</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{analytics.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">+12% с прошлого месяца</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Выручка</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{formatPrice(analytics.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">+8% с прошлого месяца</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Средний чек</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">
                    {formatPrice(analytics.averageBookingValue)}
                  </div>
                  <p className="text-xs text-muted-foreground">+3% с прошлого месяца</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Ожидают подтверждения</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{analytics.pendingBookings}</div>
                  <p className="text-xs text-muted-foreground">Требуют внимания</p>
                </CardContent>
              </Card>
            </div>

            {/* График и недавние бронирования */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* График бронирований за неделю */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Бронирования за неделю</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.dailyStats.map((day, index) => (
                      <div key={day.date} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-card-foreground">
                            {new Date(day.date).toLocaleDateString("ru-RU", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">{day.bookings} бронирований</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-card-foreground">{formatPrice(day.revenue)}</p>
                          <div className="w-20 h-2 bg-muted rounded-full mt-1">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${(day.bookings / Math.max(...analytics.dailyStats.map((d) => d.bookings))) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Недавние бронирования */}
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-card-foreground">Недавние бронирования</CardTitle>
                  <Button variant="outline" size="sm" className="bg-transparent border-border">
                    Посмотреть все
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-card-foreground">{booking.client_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.service} • {booking.master}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString("ru-RU")} в {booking.time}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-sm font-medium text-card-foreground">{formatPrice(booking.price)}</p>
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Быстрые действия */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-auto p-4 flex-col gap-2">
                    <Calendar className="w-6 h-6" />
                    <span>Новое бронирование</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent border-border h-auto p-4 flex-col gap-2 hover:bg-card"
                  >
                    <Users className="w-6 h-6" />
                    <span>Добавить мастера</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent border-border h-auto p-4 flex-col gap-2 hover:bg-card"
                  >
                    <TrendingUp className="w-6 h-6" />
                    <span>Посмотреть отчеты</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
