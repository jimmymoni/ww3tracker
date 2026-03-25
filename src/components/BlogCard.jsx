import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';

// Simple blog card for homepage
const BlogCard = ({ post }) => {
  if (!post) return null;

  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="block bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors group"
    >
      <div className="flex items-stretch">
        {/* Image */}
        <div 
          className="w-24 sm:w-32 bg-cover bg-center flex-shrink-0"
          style={{ 
            backgroundImage: `url(${post.image || '/images/blog/default.jpg'})`,
            backgroundColor: '#1a1a2e'
          }}
        />
        
        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
            <span className="text-orange-400">{post.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>
          
          <h3 className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>
          
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 group-hover:text-white transition-colors">
            Read
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
