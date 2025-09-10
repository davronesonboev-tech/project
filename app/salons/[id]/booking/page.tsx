"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { BookingProgress } from "@/components/booking-progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Star, Clock, CalendarIcon, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Моковые данные (в реальном приложении будут загружаться с сервера)
const salonData = {
  id: "1",
  name: "Beauty Studio Elegance",
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
  ],
  masters: [
    {
      id: "1",
      name: "Анна Петрова",
      specialization: "Стилист-парикмахер",
      rating: 4.9,
      reviews_count: 89,
      avatar_url: "/female-hairstylist.png",
    },
    {
      id: "2",
      name: "Мария Иванова",
      specialization: "Мастер маникюра",
      rating: 4.7,
      reviews_count: 67,
      avatar_url: "/female-nail-artist.png",
    },
  ],
}

const steps = ["Услуга", "Мастер", "Дата и время", "Данные", "Подтверждение"]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price) + " сум"
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-accent text-accent" : "text-muted-foreground"}`}
    />
  ))
}

export default function BookingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedMaster, setSelectedMaster] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [clientData, setClientData] = useState({
    name: "",
    phone: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загрузка доступных временных слотов
  useEffect(() => {
    if (selectedMaster && selectedDate) {
      fetchAvailableSlots()
    }
  }, [selectedMaster, selectedDate])

  const fetchAvailableSlots = async () => {
    try {
      const dateString = selectedDate?.toISOString().split("T")[0]
      const response = await fetch(
        `/api/salons/${salonData.id}/availability?master_id=${selectedMaster.id}&date=${dateString}`,
      )
      const data = await response.json()
      setAvailableSlots(data.availableSlots || [])
    } catch (error) {
      console.error("Ошибка загрузки доступных слотов:", error)
      setAvailableSlots([])
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBooking = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const endTime = new Date(`2000-01-01T${selectedTime}:00`)
      endTime.setMinutes(endTime.getMinutes() + selectedService.duration_minutes)

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salon_id: salonData.id,
          master_id: selectedMaster.id,
          service_id: selectedService.id,
          booking_date: selectedDate?.toISOString().split("T")[0],
          start_time: selectedTime,
          end_time: endTime.toTimeString().slice(0, 5),
          notes: clientData.notes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка создания бронирования")
      }

      // Переход к подтверждению
      setCurrentStep(4)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedService !== null
      case 1:
        return selectedMaster !== null
      case 2:
        return selectedDate && selectedTime
      case 3:
        return clientData.name && clientData.phone
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Бронирование в {salonData.name}</h1>
            <BookingProgress currentStep={currentStep} steps={steps} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Основной контент */}
            <div className="lg:col-span-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>{steps[currentStep]}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Шаг 1: Выбор услуги */}
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Выберите услугу, которую хотите забронировать:</p>
                      <div className="grid grid-cols-1 gap-4">
                        {salonData.services.map((service) => (
                          <div
                            key={service.id}
                            className={cn(
                              "p-4 border rounded-lg cursor-pointer transition-all",
                              selectedService?.id === service.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50",
                            )}
                            onClick={() => setSelectedService(service)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h3 className="font-semibold text-card-foreground">{service.name}</h3>
                                <p className="text-sm text-muted-foreground">{service.description}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {service.duration_minutes} мин
                                  </span>
                                  <Badge variant="secondary">{service.category}</Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-primary">{formatPrice(service.price)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Шаг 2: Выбор мастера */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Выберите мастера:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {salonData.masters.map((master) => (
                          <div
                            key={master.id}
                            className={cn(
                              "p-4 border rounded-lg cursor-pointer transition-all",
                              selectedMaster?.id === master.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50",
                            )}
                            onClick={() => setSelectedMaster(master)}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={master.avatar_url || "/placeholder.svg"}
                                alt={master.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div className="space-y-1">
                                <h3 className="font-semibold text-card-foreground">{master.name}</h3>
                                <p className="text-sm text-muted-foreground">{master.specialization}</p>
                                <div className="flex items-center gap-1">
                                  {renderStars(master.rating)}
                                  <span className="text-sm text-muted-foreground ml-1">({master.reviews_count})</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Шаг 3: Выбор даты и времени */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <p className="text-muted-foreground mb-4">Выберите дату:</p>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                          className="rounded-md border border-border"
                        />
                      </div>

                      {selectedDate && (
                        <div>
                          <p className="text-muted-foreground mb-4">Выберите время:</p>
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                            {availableSlots.map((slot) => (
                              <Button
                                key={slot}
                                variant={selectedTime === slot ? "default" : "outline"}
                                className={cn(
                                  "h-12",
                                  selectedTime === slot
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-transparent border-border hover:border-primary",
                                )}
                                onClick={() => setSelectedTime(slot)}
                              >
                                {slot}
                              </Button>
                            ))}
                          </div>
                          {availableSlots.length === 0 && (
                            <p className="text-muted-foreground text-center py-8">
                              На выбранную дату нет доступных слотов
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Шаг 4: Данные клиента */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Заполните ваши данные:</p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Полное имя *</Label>
                          <Input
                            id="name"
                            placeholder="Введите ваше имя"
                            value={clientData.name}
                            onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                            className="bg-input border-border focus:ring-ring"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Номер телефона *</Label>
                          <Input
                            id="phone"
                            placeholder="+998 90 123 45 67"
                            value={clientData.phone}
                            onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                            className="bg-input border-border focus:ring-ring"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Дополнительные пожелания</Label>
                          <Textarea
                            id="notes"
                            placeholder="Укажите особые пожелания или требования..."
                            value={clientData.notes}
                            onChange={(e) => setClientData({ ...clientData, notes: e.target.value })}
                            className="bg-input border-border focus:ring-ring"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Шаг 5: Подтверждение */}
                  {currentStep === 4 && (
                    <div className="text-center space-y-6">
                      <div className="flex justify-center">
                        <CheckCircle className="w-16 h-16 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Бронирование успешно создано!</h2>
                        <p className="text-muted-foreground">
                          Мы отправили подтверждение на ваш телефон. Ожидайте звонка от салона для подтверждения записи.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button
                          onClick={() => router.push("/dashboard")}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Перейти в личный кабинет
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => router.push("/salons")}
                          className="bg-transparent border-border"
                        >
                          Найти другие салоны
                        </Button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                      {error}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Боковая панель с резюме */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-border bg-card">
                <CardHeader>
                  <CardTitle>Резюме бронирования</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedService && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-card-foreground">Услуга:</h4>
                      <p className="text-sm">{selectedService.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedService.duration_minutes} минут</p>
                      <p className="text-lg font-semibold text-primary">{formatPrice(selectedService.price)}</p>
                    </div>
                  )}

                  {selectedMaster && (
                    <div className="space-y-2 pt-4 border-t border-border">
                      <h4 className="font-semibold text-card-foreground">Мастер:</h4>
                      <div className="flex items-center gap-2">
                        <img
                          src={selectedMaster.avatar_url || "/placeholder.svg"}
                          alt={selectedMaster.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">{selectedMaster.name}</p>
                          <p className="text-xs text-muted-foreground">{selectedMaster.specialization}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedDate && selectedTime && (
                    <div className="space-y-2 pt-4 border-t border-border">
                      <h4 className="font-semibold text-card-foreground">Дата и время:</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{selectedDate.toLocaleDateString("ru-RU")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{selectedTime}</span>
                      </div>
                    </div>
                  )}

                  {currentStep < 4 && (
                    <div className="pt-4 space-y-2">
                      {currentStep > 0 && (
                        <Button variant="outline" onClick={handleBack} className="w-full bg-transparent border-border">
                          Назад
                        </Button>
                      )}
                      {currentStep < 3 && (
                        <Button
                          onClick={handleNext}
                          disabled={!canProceed()}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Далее
                        </Button>
                      )}
                      {currentStep === 3 && (
                        <Button
                          onClick={handleBooking}
                          disabled={!canProceed() || isLoading}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {isLoading ? "Создание бронирования..." : "Забронировать"}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
