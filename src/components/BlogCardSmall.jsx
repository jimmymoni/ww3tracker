import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Smaller blog card for homepage list
const BlogCardSmall = ({ post }) => {
  if (!post) return null;

  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/[0.07] transition-colors group"
    >
      <div className="flex-1 min-w-0 mr-3">
        <p className="text-xs text-gray-500 mb-1">{post.category}</p>
        <h4 className="text-sm text-white group-hover:text-orange-400 transition-colors truncate">
          {post.title}
        </h4>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white flex-shrink-0" />
    </Link>
  );
};

export default BlogCardSmall;
