"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, CreditCard, Smartphone, Banknote, ArrowLeft, Clock, MapPin, User } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface Booking {
  id: string
  booking_date: string
  booking_time: string
  total_amount: number
  status: string
  salons: {
    name: string
    address: string
  }
  services: {
    name: string
    price: number
    duration: number
  }
  masters: {
    full_name: string
  }
}

const paymentMethods = [
  {
    id: "click",
    name: "Click",
    description: "Оплата через Click",
    icon: CreditCard,
    color: "bg-blue-500",
  },
  {
    id: "payme",
    name: "Payme",
    description: "Оплата через Payme",
    icon: Smartphone,
    color: "bg-green-500",
  },
  {
    id: "oson",
    name: "OSON",
    description: "Оплата через OSON",
    icon: Banknote,
    color: "bg-purple-500",
  },
]

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchBooking()
  }, [params.bookingId])

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          salons (name, address),
          services (name, price, duration),
          masters (full_name)
        `)
        .eq("id", params.bookingId)
        .single()

      if (error) throw error
      setBooking(data)
    } catch (error) {
      console.error("Error fetching booking:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!selectedMethod || !booking) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/payments/${selectedMethod}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking_id: booking.id,
          amount: booking.total_amount,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Перенаправляем на платежную систему
        window.location.href = data.payment_url
      } else {
        alert("Ошибка при создании платежа: " + data.error)
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Произошла ошибка при обработке платежа")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Бронирование не найдено</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              На главную
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Оплата бронирования</h1>
            <p className="text-muted-foreground">Выберите удобный способ оплаты</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Детали бронирования
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{booking.salons.name}</p>
                    <p className="text-sm text-muted-foreground">{booking.salons.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">{booking.masters.full_name}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {new Date(booking.booking_date).toLocaleDateString("ru-RU", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">{booking.booking_time}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="font-medium mb-2">Услуга:</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{booking.services.name}</p>
                      <p className="text-sm text-muted-foreground">{booking.services.duration} мин</p>
                    </div>
                    <p className="font-bold">{booking.services.price.toLocaleString()} сум</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Итого к оплате:</span>
                  <span className="text-primary">{booking.total_amount.toLocaleString()} сум</span>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Безопасная оплата через проверенные платежные системы</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Способ оплаты</CardTitle>
                <CardDescription>Выберите удобный для вас способ оплаты</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <div
                      key={method.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${method.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            selectedMethod === method.id ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}
                        >
                          {selectedMethod === method.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Payment Button */}
            <div className="space-y-4">
              <Button
                onClick={handlePayment}
                disabled={!selectedMethod || processing}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Обработка...
                  </div>
                ) : (
                  `Оплатить ${booking.total_amount.toLocaleString()} сум`
                )}
              </Button>

              <Button variant="outline" onClick={() => router.back()} className="w-full" disabled={processing}>
                Отменить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
