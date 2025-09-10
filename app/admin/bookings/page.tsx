"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, CalendarIcon, CheckCircle, XCircle, AlertCircle, Phone, User } from "lucide-react"
import { cn } from "@/lib/utils"

// Моковые данные для демонстрации
const bookings = [
  {
    id: "1",
    client_name: "Анна Иванова",
    client_phone: "+998 90 123 45 67",
    service: "Женская стрижка",
    master: "Мария Петрова",
    date: "2024-12-20",
    time: "14:00",
    duration: 60,
    status: "confirmed",
    price: 150000,
    notes: "Просьба сделать каре",
    created_at: "2024-12-19T10:30:00Z",
  },
  {
    id: "2",
    client_name: "Елена Сидорова",
    client_phone: "+998 91 234 56 78",
    service: "Маникюр",
    master: "Ольга Козлова",
    date: "2024-12-20",
    time: "15:30",
    duration: 90,
    status: "pending",
    price: 80000,
    notes: "",
    created_at: "2024-12-19T14:15:00Z",
  },
  {
    id: "3",
    client_name: "Мария Николаева",
    client_phone: "+998 93 345 67 89",
    service: "Окрашивание волос",
    master: "Анна Смирнова",
    date: "2024-12-19",
    time: "16:00",
    duration: 120,
    status: "completed",
    price: 300000,
    notes: "Блонд, корни",
    created_at: "2024-12-18T09:20:00Z",
  },
  {
    id: "4",
    client_name: "Ольга Петрова",
    client_phone: "+998 94 456 78 90",
    service: "Массаж лица",
    master: "Елена Иванова",
    date: "2024-12-18",
    time: "11:00",
    duration: 45,
    status: "cancelled",
    price: 120000,
    notes: "Отменила из-за болезни",
    created_at: "2024-12-17T16:45:00Z",
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

export default function AdminBookingsPage() {
  const [filteredBookings, setFilteredBookings] = useState(bookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)

  // Фильтрация бронирований
  useEffect(() => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.master.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    if (dateFilter) {
      const filterDate = dateFilter.toISOString().split("T")[0]
      filtered = filtered.filter((booking) => booking.date === filterDate)
    }

    setFilteredBookings(filtered)
  }, [searchTerm, statusFilter, dateFilter])

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setIsLoading(true)
    try {
      // Здесь будет API вызов для обновления статуса
      console.log(`Updating booking ${bookingId} to status ${newStatus}`)
      // Обновление локального состояния для демонстрации
      setFilteredBookings((prev) =>
        prev.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)),
      )
    } catch (error) {
      console.error("Ошибка обновления статуса:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
          <div className="space-y-6">
            {/* Заголовок */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Бронирования</h1>
                <p className="text-muted-foreground">Управление записями клиентов</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Новое бронирование
              </Button>
            </div>

            {/* Фильтры */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">Фильтры</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Поиск по клиенту, услуге или мастеру..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-input border-border focus:ring-ring"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48 bg-input border-border">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="pending">Ожидает</SelectItem>
                      <SelectItem value="confirmed">Подтверждено</SelectItem>
                      <SelectItem value="completed">Завершено</SelectItem>
                      <SelectItem value="cancelled">Отменено</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full md:w-48 justify-start text-left font-normal bg-input border-border",
                          !dateFilter && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFilter ? dateFilter.toLocaleDateString("ru-RU") : "Выберите дату"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                        className="bg-popover"
                      />
                    </PopoverContent>
                  </Popover>
                  {(searchTerm || statusFilter !== "all" || dateFilter) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setStatusFilter("all")
                        setDateFilter(undefined)
                      }}
                      className="bg-transparent border-border"
                    >
                      Сбросить
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Таблица бронирований */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">Найдено бронирований: {filteredBookings.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Клиент</TableHead>
                        <TableHead>Услуга</TableHead>
                        <TableHead>Мастер</TableHead>
                        <TableHead>Дата и время</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{booking.client_name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                <span>{booking.client_phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{booking.service}</div>
                              <div className="text-sm text-muted-foreground">{booking.duration} мин</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.master}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div>{new Date(booking.date).toLocaleDateString("ru-RU")}</div>
                              <div className="text-sm text-muted-foreground">{booking.time}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell className="font-medium">{formatPrice(booking.price)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {booking.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusChange(booking.id, "confirmed")}
                                    disabled={isLoading}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Подтвердить
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(booking.id, "cancelled")}
                                    disabled={isLoading}
                                    className="bg-transparent border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                  >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Отменить
                                  </Button>
                                </>
                              )}
                              {booking.status === "confirmed" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusChange(booking.id, "completed")}
                                  disabled={isLoading}
                                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Завершить
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredBookings.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Бронирования не найдены</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
