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
    const status = searchParams.get("status")
    const date = searchParams.get("date")

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

    // Построение запроса
    let query = supabase
      .from("bookings")
      .select(`
        *,
        masters(name),
        services(name, duration_minutes),
        profiles(full_name, phone)
      `)
      .eq("salon_id", salonId)
      .order("booking_date", { ascending: false })
      .order("start_time", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (date) {
      query = query.eq("booking_date", date)
    }

    const { data: bookings, error } = await query

    if (error) {
      console.error("Ошибка получения бронирований:", error)
      return NextResponse.json({ error: "Ошибка получения бронирований" }, { status: 500 })
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Ошибка API админ бронирований:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json()
    const { booking_id, status } = body

    if (!booking_id || !status) {
      return NextResponse.json({ error: "Необходимы booking_id и status" }, { status: 400 })
    }

    // Проверка, что бронирование принадлежит салону пользователя
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        *,
        salons!inner(owner_id)
      `)
      .eq("id", booking_id)
      .single()

    if (bookingError || !booking || booking.salons.owner_id !== user.id) {
      return NextResponse.json({ error: "Бронирование не найдено или доступ запрещен" }, { status: 403 })
    }

    // Обновление статуса бронирования
    const { data: updatedBooking, error: updateError } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", booking_id)
      .select(`
        *,
        masters(name),
        services(name, duration_minutes),
        profiles(full_name, phone)
      `)
      .single()

    if (updateError) {
      console.error("Ошибка обновления бронирования:", updateError)
      return NextResponse.json({ error: "Ошибка обновления бронирования" }, { status: 500 })
    }

    return NextResponse.json({ booking: updatedBooking })
  } catch (error) {
    console.error("Ошибка API обновления бронирования:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
