
-- ESG Calculator System
CREATE TABLE public.esg_frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  version TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.esg_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id UUID REFERENCES public.esg_frameworks(id),
  name TEXT NOT NULL,
  code TEXT NOT NULL, -- E, S, G
  description TEXT,
  weight DECIMAL(5,2) DEFAULT 33.33,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.esg_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.esg_categories(id),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice', -- multiple_choice, yes_no, numeric, text
  options JSONB, -- For multiple choice options
  weight DECIMAL(5,2) DEFAULT 1.0,
  is_required BOOLEAN DEFAULT true,
  help_text TEXT,
  data_source TEXT, -- manual, xero, api
  order_index INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.esg_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  framework_id UUID REFERENCES public.esg_frameworks(id),
  company_name TEXT,
  assessment_period_start DATE,
  assessment_period_end DATE,
  status TEXT DEFAULT 'draft', -- draft, in_progress, completed, archived
  overall_score DECIMAL(5,2),
  environmental_score DECIMAL(5,2),
  social_score DECIMAL(5,2),
  governance_score DECIMAL(5,2),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.esg_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.esg_assessments(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.esg_questions(id),
  response_value TEXT,
  numeric_value DECIMAL(10,2),
  score DECIMAL(5,2),
  notes TEXT,
  data_source TEXT DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.esg_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.esg_assessments(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.esg_categories(id),
  raw_score DECIMAL(5,2),
  weighted_score DECIMAL(5,2),
  percentile_rank DECIMAL(5,2),
  industry_benchmark DECIMAL(5,2),
  recommendations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.esg_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view frameworks" ON public.esg_frameworks
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view categories" ON public.esg_categories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view questions" ON public.esg_questions
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their assessments" ON public.esg_assessments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their responses" ON public.esg_responses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.esg_assessments ea
      WHERE ea.id = assessment_id AND ea.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their scores" ON public.esg_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.esg_assessments ea
      WHERE ea.id = assessment_id AND ea.user_id = auth.uid()
    )
  );
