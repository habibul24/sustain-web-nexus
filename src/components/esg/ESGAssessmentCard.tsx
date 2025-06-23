
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, Building2, TrendingUp } from 'lucide-react'

interface ESGAssessment {
  id: string
  company_name: string | null
  status: string
  overall_score: number | null
  environmental_score: number | null
  social_score: number | null
  governance_score: number | null
  created_at: string
  updated_at: string
}

interface ESGAssessmentCardProps {
  assessment: ESGAssessment
  onContinue: (id: string) => void
  onView: (id: string) => void
}

export const ESGAssessmentCard: React.FC<ESGAssessmentCardProps> = ({
  assessment,
  onContinue,
  onView,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in_progress':
        return 'bg-yellow-500'
      case 'draft':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">
              {assessment.company_name || 'Unnamed Assessment'}
            </CardTitle>
          </div>
          <Badge className={getStatusColor(assessment.status)}>
            {assessment.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <CardDescription className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Created: {formatDate(assessment.created_at)}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {assessment.overall_score && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Score</span>
              <span className="text-2xl font-bold text-green-600">
                {assessment.overall_score}%
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Environmental</span>
                <span>{assessment.environmental_score}%</span>
              </div>
              <Progress value={assessment.environmental_score || 0} className="h-2" />
              
              <div className="flex justify-between text-sm">
                <span>Social</span>
                <span>{assessment.social_score}%</span>
              </div>
              <Progress value={assessment.social_score || 0} className="h-2" />
              
              <div className="flex justify-between text-sm">
                <span>Governance</span>
                <span>{assessment.governance_score}%</span>
              </div>
              <Progress value={assessment.governance_score || 0} className="h-2" />
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          {assessment.status === 'completed' ? (
            <Button onClick={() => onView(assessment.id)} className="flex-1">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Results
            </Button>
          ) : (
            <Button onClick={() => onContinue(assessment.id)} className="flex-1">
              Continue Assessment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
