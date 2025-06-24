
-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role_id ON public.user_profiles(role_id);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX idx_blog_posts_category_id ON public.blog_posts(category_id);
CREATE INDEX idx_esg_assessments_user_id ON public.esg_assessments(user_id);
CREATE INDEX idx_esg_assessments_status ON public.esg_assessments(status);
CREATE INDEX idx_esg_responses_assessment_id ON public.esg_responses(assessment_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON public.analytics_events(event_name);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_esg_assessments_updated_at BEFORE UPDATE ON public.esg_assessments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to calculate ESG scores
CREATE OR REPLACE FUNCTION calculate_esg_score(assessment_id UUID)
RETURNS JSONB AS $$
DECLARE
  environmental_score DECIMAL(5,2);
  social_score DECIMAL(5,2);
  governance_score DECIMAL(5,2);
  overall_score DECIMAL(5,2);
  result JSONB;
BEGIN
  -- Calculate category scores (simplified calculation)
  SELECT 
    COALESCE(AVG(CASE WHEN ec.code = 'E' THEN er.score END), 0),
    COALESCE(AVG(CASE WHEN ec.code = 'S' THEN er.score END), 0),
    COALESCE(AVG(CASE WHEN ec.code = 'G' THEN er.score END), 0)
  INTO environmental_score, social_score, governance_score
  FROM public.esg_responses er
  JOIN public.esg_questions eq ON er.question_id = eq.id
  JOIN public.esg_categories ec ON eq.category_id = ec.id
  WHERE er.assessment_id = calculate_esg_score.assessment_id;

  -- Calculate overall score
  overall_score := (environmental_score + social_score + governance_score) / 3;

  -- Update assessment with scores
  UPDATE public.esg_assessments
  SET 
    environmental_score = calculate_esg_score.environmental_score,
    social_score = calculate_esg_score.social_score,
    governance_score = calculate_esg_score.governance_score,
    overall_score = calculate_esg_score.overall_score,
    updated_at = now()
  WHERE id = calculate_esg_score.assessment_id;

  result := jsonb_build_object(
    'environmental_score', environmental_score,
    'social_score', social_score,
    'governance_score', governance_score,
    'overall_score', overall_score
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
