import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { booking_id, amount } = body

    // Проверяем существование бронирования
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", booking_id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Бронирование не найдено" }, { status: 404 })
    }

    // Создаем запись платежа
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        booking_id,
        amount,
        payment_method: "click",
        status: "pending",
        transaction_id: `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })
      .select()
      .single()

    if (paymentError) {
      return NextResponse.json({ error: "Ошибка создания платежа" }, { status: 500 })
    }

    // Имитация интеграции с Click API
    const clickPaymentUrl = `https://my.click.uz/services/pay?service_id=YOUR_SERVICE_ID&merchant_id=YOUR_MERCHANT_ID&amount=${amount}&transaction_param=${payment.id}&return_url=${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`

    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      payment_url: clickPaymentUrl,
    })
  } catch (error) {
    console.error("Click payment error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
