"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Clock, MapPin, User } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface Booking {
  id: string
  booking_date: string
  booking_time: string
  total_amount: number
  salons: {
    name: string
    address: string
    phone: string
  }
  services: {
    name: string
  }
  masters: {
    full_name: string
  }
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    const paymentId = searchParams.get("payment_id")
    if (paymentId) {
      fetchBookingByPayment(paymentId)
    }
  }, [searchParams])

  const fetchBookingByPayment = async (paymentId: string) => {
    try {
      // Сначала получаем платеж
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select("booking_id")
        .eq("id", paymentId)
        .single()

      if (paymentError) throw paymentError

      // Затем получаем бронирование
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select(`
          *,
          salons (name, address, phone),
          services (name),
          masters (full_name)
        `)
        .eq("id", payment.booking_id)
        .single()

      if (bookingError) throw bookingError

      // Обновляем статус бронирования на подтвержденный
      await supabase.from("bookings").update({ status: "confirmed" }).eq("id", payment.booking_id)

      setBooking(bookingData)
    } catch (error) {
      console.error("Error fetching booking:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Оплата успешна!</h1>
          <p className="text-muted-foreground">
            Ваше бронирование подтверждено. Мы отправили детали на вашу электронную почту.
          </p>
        </div>

        {booking && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Детали бронирования</CardTitle>
              <CardDescription>Номер бронирования: #{booking.id.slice(-8).toUpperCase()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{booking.salons.name}</p>
                  <p className="text-sm text-muted-foreground">{booking.salons.address}</p>
                  <p className="text-sm text-muted-foreground">Тел: {booking.salons.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Мастер: {booking.masters.full_name}</p>
                  <p className="text-sm text-muted-foreground">Услуга: {booking.services.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {new Date(booking.booking_date).toLocaleDateString("ru-RU", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">{booking.booking_time}</p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Оплачено:</span>
                  <span className="text-green-600">{booking.total_amount.toLocaleString()} сум</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Что дальше?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Приходите в салон за 5-10 минут до назначенного времени</li>
                <li>• При себе имейте документ, удостоверяющий личность</li>
                <li>• В случае необходимости отмены, свяжитесь с салоном заранее</li>
                <li>• После посещения вы можете оставить отзыв о качестве услуг</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => router.push("/")} className="flex-1">
              На главную
            </Button>
            <Button onClick={() => router.push("/dashboard")} variant="outline" className="flex-1">
              Мои бронирования
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
