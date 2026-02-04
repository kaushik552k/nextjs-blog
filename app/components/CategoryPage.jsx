import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, ChevronRight, Database, Code2, Brain, Sparkles } from 'lucide-react';
import { getCategoryBySlug, getPostsByCategory, getPostsBySubcategory } from '../data/mock';

// Icon mapping
const iconMap = {
  Database: Database,
  Code2: Code2,
  Brain: Brain
};

const CategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);
  
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[rgb(var(--color-text-primary))] mb-4">Category Not Found</h1>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const posts = subcategorySlug 
    ? getPostsBySubcategory(categorySlug, subcategorySlug)
    : getPostsByCategory(categorySlug);

  const currentSubcategory = subcategorySlug 
    ? category.subcategories.find(s => s.slug === subcategorySlug)
    : null;

  const IconComponent = iconMap[category.icon] || Sparkles;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-muted))] mb-8"
        >
          <Link to="/" className="hover:text-pink-500 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link 
            to={`/category/${categorySlug}`} 
            className={`hover:text-pink-500 transition-colors ${!subcategorySlug ? 'text-[rgb(var(--color-text-primary))]' : ''}`}
          >
            {category.name}
          </Link>
          {currentSubcategory && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[rgb(var(--color-text-primary))]">{currentSubcategory.name}</span>
            </>
          )}
        </motion.nav>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient}`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[rgb(var(--color-text-primary))]">
                {currentSubcategory ? currentSubcategory.name : category.name}
              </h1>
              {!currentSubcategory && (
                <p className="text-[rgb(var(--color-text-secondary))] mt-1">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </motion.header>

        {/* Subcategories (only show on main category page) */}
        {!subcategorySlug && category.subcategories && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-4">
              Browse by Topic
            </h2>
            <div className="flex flex-wrap gap-3">
              {category.subcategories.map((sub, index) => (
                <motion.div
                  key={sub.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/category/${categorySlug}/${sub.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] hover:border-pink-500/50 text-[rgb(var(--color-text-secondary))] hover:text-pink-500 transition-all"
                  >
                    {sub.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Posts List - Josh Comeau Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[rgb(var(--color-text-muted))]">No posts in this category yet.</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="relative p-6 sm:p-8 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] hover:border-pink-500/30 transition-all overflow-hidden">
                    {/* Gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${post.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    
                    {/* Content */}
                    <div className="relative">
                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-text-primary))] group-hover:text-pink-500 transition-colors mb-2">
                        {post.title}
                      </h2>
                      
                      {/* Subtitle */}
                      {post.subtitle && (
                        <p className="text-[rgb(var(--color-accent-secondary))] font-medium mb-3">
                          {post.subtitle}
                        </p>
                      )}
                      
                      {/* Excerpt */}
                      <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-sm text-[rgb(var(--color-text-muted))]">
                          <Clock className="w-4 h-4" />
                          {post.readingTime}
                        </span>
                        
                        <motion.span
                          className="flex items-center gap-2 text-pink-500 font-semibold"
                          whileHover={{ x: 4 }}
                        >
                          Read more
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;
