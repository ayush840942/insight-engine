
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT,
  email TEXT,
  subscription_plan TEXT NOT NULL DEFAULT 'free',
  credits_remaining INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create apps table
CREATE TABLE public.apps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  app_id TEXT NOT NULL,
  app_name TEXT,
  category TEXT,
  description TEXT,
  installs TEXT,
  rating NUMERIC,
  icon_url TEXT,
  developer TEXT,
  screenshots TEXT[],
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own apps" ON public.apps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own apps" ON public.apps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own apps" ON public.apps FOR DELETE USING (auth.uid() = user_id);

-- Create reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID REFERENCES public.apps(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  ux_score INTEGER,
  monetization_score INTEGER,
  retention_score INTEGER,
  growth_score INTEGER,
  analysis_json JSONB,
  report_type TEXT NOT NULL DEFAULT 'full',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID REFERENCES public.apps(id) ON DELETE CASCADE NOT NULL,
  review_text TEXT,
  rating INTEGER,
  sentiment TEXT,
  reviewer_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reviews for own apps" ON public.reviews FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.apps WHERE apps.id = reviews.app_id AND apps.user_id = auth.uid())
);
CREATE POLICY "Users can insert reviews for own apps" ON public.reviews FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.apps WHERE apps.id = reviews.app_id AND apps.user_id = auth.uid())
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
