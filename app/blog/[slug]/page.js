"use client";
import React, { useState, useEffect, use } from 'react';
import { 
    Calendar, User, MessageSquare, Heart, 
    ArrowLeft, Share2, Loader2, Database,
    Send, Terminal, ChevronRight, Check
} from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function BlogDetail({ params }) {
    const { slug } = use(params);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [comment, setComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await api.get(`/blog/${slug}`);
                setPost(data.data);
                setLikesCount(data.data.likes?.length || 0);
                
                // Check if current user has liked
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.id && data.data.likes?.includes(user.id)) {
                    setIsLiked(true);
                }
            } catch (err) {
                console.error('Failed to load article:', err);
                toast.error('Article not found or restricted.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();

        const handleScroll = () => {
            const h = document.documentElement, 
                  b = document.body,
                  st = 'scrollTop',
                  sh = 'scrollHeight';
            const percent = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
            setScrollProgress(percent);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [slug]);

    const handleLike = async () => {
        if (!post) return;
        try {
            const { data } = await api.post(`/blog/${post._id}/like`);
            setIsLiked(data.data.isLiked);
            setLikesCount(data.data.likesCount);
            if (data.data.isLiked) {
                toast.success('Interest recorded.', { icon: <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> });
            }
        } catch (err) {
            toast.error('Identity required to interact with posts.');
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim() || submittingComment) return;

        setSubmittingComment(true);
        try {
            const { data } = await api.post(`/blog/${post._id}/comment`, { content: comment });
            setPost({ ...post, comments: data.data });
            setComment('');
            toast.success('Comment posted to the conversation.');
        } catch (err) {
            toast.error('Failed to post comment.');
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-zinc-100 border-t-black rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Loading Article...</p>
        </div>
    );

    if (!post) return <div className="min-h-screen bg-white flex items-center justify-center font-black uppercase tracking-widest text-zinc-300">Not Found.</div>;

    return (
        <main className="min-h-screen bg-white pb-32">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-zinc-50">
                <div 
                    className="h-full bg-black transition-all duration-300" 
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Content Header */}
            <header className="pt-24 pb-20 px-6 bg-zinc-50/50 border-b border-zinc-100 relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <button 
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors mb-12 group"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Back to Articles
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                        {post.tags?.map(tag => (
                            <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-white border border-zinc-200 rounded-full text-zinc-500">
                                {tag}
                            </span>
                        ))}
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                            {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
                        </span>
                    </div>

                    {post.coverImage && (
                        <div className="mb-12 rounded-[40px] overflow-hidden aspect-[21/9] border border-zinc-200 shadow-2xl relative group">
                            <img 
                                src={post.coverImage} 
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    )}

                    <h1 className="text-5xl md:text-7xl font-black text-black tracking-tight mb-12 leading-[1] max-w-3xl">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between pt-12 border-t border-zinc-100">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white text-xl font-black shadow-xl">
                                {post.author?.displayName?.[0] || post.author?.username?.[0] || 'A'}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Author</p>
                                <p className="text-base font-bold text-black">{post.author?.displayName || post.author?.username || 'Elite Operative'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <button 
                                onClick={handleLike}
                                className={`flex flex-col items-center gap-1 transition-all hover:scale-110 ${isLiked ? 'text-rose-500' : 'text-zinc-300 hover:text-black'}`}
                            >
                                <Heart className={`w-6 h-6 ${isLiked ? 'fill-rose-500' : ''}`} />
                                <span className="text-[9px] font-black">{likesCount} Likes</span>
                            </button>
                            <div className="flex flex-col items-center gap-1 text-zinc-300">
                                <MessageSquare className="w-6 h-6" />
                                <span className="text-[9px] font-black">{post.comments?.length || 0} Comments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto py-24 px-6">
                <div className="prose prose-zinc prose-invert max-w-none 
                    prose-h2:text-4xl prose-h2:font-black prose-h2:text-zinc-900 prose-h2:tracking-tight prose-h2:mb-8
                    prose-p:text-lg prose-p:text-zinc-600 prose-p:leading-relaxed prose-p:mb-8 prose-p:font-medium
                    prose-strong:text-zinc-900 prose-strong:font-black
                    prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:font-bold prose-code:text-sm before:content-hidden after:content-hidden
                    prose-pre:bg-zinc-950 prose-pre:rounded-[32px] prose-pre:p-8 prose-pre:border prose-pre:border-white/5
                    prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/30 prose-blockquote:p-8 prose-blockquote:rounded-r-[32px] prose-blockquote:text-zinc-700 prose-blockquote:font-bold prose-blockquote:italic
                ">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Interaction Footer */}
                <div className="mt-24 pt-12 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Interaction</h4>
                        <div className="flex items-center gap-2">
                             <button 
                                onClick={handleLike}
                                className={`p-4 rounded-2xl border transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest ${isLiked ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-white border-zinc-100 text-zinc-400 hover:border-black hover:text-black'}`}
                            >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                                {isLiked ? 'Liked' : 'Like Post'}
                            </button>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success('Link copied to clipboard.');
                                }}
                                className="p-4 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:border-black hover:text-black transition-all"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Intel Stream (Comments) */}
                <section className="mt-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="p-3 bg-indigo-50 rounded-2xl">
                            <Terminal className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-black">Conversation.</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Community Discussion</p>
                        </div>
                    </div>

                    {/* New Comment Form */}
                    <div className="bg-zinc-50 rounded-[32px] p-8 mb-12 border border-zinc-100 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Database className="w-20 h-20 text-black" />
                        </div>
                        <form onSubmit={handleComment} className="relative z-10">
                            <label className="text-[10px] font-black uppercase tracking-widest text-black mb-4 block">Add a Comment</label>
                            <div className="relative">
                                <textarea 
                                    className="w-full bg-white border border-zinc-200 rounded-2xl py-6 px-6 text-black text-sm font-medium focus:outline-none focus:border-black transition-all min-h-[120px] resize-none shadow-sm"
                                    placeholder="Write your thoughts..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <button 
                                    type="submit"
                                    disabled={submittingComment}
                                    className="absolute bottom-4 right-4 bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                                >
                                    {submittingComment ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4" />}
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Comment List */}
                    <div className="space-y-6">
                        {post.comments?.length > 0 ? post.comments.map((c, i) => (
                            <div key={i} className="flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="shrink-0">
                                    <div className="w-12 h-12 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center text-black font-black text-sm shadow-sm">
                                        {c.displayName?.[0] || 'O'}
                                    </div>
                                </div>
                                <div className="flex-1 pt-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-black text-zinc-900">{c.displayName}</h4>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                                            {format(new Date(c.createdAt), 'HH:mm • dd MMM')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-600 font-medium leading-relaxed bg-zinc-50 shadow-sm p-6 rounded-3xl border border-zinc-100">
                                        {c.content}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 border border-dashed border-zinc-100 rounded-[40px]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">No comments yet.</p>
                            </div>
                        )}
                    </div>
                </section>
            </article>
        </main>
    );
}
