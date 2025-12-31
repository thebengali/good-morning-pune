import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

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
      
      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1)); // newest first

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Good Morning Pune
          </h1>
          <p className="text-xl text-gray-600">
            Essays and observations from Mumbai's neighbor
          </p>
        </header>

        {/* Recent Posts Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Posts</h2>
          
          {posts.map(post => (
            <article key={post.slug} className="border-b border-gray-200 pb-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                <Link href={`/posts/${post.slug}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h3>
              <p className="text-gray-500 text-sm mb-3">
                {new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {post.excerpt}
              </p>
            </article>
          ))}
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-8">
          <p className="text-gray-600 text-sm">
            © 2025 Sanjay Mahendrakumar Mukherjee. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}