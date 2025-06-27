
-- Create table for strategy responses
CREATE TABLE public.strategy_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  responsible_member TEXT,
  management_position TEXT[],
  other_position TEXT,
  training TEXT,
  competency TEXT,
  communication TEXT,
  committee TEXT,
  committee_name TEXT,
  incentives TEXT,
  incentive_position TEXT,
  other_incentive TEXT,
  incentive_type TEXT,
  activities TEXT[],
  additional_info TEXT,
  local_incentives TEXT,
  use_incentives TEXT,
  policies TEXT,
  integration TEXT,
  reassessment TEXT,
  board_training TEXT,
  training_details TEXT,
  carbon_targets TEXT,
  monitor_targets TEXT,
  project_control TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for risk assessment responses
CREATE TABLE public.risk_assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  short_term TEXT,
  medium_term TEXT,
  long_term TEXT,
  has_process TEXT,
  process_desc TEXT,
  review_frequency TEXT,
  last_assessment DATE,
  risk1 TEXT,
  value_chain TEXT,
  risk_type TEXT[],
  financial_impact TEXT,
  risk_materialize TEXT,
  risk_impact TEXT,
  time_horizon TEXT,
  likelihood TEXT,
  magnitude TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for metrics targets responses
CREATE TABLE public.metrics_targets_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  org_ghg TEXT,
  standard TEXT[],
  emission_scope1 TEXT,
  emission_scope2_loc TEXT,
  emission_scope2_mkt TEXT,
  emission_comment TEXT,
  reporting_discrepancy TEXT,
  emission_change TEXT,
  emission_target TEXT,
  primary_reason TEXT,
  initiative_active TEXT,
  comparison_to_previous TEXT,
  goal_level TEXT[],
  goal_motivation TEXT[],
  goal_other TEXT,
  goal_motivation_other TEXT,
  goal_desc TEXT,
  baseline_date DATE,
  start_date DATE,
  end_date DATE,
  goal_progress TEXT,
  waste_metric TEXT,
  waste_initiative TEXT,
  waste_initiative_desc TEXT,
  metric_used_for_target_set TEXT,
  captive_power_gen TEXT,
  target_desc TEXT,
  year_set INTEGER,
  base_year INTEGER,
  base_emissions TEXT,
  target_year INTEGER,
  reduction_percent TEXT,
  target_emissions TEXT,
  reporting_emissions TEXT,
  percent_achieved TEXT,
  science_based TEXT,
  target_explanation TEXT,
  intensity_target_desc TEXT,
  intensity_year_set INTEGER,
  intensity_metric TEXT,
  intensity_other TEXT,
  intensity_base_year INTEGER,
  intensity_base_figure TEXT,
  intensity_target_year INTEGER,
  intensity_reduction_percent TEXT,
  intensity_science_based TEXT,
  intensity_explanation TEXT,
  no_target_reason TEXT,
  no_target_explanation TEXT,
  reduction_initiatives TEXT,
  water_withdrawals TEXT,
  water_withdrawals_comparison TEXT,
  water_withdrawals_explain TEXT,
  water_discharges TEXT,
  water_discharges_comparison TEXT,
  water_discharges_explain TEXT,
  water_consumption TEXT,
  water_consumption_comparison TEXT,
  water_consumption_explain TEXT,
  water_goal TEXT[],
  water_goal_other TEXT,
  water_goal_level TEXT[],
  water_goal_level_other TEXT,
  water_goal_motivation TEXT[],
  water_goal_motivation_other TEXT,
  water_goal_desc TEXT,
  water_goal_baseline_date DATE,
  water_goal_start_date DATE,
  water_goal_end_date DATE,
  water_goal_progress TEXT,
  waste_target TEXT[],
  waste_target_other TEXT,
  waste_metric_used TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE public.strategy_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_targets_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for strategy_responses
CREATE POLICY "Users can manage their own strategy responses" 
ON public.strategy_responses
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for risk_assessment_responses
CREATE POLICY "Users can manage their own risk assessment responses" 
ON public.risk_assessment_responses
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for metrics_targets_responses
CREATE POLICY "Users can manage their own metrics targets responses" 
ON public.metrics_targets_responses
FOR ALL 
USING (auth.uid() = user_id);

-- Add triggers to update updated_at columns
CREATE TRIGGER update_strategy_responses_updated_at
  BEFORE UPDATE ON public.strategy_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_risk_assessment_responses_updated_at
  BEFORE UPDATE ON public.risk_assessment_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_metrics_targets_responses_updated_at
  BEFORE UPDATE ON public.metrics_targets_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
