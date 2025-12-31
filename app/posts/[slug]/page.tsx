import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Image from 'next/image';

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Read the markdown file
  const postsDirectory = path.join(process.cwd(), 'posts');
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // Parse frontmatter and content
  const { data, content } = matter(fileContents);
  
  return (
    <main className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-4 py-16">
        {/* Back link */}
        <a href="/" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
          ← Back to Home
        </a>
        
        {/* Post header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {data.title}
          </h1>
          <p className="text-gray-500 text-lg">
            {new Date(data.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </header>

        {/* TYPE 1: Featured Image */}
        {data.type === 'image' && data.featuredImage && (
          <div className="mb-12 -mx-4 md:mx-0">
            <Image 
              src={data.featuredImage}
              alt={data.title}
              width={1200}
              height={675}
              className="w-full h-auto"
              priority
            />
          </div>
        )}

        {/* TYPE 2: Gallery */}
        {data.type === 'gallery' && data.gallery && (
          <div className="mb-12 grid grid-cols-2 gap-4">
            {data.gallery.map((image: string, index: number) => (
              <div key={index} className="relative aspect-square">
                <Image 
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Post content */}
        <div className="prose prose-xl max-w-none">
          {content.split('\n\n').map((paragraph, i) => {
            if (!paragraph.trim()) return null;
            
            // Handle headers
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={i} className="text-3xl font-bold text-gray-900 mt-12 mb-6">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            
            // Handle lists
            if (paragraph.includes('\n- ')) {
              const items = paragraph.split('\n- ').filter(item => item.trim());
              return (
                <ul key={i} className="list-disc list-inside mb-6 space-y-2">
                  {items.map((item, idx) => (
                    <li key={idx} className="text-gray-800 text-lg leading-relaxed">
                      {item.replace('- ', '')}
                    </li>
                  ))}
                </ul>
              );
            }
            
            // Regular paragraphs
            return (
              <p key={i} className="mb-6 text-gray-800 text-lg leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* TYPE 3: Video */}
        {data.type === 'video' && data.videoUrl && (
          <div className="mt-12 aspect-video">
            <iframe
              src={data.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </article>
    </main>
  );
}