-- Supabase Database Schema for SmallBiz Desk
-- Enable RLS on all tables
-- Note: Ensure RLS is enabled via Supabase dashboard or alter commands later
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Editorial Team',
  author_avatar TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  featured BOOLEAN NOT NULL DEFAULT false,
  read_time INT,
  views INT NOT NULL DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.article_tags (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_sort_order ON public.categories(sort_order);
CREATE INDEX idx_articles_status_published_at ON public.articles(status, published_at DESC);
CREATE INDEX idx_articles_category_id ON public.articles(category_id);
CREATE INDEX idx_articles_featured ON public.articles(featured);
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_article_tags_tag_id ON public.article_tags(tag_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'editor'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = check_user_id
      AND role = 'admin'
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET role = 'admin', updated_at = now()
  WHERE email = lower(target_email);
END;
$$;

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_subscribers_updated_at
BEFORE UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.categories (name, slug, description, sort_order) VALUES
('Bookkeeping & Accounting', 'bookkeeping-accounting', 'Day-to-day bookkeeping, chart of accounts, reconciliation, and accounting best practices.', 1),
('Cloud Software', 'cloud-software', 'Reviews, guides, and updates on cloud accounting and business software.', 2),
('Invoicing & Payments', 'invoicing-payments', 'Invoicing workflows, credit control, payment terms, and cash flow management.', 3),
('Tax & Compliance', 'tax-compliance', 'Making Tax Digital, VAT, Corporation Tax, HMRC deadlines, and regulatory compliance.', 4),
('Payroll', 'payroll', 'Processing payroll, PAYE, pensions, National Insurance, and statutory payments.', 5),
('HR & People', 'hr-people', 'Employment law, holiday entitlement, sickness, hiring, and managing your team.', 6),
('Comparison', 'comparison', 'Side-by-side comparisons of accounting software, payroll tools, and business services.', 7);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories" ON public.categories
FOR SELECT USING (true);

CREATE POLICY "Public can view published articles" ON public.articles
FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view tags" ON public.tags
FOR SELECT USING (true);

CREATE POLICY "Public can view published article tags" ON public.article_tags
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.articles
    WHERE public.articles.id = article_id
      AND public.articles.status = 'published'
  )
);

CREATE POLICY "Public can insert subscribers" ON public.subscribers
FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage users" ON public.users
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can manage categories" ON public.categories
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can manage articles" ON public.articles
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can manage tags" ON public.tags
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can manage article_tags" ON public.article_tags
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can manage subscribers" ON public.subscribers
FOR SELECT USING (public.is_admin(auth.uid()));

INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read article images" ON storage.objects
FOR SELECT USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload article images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'article-images'
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Authenticated users can update article images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'article-images'
  AND public.is_admin(auth.uid())
)
WITH CHECK (
  bucket_id = 'article-images'
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Authenticated users can delete article images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'article-images'
  AND public.is_admin(auth.uid())
);
