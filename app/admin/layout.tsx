import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Здесь можно добавить проверку, что пользователь является владельцем салона
  // const { data: salon } = await supabase
  //   .from("salons")
  //   .select("id")
  //   .eq("owner_id", data.user.id)
  //   .single()

  // if (!salon) {
  //   redirect("/dashboard")
  // }

  return <>{children}</>
}
