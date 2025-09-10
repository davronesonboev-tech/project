import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Lock } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-border bg-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Восстановление пароля</CardTitle>
              <p className="text-center text-muted-foreground">
                Введите ваш email для получения инструкций по восстановлению пароля
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="ваш@email.com"
                      className="pl-10 bg-input border-border"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Отправить инструкции
                </Button>
              </form>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Вернуться к входу
                </Link>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Не получили письмо?
                </p>
                <Button
                  variant="link"
                  className="text-sm p-0 h-auto text-primary hover:underline"
                >
                  Отправить повторно
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
