import { getPosts } from "@/lib/api";

export default async function Home() {
  const posts = await getPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Canal CMS - Blog & Informação',
    description: 'Consumindo dados diretamente do projeto Canal CMS para insights em Tecnologia.',
    url: 'https://seusite.com.br',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          Ness Blog
        </h1>
        <p className="text-gray-500 mb-10 text-lg">
          Consumindo dados diretamente do projeto Canal CMS.
        </p>

        {posts.length === 0 ? (
          <div className="p-10 border-2 border-dashed border-gray-200 rounded-xl text-center">
            <p className="text-gray-500 font-medium">Nenhum post retornado pelo CMS ainda.</p>
            <p className="text-sm text-gray-400 mt-1">Crie conteúdo no backoffice para vê-lo aqui.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="group p-6 rounded-xl border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-2">
                  Artigo
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed mb-4">
                  {post.content}
                </p>
                <div className="text-xs text-gray-400 font-mono">
                  Slug: {post.slug}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
