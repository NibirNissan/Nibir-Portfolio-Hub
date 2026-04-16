import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { FirestoreBlog } from "@/lib/firestoreTypes";
import { Link } from "wouter";
import { ArrowLeft, Calendar, ArrowRight, Loader2, Rss } from "lucide-react";
import BackButton from "@/components/BackButton";

function BlogCard({ blog }: { blog: FirestoreBlog }) {
  const formattedDate = (() => {
    try {
      return new Date(blog.date).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      });
    } catch { return blog.date; }
  })();

  return (
    <Link href={`/blog/${blog.slug}`}>
      <article className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-neutral-800/60 hover:border-neutral-700 bg-neutral-950 hover:bg-neutral-900 transition-all duration-300 cursor-pointer">
        {blog.coverImage && (
          <div className="w-full md:w-52 h-40 md:h-36 shrink-0 rounded-xl overflow-hidden bg-neutral-800">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <time>{formattedDate}</time>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug group-hover:text-emerald-400 transition-colors">
            {blog.title}
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed flex-1">
            {blog.excerpt}
          </p>
          <div className="flex items-center gap-1.5 mt-4 text-sm font-medium text-emerald-400 group-hover:gap-3 transition-all duration-300">
            Read article
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<FirestoreBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setError("Blog not configured yet.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const q = query(
          collection(db!, "blogs"),
          where("published", "==", true),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setBlogs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreBlog)));
      } catch {
        try {
          const snap = await getDocs(collection(db!, "blogs"));
          const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreBlog));
          setBlogs(all.filter((b) => b.published).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)));
        } catch (e) {
          setError("Failed to load blog posts.");
          console.error(e);
        }
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div
      className="min-h-screen bg-[#0a0a0a]"
      style={{
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        color: "#e5e5e5",
      }}
    >
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white mb-8 group transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to portfolio
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Rss className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase text-emerald-400">Journal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Thoughts &amp; Writing
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Ideas on building products, AI automation, design, and the web.
          </p>
        </div>

        <div className="w-full h-px bg-neutral-800 mb-10" />

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 text-neutral-600 animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-24 text-neutral-600 text-sm">{error}</div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-24">
            <p className="text-neutral-600 text-sm">No posts published yet. Check back soon.</p>
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
