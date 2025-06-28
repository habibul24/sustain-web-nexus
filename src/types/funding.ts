
export interface FundingOpportunity {
  id: string;
  name: string;
  category: string;
  organizing_body: string | null;
  status: string;
  deadline: string | null;
  amount: number | null;
  amount_currency: string;
  eligibility: string | null;
  expected_use: string | null;
  link: string | null;
  other_criteria: string | null;
  created_at: string;
  updated_at: string;
}
