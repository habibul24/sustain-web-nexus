
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Eye, Heart, ExternalLink } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image_url: string | null
  published_at: string | null
  view_count: number
  like_count: number
  tags: string[]
  substack_url: string | null
}

interface BlogPostCardProps {
  post: BlogPost
  onRead: (slug: string) => void
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onRead }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Draft'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card className="w-full h-full flex flex-col">
      {post.featured_image_url && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="flex-grow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.published_at)}</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{post.view_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{post.like_count}</span>
            </div>
          </div>
        </div>
        
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
        
        {post.excerpt && (
          <CardDescription className="line-clamp-3">
            {post.excerpt}
          </CardDescription>
        )}
        
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex space-x-2">
          <Button onClick={() => onRead(post.slug)} className="flex-1">
            Read More
          </Button>
          {post.substack_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={post.substack_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
