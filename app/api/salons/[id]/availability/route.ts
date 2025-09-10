'use server'

import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const masterId = searchParams.get("master_id")
    const date = searchParams.get("date")

    if (!masterId || !date) {
      return NextResponse.json({ error: "Необходимы master_id и date" }, { status: 400 })
    }

    // Получение рабочих часов салона
    const { data: salon, error: salonError } = await supabase
      .from("salons")
      .select("working_hours")
      .eq("id", id)
      .single()

    if (salonError || !salon) {
      return NextResponse.json({ error: "Салон не найден" }, { status: 404 })
    }

    // Получение существующих бронирований на выбранную дату
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("start_time, end_time")
      .eq("master_id", masterId)
      .eq("booking_date", date)
      .neq("status", "cancelled")

    if (bookingsError) {
      console.error("Ошибка получения бронирований:", bookingsError)
      return NextResponse.json({ error: "Ошибка получения доступности" }, { status: 500 })
    }

    // Определение дня недели
    const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    const workingHours = salon.working_hours[dayOfWeek]

    if (!workingHours) {
      return NextResponse.json({ availableSlots: [] })
    }

    // Генерация временных слотов (каждые 30 минут)
    const slots = []
    const startHour = Number.parseInt(workingHours.open.split(":")[0])
    const startMinute = Number.parseInt(workingHours.open.split(":")[1])
    const endHour = Number.parseInt(workingHours.close.split(":")[0])
    const endMinute = Number.parseInt(workingHours.close.split(":")[1])

    const currentTime = new Date()
    currentTime.setHours(startHour, startMinute, 0, 0)

    const endTime = new Date()
    endTime.setHours(endHour, endMinute, 0, 0)

    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().slice(0, 5)

      // Проверка, не занят ли этот слот
      const isBooked = bookings?.some((booking) => {
        return timeString >= booking.start_time && timeString < booking.end_time
      })

      if (!isBooked) {
        slots.push(timeString)
      }

      // Добавляем 30 минут
      currentTime.setMinutes(currentTime.getMinutes() + 30)
    }

    return NextResponse.json({ availableSlots: slots })
  } catch (error) {
    console.error("Ошибка API доступности:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
