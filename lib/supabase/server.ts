import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Создание серверного клиента Supabase
 * Важно: всегда создавать новый клиент в каждой функции
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createSupabaseServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Метод "setAll" был вызван из Server Component.
          // Это можно игнорировать, если у вас есть middleware для обновления сессий.
        }
      },
    },
  })
}

export const createServerClient = createClient
