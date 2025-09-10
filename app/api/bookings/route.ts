'use server'

import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
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
    const { salon_id, master_id, service_id, booking_date, start_time, end_time, notes } = body

    // Валидация данных
    if (!salon_id || !master_id || !service_id || !booking_date || !start_time || !end_time) {
      return NextResponse.json({ error: "Не все обязательные поля заполнены" }, { status: 400 })
    }

    // Получение информации об услуге для расчета цены
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("price")
      .eq("id", service_id)
      .single()

    if (serviceError || !service) {
      return NextResponse.json({ error: "Услуга не найдена" }, { status: 404 })
    }

    // Проверка на конфликты бронирования (защита от двойного бронирования)
    const { data: conflictingBookings, error: conflictError } = await supabase
      .from("bookings")
      .select("id")
      .eq("master_id", master_id)
      .eq("booking_date", booking_date)
      .or(`start_time.lte.${start_time},end_time.gte.${end_time}`)
      .neq("status", "cancelled")

    if (conflictError) {
      console.error("Ошибка проверки конфликтов:", conflictError)
      return NextResponse.json({ error: "Ошибка проверки доступности времени" }, { status: 500 })
    }

    if (conflictingBookings && conflictingBookings.length > 0) {
      return NextResponse.json(
        {
          error: "Выбранное время уже занято. Пожалуйста, выберите другое время.",
        },
        { status: 409 },
      )
    }

    // Создание бронирования
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        client_id: user.id,
        salon_id,
        master_id,
        service_id,
        booking_date,
        start_time,
        end_time,
        total_price: service.price,
        notes: notes || null,
        status: "pending",
      })
      .select(`
        *,
        salons(name, address),
        masters(name),
        services(name, duration_minutes)
      `)
      .single()

    if (bookingError) {
      console.error("Ошибка создания бронирования:", bookingError)
      return NextResponse.json({ error: "Ошибка создания бронирования" }, { status: 500 })
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error("Ошибка API бронирования:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

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

    // Получение бронирований пользователя
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        *,
        salons(name, address, images),
        masters(name),
        services(name, duration_minutes)
      `)
      .eq("client_id", user.id)
      .order("booking_date", { ascending: false })
      .order("start_time", { ascending: false })

    if (error) {
      console.error("Ошибка получения бронирований:", error)
      return NextResponse.json({ error: "Ошибка получения бронирований" }, { status: 500 })
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Ошибка API получения бронирований:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
