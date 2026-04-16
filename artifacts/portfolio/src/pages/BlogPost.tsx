import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { FirestoreBlog } from "@/lib/firestoreTypes";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, Clock, Loader2 } from "lucide-react";

function estimateReadTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<FirestoreBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const q = query(collection(db!, "blogs"), where("slug", "==", slug));
        const snap = await getDocs(q);
        if (snap.empty) { setNotFound(true); } else {
          setBlog({ id: snap.docs[0].id, ...snap.docs[0].data() } as FirestoreBlog);
        }
      } catch { setNotFound(true); }
      setLoading(false);
    })();
  }, [slug]);

  const formattedDate = blog?.date
    ? (() => {
        try {
          return new Date(blog.date).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          });
        } catch { return blog.date; }
      })()
    : "";

  const readTime = blog ? estimateReadTime(blog.content) : 0;

  return (
    <div
      className="min-h-screen bg-[#0a0a0a]"
      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: "#e5e5e5" }}
    >
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-6 h-6 text-neutral-600 animate-spin" />
        </div>
      )}

      {!loading && notFound && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-neutral-600 text-lg">Post not found.</p>
          <Link href="/blog" className="text-sm text-emerald-400 hover:underline">← Back to blog</Link>
        </div>
      )}

      {!loading && blog && (
        <article className="max-w-2xl mx-auto px-6 py-12 md:py-20">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white mb-10 group transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            All posts
          </Link>

          {blog.coverImage && (
            <div className="w-full h-56 md:h-72 rounded-2xl overflow-hidden bg-neutral-800 mb-10">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          <header className="mb-10">
            <div className="flex items-center gap-4 text-xs text-neutral-500 mb-5">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <time>{formattedDate}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {readTime} min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              {blog.title}
            </h1>
            {blog.excerpt && (
              <p className="text-lg md:text-xl text-neutral-400 leading-relaxed border-l-2 border-emerald-500/40 pl-4">
                {blog.excerpt}
              </p>
            )}
          </header>

          <div className="w-full h-px bg-neutral-800 mb-10" />

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className="w-full h-px bg-neutral-800 mt-14 mb-8" />

          <div className="flex items-center justify-between">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white group transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              All posts
            </Link>
            <Link href="/" className="text-sm text-neutral-500 hover:text-white transition-colors">
              Portfolio →
            </Link>
          </div>
        </article>
      )}
    </div>
  );
}
