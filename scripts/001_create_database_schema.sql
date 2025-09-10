-- LocalBook Database Schema
-- Создание всех необходимых таблиц для платформы бронирования салонов

-- Таблица профилей пользователей (расширение auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица салонов/барбершопов
CREATE TABLE IF NOT EXISTS public.salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  working_hours JSONB NOT NULL DEFAULT '{}', -- {"monday": {"open": "09:00", "close": "18:00"}, ...}
  images TEXT[] DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица мастеров
CREATE TABLE IF NOT EXISTS public.masters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  avatar_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица услуг
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL, -- "haircut", "coloring", "styling", etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Связь мастеров с услугами (многие ко многим)
CREATE TABLE IF NOT EXISTS public.master_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_id UUID NOT NULL REFERENCES public.masters(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(master_id, service_id)
);

-- Таблица бронирований
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  master_id UUID NOT NULL REFERENCES public.masters(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Индекс для предотвращения конфликтов бронирования
  CONSTRAINT unique_master_time UNIQUE (master_id, booking_date, start_time)
);

-- Таблица отзывов
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  master_id UUID NOT NULL REFERENCES public.masters(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id) -- Один отзыв на бронирование
);

-- Таблица платежей
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'UZS',
  payment_method TEXT NOT NULL, -- 'click', 'payme', 'oson', 'cash'
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включение Row Level Security для всех таблиц
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS политики для profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS политики для salons
CREATE POLICY "Anyone can view active salons" ON public.salons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Salon owners can manage their salons" ON public.salons
  FOR ALL USING (auth.uid() = owner_id);

-- RLS политики для masters
CREATE POLICY "Anyone can view active masters" ON public.masters
  FOR SELECT USING (is_active = true);

CREATE POLICY "Salon owners can manage their masters" ON public.masters
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_id FROM public.salons WHERE id = masters.salon_id
    )
  );

-- RLS политики для services
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Salon owners can manage their services" ON public.services
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_id FROM public.salons WHERE id = services.salon_id
    )
  );

-- RLS политики для master_services
CREATE POLICY "Anyone can view master services" ON public.master_services
  FOR SELECT USING (true);

CREATE POLICY "Salon owners can manage master services" ON public.master_services
  FOR ALL USING (
    auth.uid() IN (
      SELECT s.owner_id FROM public.salons s
      JOIN public.masters m ON s.id = m.salon_id
      WHERE m.id = master_services.master_id
    )
  );

-- RLS политики для bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (
    auth.uid() = client_id OR 
    auth.uid() IN (
      SELECT owner_id FROM public.salons WHERE id = bookings.salon_id
    )
  );

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (
    auth.uid() = client_id OR 
    auth.uid() IN (
      SELECT owner_id FROM public.salons WHERE id = bookings.salon_id
    )
  );

-- RLS политики для reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = client_id);

-- RLS политики для payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (
    auth.uid() IN (
      SELECT client_id FROM public.bookings WHERE id = payments.booking_id
    ) OR
    auth.uid() IN (
      SELECT s.owner_id FROM public.salons s
      JOIN public.bookings b ON s.id = b.salon_id
      WHERE b.id = payments.booking_id
    )
  );

-- Создание индексов для оптимизации производительности
CREATE INDEX IF NOT EXISTS idx_salons_owner_id ON public.salons(owner_id);
CREATE INDEX IF NOT EXISTS idx_masters_salon_id ON public.masters(salon_id);
CREATE INDEX IF NOT EXISTS idx_services_salon_id ON public.services(salon_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_salon_id ON public.bookings(salon_id);
CREATE INDEX IF NOT EXISTS idx_bookings_master_id ON public.bookings(master_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON public.bookings(booking_date, start_time);
CREATE INDEX IF NOT EXISTS idx_reviews_salon_id ON public.reviews(salon_id);
CREATE INDEX IF NOT EXISTS idx_reviews_master_id ON public.reviews(master_id);
