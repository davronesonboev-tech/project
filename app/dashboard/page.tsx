import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scissors, LogOut } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      <div className="container mx-auto p-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">LocalBook</h1>
              <p className="text-muted-foreground">Панель управления</p>
            </div>
          </div>

          <form action={handleSignOut}>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
          </form>
        </div>

        {/* Приветствие */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Добро пожаловать, {data.user.user_metadata?.full_name || data.user.email}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Вы успешно вошли в систему LocalBook. Здесь будет ваша панель управления.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Информация о пользователе:</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Email:</strong> {data.user.email}
                </p>
                <p>
                  <strong>Имя:</strong> {data.user.user_metadata?.full_name || "Не указано"}
                </p>
                <p>
                  <strong>Телефон:</strong> {data.user.user_metadata?.phone || "Не указан"}
                </p>
                <p>
                  <strong>Дата регистрации:</strong> {new Date(data.user.created_at).toLocaleDateString("ru-RU")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
