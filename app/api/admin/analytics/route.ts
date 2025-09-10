import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Проверка аутентификации
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const salonId = searchParams.get("salon_id")

    // Проверка, что пользователь является владельцем салона
    const { data: salon, error: salonError } = await supabase
      .from("salons")
      .select("id")
      .eq("owner_id", user.id)
      .eq("id", salonId)
      .single()

    if (salonError || !salon) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    // Получение аналитики за последние 30 дней
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Общая статистика
    const { data: totalBookings, error: totalError } = await supabase
      .from("bookings")
      .select("id, total_price, status")
      .eq("salon_id", salonId)
      .gte("booking_date", thirtyDaysAgo.toISOString().split("T")[0])

    if (totalError) {
      console.error("Ошибка получения статистики:", totalError)
      return NextResponse.json({ error: "Ошибка получения аналитики" }, { status: 500 })
    }

    // Расчет метрик
    const totalBookingsCount = totalBookings?.length || 0
    const completedBookings = totalBookings?.filter((b) => b.status === "completed") || []
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + Number(booking.total_price), 0)
    const pendingBookings = totalBookings?.filter((b) => b.status === "pending").length || 0
    const cancelledBookings = totalBookings?.filter((b) => b.status === "cancelled").length || 0

    // Статистика по дням (последние 7 дней)
    const dailyStats = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const dayBookings = totalBookings?.filter((b) => b.booking_date === dateString) || []
      const dayRevenue = dayBookings
        .filter((b) => b.status === "completed")
        .reduce((sum, booking) => sum + Number(booking.total_price), 0)

      dailyStats.push({
        date: dateString,
        bookings: dayBookings.length,
        revenue: dayRevenue,
      })
    }

    // Популярные услуги
    const { data: popularServices, error: servicesError } = await supabase
      .from("bookings")
      .select(`
        services(name),
        count
      `)
      .eq("salon_id", salonId)
      .gte("booking_date", thirtyDaysAgo.toISOString().split("T")[0])

    const analytics = {
      totalBookings: totalBookingsCount,
      completedBookings: completedBookings.length,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
      averageBookingValue: completedBookings.length > 0 ? totalRevenue / completedBookings.length : 0,
      dailyStats,
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("Ошибка API аналитики:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
