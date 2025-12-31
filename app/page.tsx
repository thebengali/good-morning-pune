import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  // Read all posts from the posts directory
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const slug = filename.replace('.md', '');
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      
      // Get thumbnail - use featuredImage, first gallery image, or placeholder
      let thumbnail = '/images/placeholder.jpg';
      if (data.type === 'image' && data.featuredImage) {
        thumbnail = data.featuredImage;
      } else if (data.type === 'gallery' && data.gallery && data.gallery.length > 0) {
        thumbnail = data.gallery[0];
      }
      
      return {
        slug,
        title: data.title,
        date: data.date,
        thumbnail,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1)); // newest first

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="mb-16 flex items-center justify-between">
          {/* Social Icons - placeholder */}
          <div className="w-24">
            {/* Social icons will go here */}
          </div>
          
          {/* Logo + Site Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
              <span className="text-2xl font-bold text-gray-600">GMP</span>
            </div>
            <h1 className="text-6xl tracking-wide">
              GOOD MORNING PUNE
            </h1>
          </div>
          
          {/* Menu - placeholder */}
          <div className="w-24">
            {/* Menu will go here */}
          </div>
        </header>

        {/* Posts Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.map(post => (
              <Link 
                key={post.slug} 
                href={`/posts/${post.slug}`}
                className="group relative aspect-square overflow-hidden bg-gray-900"
              >
                {/* Image */}
                <Image 
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 group-hover:opacity-75 transition-all duration-300"
                />
                
                {/* Title overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <h3 className="text-white font-semibold text-lg leading-tight">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-8">
          <p className="text-gray-600 text-sm text-center">
            © 2025 Sanjay Mahendrakumar Mukherjee. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}