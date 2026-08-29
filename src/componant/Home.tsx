import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Usercontext } from "./UsrProvider";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as hljsStyles from "react-syntax-highlighter/dist/esm/styles/hljs";
import { ToastContainer, toast } from "react-toastify";
import debounce from "lodash.debounce";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Save,
  Github,
  Eye,
  Trash2,
  Code2,
  LogOut,
  Loader2,
  Search,
  Clock,
  Flame,
  Grid2X2,
  List,
  Moon,
  Sun,
  Hash,
  ChevronLeft,
  ChevronRight,
  Copy,
  Users,
  X,
  FileCode,
  ChevronDown,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { languages, styles } from "./const";
import {
  usePostsQuery,
  useSearchQuery,
  useTagsQuery,
  useAddPost,
  useDeletePost,
} from "@/hooks/usePosts";
import { useLogout } from "@/hooks/useAuth";
import type { Post, User } from "@/types";

type ViewMode = "list" | "grid";
type SortBy = "newest" | "oldest" | "title" | "views";

// ─── CodeComponent (exported for Page.tsx) ────────────────────────────────────
interface CodeComponentProps {
  text: string;
  language: string;
  style: string;
}

export const CodeComponent: React.FC<CodeComponentProps> = ({ text, language, style }) => {
  const selectedStyle = (hljsStyles as Record<string, unknown>)[style] ?? hljsStyles.atomOneDark;
  return (
    <div className="overflow-hidden rounded-md border border-border dark:border-gray-700">
      <div className="code-bar">
        <span>{language}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied"); }}
          className="btn-ghost btn-sm p-1"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={selectedStyle as React.ComponentProps<typeof SyntaxHighlighter>["style"]}
        wrapLongLines
        showLineNumbers
        customStyle={{ margin: 0, padding: "16px", fontSize: "12.5px", lineHeight: "1.6" }}
      >
        {text}
      </SyntaxHighlighter>
    </div>
  );
};

// ─── Search dropdown (portal) ─────────────────────────────────────────────────
interface SearchDropdownProps {
  show: boolean;
  results: Post[];
  onClose: () => void;
  anchor: HTMLElement | null;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ show, results, onClose, anchor }) => {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (show && anchor) {
      const r = anchor.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
  }, [show, anchor]);

  if (!show || results.length === 0) return null;

  return createPortal(
    <div
      className="fixed z-50 card shadow-md overflow-hidden fade-in"
      style={{ top: pos.top, left: pos.left, width: pos.width }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border dark:border-gray-700 bg-surface-1 dark:bg-gray-800">
        <span className="text-xs text-ink-3 dark:text-gray-400">
          {results.length} result{results.length !== 1 ? "s" : ""}
        </span>
        <button className="btn-ghost btn-icon btn-sm" onClick={onClose}>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {results.map((post) => (
          <Link
            key={post.id}
            to={`/page/${post.id}`}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5
                       hover:bg-surface-1 dark:hover:bg-gray-800
                       border-b border-border dark:border-gray-700 last:border-0"
          >
            <FileCode className="w-4 h-4 text-ink-4 dark:text-gray-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink dark:text-gray-100 truncate">{post.title}</p>
              <p className="text-xs text-ink-4 dark:text-gray-500 mt-0.5">
                {post.language} · {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>,
    document.body
  );
};

// ─── PostRow ─────────────────────────────────────────────────────────────────
interface PostRowProps { post: Post; user: User; onDelete: (p: Post) => void; }

const PostRow: React.FC<PostRowProps> = ({ post, user, onDelete }) => {
  const isOwner = post.authorId === user.id;
  const navigate = useNavigate();

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    navigate(`/page/${post.id}`);
  };

  return (
    <div
      onClick={handleRowClick}
      className="flex items-center gap-4 px-4 py-3 cursor-pointer
                 hover:bg-surface-1 dark:hover:bg-gray-900
                 border-b border-border dark:border-gray-800 last:border-0 group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to={`/page/${post.id}`}
            className="text-sm font-medium text-ink dark:text-gray-100 hover:text-accent dark:hover:text-blue-400 transition-colors"
          >
            {post.title}
          </Link>
          <span className="tag font-mono">{post.language}</span>
          {post.bar && <span className="tag-danger">burn</span>}
          {post.tags?.slice(0, 3).map((t) => <span key={t} className="tag">#{t}</span>)}
        </div>
        {post.description && (
          <p className="text-xs text-ink-4 dark:text-gray-500 mt-0.5 truncate">{post.description}</p>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-ink-4 dark:text-gray-500 shrink-0">
        {post.views !== undefined && (
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.views}</span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
        {isOwner && (
          <button
            onClick={() => onDelete(post)}
            className="btn-ghost btn-icon btn-sm opacity-0 group-hover:opacity-100
                       text-ink-4 hover:text-danger dark:text-gray-500 dark:hover:text-red-400
                       transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── PostCard ─────────────────────────────────────────────────────────────────
const PostCard: React.FC<PostRowProps> = ({ post, user, onDelete }) => {
  const isOwner = post.authorId === user.id;
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    navigate(`/page/${post.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="card p-4 flex flex-col gap-3 cursor-pointer
                 hover:border-ink-5 dark:hover:border-gray-600
                 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/page/${post.id}`}
          className="text-sm font-medium text-ink dark:text-gray-100 hover:text-accent dark:hover:text-blue-400 leading-snug"
        >
          {post.title}
        </Link>
        {isOwner && (
          <button
            onClick={() => onDelete(post)}
            className="btn-ghost btn-icon btn-sm opacity-0 group-hover:opacity-100
                       text-ink-4 hover:text-danger dark:hover:text-red-400 shrink-0 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {post.description && (
        <p className="text-xs text-ink-3 dark:text-gray-400 truncate-2 leading-relaxed">
          {post.description}
        </p>
      )}

      <div className="flex items-center gap-1.5 flex-wrap mt-auto">
        <span className="tag font-mono">{post.language}</span>
        {post.bar && <span className="tag-danger flex items-center gap-1"><Flame className="w-3 h-3" />burn</span>}
        {post.tags?.slice(0, 2).map((t) => <span key={t} className="tag">#{t}</span>)}
      </div>

      <div className="flex items-center gap-3 text-xs text-ink-4 dark:text-gray-500 pt-2 border-t border-border dark:border-gray-700">
        {post.views !== undefined && (
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.views}</span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>
    </div>
  );
};

// ─── NoteList ─────────────────────────────────────────────────────────────────
interface NoteListProps {
  posts: Post[];
  user: User;
  onDelete: (p: Post) => void;
  loading: boolean;
  viewMode: ViewMode;
  selectedLanguage: string;
  selectedTag: string;
  sortBy: SortBy;
}

const NoteList: React.FC<NoteListProps> = ({
  posts, user, onDelete, loading, viewMode, selectedLanguage, selectedTag, sortBy,
}) => {
  const filtered = posts
    .filter((p) => !selectedLanguage || p.language === selectedLanguage)
    .filter((p) => !selectedTag || p.tags?.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "views") return (b.views ?? 0) - (a.views ?? 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  if (loading) {
    if (viewMode === "grid") {
      return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-4 flex flex-col gap-3 min-h-[140px]">
              <div className="h-4 bg-surface-2 dark:bg-gray-800 rounded w-2/3 animate-pulse" />
              <div className="h-3 bg-surface-2 dark:bg-gray-800 rounded w-5/6 animate-pulse" />
              <div className="h-3 bg-surface-2 dark:bg-gray-800 rounded w-1/2 animate-pulse mt-auto" />
              <div className="pt-2 border-t border-border dark:border-gray-800 flex gap-4">
                <div className="h-3 bg-surface-2 dark:bg-gray-800 rounded w-12 animate-pulse" />
                <div className="h-3 bg-surface-2 dark:bg-gray-800 rounded w-16 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-border dark:border-gray-800">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-2 dark:bg-gray-800 rounded w-1/3 animate-pulse" />
              <div className="h-3 bg-surface-2 dark:bg-gray-800 rounded w-1/2 animate-pulse" />
            </div>
            <div className="flex gap-3 shrink-0">
              <div className="h-3 bg-surface-2 dark:bg-gray-800 rounded w-10 animate-pulse" />
              <div className="h-3 bg-surface-2 dark:bg-gray-800 rounded w-16 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <FileCode className="w-8 h-8 text-ink-5 dark:text-gray-700 mb-3" />
        <p className="text-sm text-ink-3 dark:text-gray-500">
          {selectedLanguage || selectedTag ? "No notes match your filters." : "No notes yet."}
        </p>
        {(selectedLanguage || selectedTag) && (
          <p className="text-xs text-ink-4 dark:text-gray-600 mt-1">Try removing a filter.</p>
        )}
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((p) => <PostCard key={p.id} post={p} user={user} onDelete={onDelete} />)}
      </div>
    );
  }

  return (
    <div>
      {filtered.map((p) => <PostRow key={p.id} post={p} user={user} onDelete={onDelete} />)}
    </div>
  );
};

// ─── CreatePanel ──────────────────────────────────────────────────────────────
interface CreatePanelProps {
  user: User;
  currentPage: number;
  onClose: () => void;
}

const CreatePanel: React.FC<CreatePanelProps> = ({ user, currentPage, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [style, setStyle] = useState("atomOneDark");
  const [bar, setBar] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const addPostMutation = useAddPost(currentPage);
  const { data: availableTags = [] } = useTagsQuery();

  const addTag = (t: string) => {
    const clean = t.trim().toLowerCase().replace(/^#/, "");
    if (clean && !tags.includes(clean)) setTags([...tags, clean]);
    setTagInput("");
  };

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); }
    if (e.key === "Backspace" && !tagInput && tags.length) setTags(tags.slice(0, -1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) { toast.error("Title and code are required."); return; }
    try {
      await addPostMutation.mutateAsync({
        title: title.trim(), content, userId: user.id,
        bar, language, tags, description: description.trim(),
      });
      toast.success("Note saved.");
      onClose();
    } catch {
      toast.error("Failed to save note.");
    }
  };

  return (
    <div className="border-b border-border dark:border-gray-800 bg-surface-0 dark:bg-gray-900">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border dark:border-gray-800">
        <h2 className="text-sm font-semibold text-ink dark:text-gray-100">New note</h2>
        <button onClick={onClose} className="btn-ghost btn-icon btn-sm">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">
          {/* Left: metadata */}
          <div className="p-5 space-y-4 border-r border-border dark:border-gray-800">
            <div className="field">
              <label htmlFor="new-title">Title *</label>
              <input
                id="new-title" type="text"
                placeholder="e.g. Debounce hook"
                value={title} onChange={(e) => setTitle(e.target.value)}
                className="input" autoFocus
              />
            </div>

            <div className="field">
              <label htmlFor="new-desc">
                Description <span className="text-ink-4 dark:text-gray-600 font-normal">optional</span>
              </label>
              <input
                id="new-desc" type="text"
                placeholder="What does this snippet do?"
                value={description} onChange={(e) => setDescription(e.target.value)}
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="field">
                <label htmlFor="new-lang">Language</label>
                <select id="new-lang" value={language} onChange={(e) => setLanguage(e.target.value)} className="input">
                  {languages.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="new-style">Highlight theme</label>
                <select id="new-style" value={style} onChange={(e) => setStyle(e.target.value)} className="input">
                  {styles.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="field">
              <label>Tags</label>
              <div className="flex flex-wrap gap-1.5 p-2
                              border border-border dark:border-gray-700
                              rounded min-h-[38px]
                              bg-surface-0 dark:bg-gray-800
                              focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
                {tags.map((t) => (
                  <span key={t} className="tag gap-1">
                    #{t}
                    <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))} className="ml-0.5 hover:text-danger">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
                <input
                  type="text" value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKey}
                  onBlur={() => tagInput && addTag(tagInput)}
                  placeholder={tags.length === 0 ? "Add tags…" : ""}
                  className="flex-1 min-w-[80px] outline-none text-xs
                             text-ink dark:text-gray-100
                             bg-transparent placeholder:text-ink-4 dark:placeholder:text-gray-500"
                />
              </div>
              {availableTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-2xs text-ink-4 dark:text-gray-500">Recent:</span>
                  {availableTags.slice(0, 8).map((t) => (
                    <button
                      key={t} type="button"
                      onClick={() => addTag(t)}
                      disabled={tags.includes(t)}
                      className="tag hover:bg-surface-3 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Burn after read */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox" checked={bar} onChange={() => setBar(!bar)}
                className="w-4 h-4 rounded border-border accent-accent"
              />
              <div>
                <span className="text-sm text-ink dark:text-gray-100 font-medium">Burn after read</span>
                <p className="text-xs text-ink-4 dark:text-gray-500 leading-tight">Note deleted after first view</p>
              </div>
              {bar && <Flame className="w-4 h-4 text-danger ml-auto shrink-0" />}
            </label>
          </div>

          {/* Right: code editor + preview */}
          <div className="flex flex-col">
            <div className="flex border-b border-border dark:border-gray-800">
              <button
                type="button" onClick={() => setTab("write")}
                className={`px-4 py-2.5 text-xs font-medium transition-colors border-r border-border dark:border-gray-800 ${
                  tab === "write"
                    ? "bg-surface-0 dark:bg-gray-900 text-ink dark:text-gray-100"
                    : "bg-surface-1 dark:bg-gray-800 text-ink-3 dark:text-gray-500 hover:text-ink dark:hover:text-gray-200"
                }`}
              >
                Write
              </button>
              <button
                type="button" onClick={() => setTab("preview")}
                className={`px-4 py-2.5 text-xs font-medium transition-colors ${
                  tab === "preview"
                    ? "bg-surface-0 dark:bg-gray-900 text-ink dark:text-gray-100"
                    : "bg-surface-1 dark:bg-gray-800 text-ink-3 dark:text-gray-500 hover:text-ink dark:hover:text-gray-200"
                }`}
              >
                Preview
              </button>
            </div>

            {tab === "write" ? (
              <textarea
                value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your code here…"
                className="textarea flex-1 p-4 text-xs leading-relaxed
                           border-0 focus:ring-0 rounded-none resize-none min-h-[240px]
                           bg-surface-0 dark:bg-gray-900"
              />
            ) : (
              <div className="flex-1 overflow-auto min-h-[240px] bg-surface-0 dark:bg-gray-900">
                {content
                  ? <CodeComponent text={content} language={language} style={style} />
                  : <div className="flex items-center justify-center h-full text-xs text-ink-4 dark:text-gray-600">Nothing to preview.</div>
                }
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-5 py-3
                        border-t border-border dark:border-gray-800
                        bg-surface-1 dark:bg-gray-900">
          <button type="button" onClick={onClose} className="btn-secondary btn-sm">Cancel</button>
          <button type="submit" disabled={addPostMutation.isPending} className="btn-primary btn-sm">
            {addPostMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save note
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Home ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const { user, setuser } = useContext(Usercontext);
  const [showCreate, setShowCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>(() => (localStorage.getItem("viewMode") as ViewMode) || "list");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: postsData, isLoading } = usePostsQuery(currentPage);
  const { data: searchResults = [], isFetching: isSearching } = useSearchQuery(debouncedQ);
  const deletePostMutation = useDeletePost(currentPage);
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();

  const posts = postsData?.posts ?? [];
  const totalPages = postsData?.totalPages ?? 0;
  const totalPosts = postsData?.totalPosts ?? 0;

  // Toggle dark class on <html> — single source of truth
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => { if (!user) navigate("/"); }, [user, navigate]);
  useEffect(() => { localStorage.setItem("viewMode", viewMode); }, [viewMode]);
  useEffect(() => { if (searchResults.length > 0) setShowSearch(true); }, [searchResults]);

  const debouncedSetQ = useCallback(debounce((q: string) => setDebouncedQ(q), 300), []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchTerm(v);
    if (!v.trim()) { setDebouncedQ(""); setShowSearch(false); }
    else debouncedSetQ(v);
  };

  const clearSearch = () => {
    setSearchTerm(""); setDebouncedQ(""); setShowSearch(false);
  };

  const handleDelete = async (post: Post) => {
    if (!user) return;
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    try {
      await deletePostMutation.mutateAsync({ id: post.id, userId: user.id });
      toast.success("Note deleted.");
    } catch { toast.error("Failed to delete note."); }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setuser(null);
      localStorage.removeItem("user");
      queryClient.clear();
      navigate("/");
    }
  };

  const displayedPosts = showSearch && searchResults.length > 0 ? searchResults : posts;

  const SORT_LABELS: Record<SortBy, string> = {
    newest: "Newest first",
    oldest: "Oldest first",
    title: "Alphabetical",
    views: "Most viewed",
  };

  return (
    <div className="min-h-screen bg-surface-1 dark:bg-gray-950 text-ink dark:text-gray-100">
      {/* ── Toolbar ──────────────────────────────────────────── */}
      <header className="toolbar">
        <div className="flex items-center gap-5">
          <span className="font-mono text-xs font-semibold tracking-widest text-ink-3 dark:text-gray-500 uppercase select-none">
            Paster
          </span>

          {/* Search */}
          <div ref={searchRef} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-ink-4 dark:text-gray-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes…"
                value={searchTerm}
                onChange={handleSearch}
                className="input-sm pl-8 pr-8 w-56"
              />
              {isSearching && (
                <Loader2 className="absolute right-2.5 w-3 h-3 animate-spin text-ink-4 dark:text-gray-500" />
              )}
              {searchTerm && !isSearching && (
                <button onClick={clearSearch} className="absolute right-2 text-ink-4 dark:text-gray-500 hover:text-ink dark:hover:text-gray-100">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <SearchDropdown show={showSearch && searchResults.length > 0} results={searchResults} onClose={clearSearch} anchor={searchRef.current} />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link to="/collab" className="btn-ghost btn-sm text-xs">
            <Users className="w-3.5 h-3.5" /> Collab
          </Link>

          <button onClick={() => setDarkMode(!darkMode)} className="btn-icon btn-ghost btn-sm" title="Toggle dark mode">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-medium
                               text-ink-2 dark:text-gray-400
                               hover:bg-surface-2 dark:hover:bg-gray-800
                               transition-colors">
              <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-2xs font-semibold uppercase shrink-0">
                {user?.name?.charAt(0)}
              </span>
              <span className="hidden sm:inline max-w-[100px] truncate">{user?.name}</span>
              <ChevronDown className="w-3 h-3 text-ink-4 dark:text-gray-500" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-44 card shadow-md py-1 hidden group-hover:block z-50">
              <div className="px-3 py-2 border-b border-border dark:border-gray-700">
                <p className="text-xs font-medium text-ink dark:text-gray-100 truncate">{user?.name}</p>
                <p className="text-2xs text-ink-4 dark:text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                disabled={logoutMutation.isPending}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-danger
                           hover:bg-danger-subtle dark:hover:bg-red-900/20 transition-colors"
              >
                {logoutMutation.isPending
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <LogOut className="w-3.5 h-3.5" />}
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Create panel ──────────────────────────────────────── */}
      {showCreate && user && (
        <CreatePanel user={user} currentPage={currentPage} onClose={() => setShowCreate(false)} />
      )}

      {/* ── Layout: sidebar + content ─────────────────────────── */}
      <div className="flex min-h-[calc(100vh-48px)]">
        {/* Sidebar */}
        <aside className="sidebar-w shrink-0 border-r border-border dark:border-gray-800
                          bg-surface-0 dark:bg-gray-950
                          hidden md:flex flex-col py-4 px-3">
          <button onClick={() => setShowCreate(!showCreate)} className="btn-primary w-full mb-5 text-xs">
            <Plus className="w-3.5 h-3.5" /> New note
          </button>

          <div className="space-y-0.5">
            <p className="px-3 py-1 text-2xs font-semibold uppercase tracking-wider text-ink-4 dark:text-gray-600">Sort</p>
            {(Object.keys(SORT_LABELS) as SortBy[]).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={sortBy === s ? "nav-item-active text-xs w-full text-left" : "nav-item text-xs w-full text-left"}
              >
                {SORT_LABELS[s]}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-0.5">
            <p className="px-3 py-1 text-2xs font-semibold uppercase tracking-wider text-ink-4 dark:text-gray-600">Filter</p>

            <div className="px-3 py-1.5">
              <div className="relative">
                <Hash className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-ink-4 dark:text-gray-500" />
                <input
                  type="text" placeholder="Tag…"
                  value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}
                  className="input-sm pl-6 w-full"
                />
              </div>
            </div>

            <div className="px-3 pb-1">
              <select
                value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}
                className="input-sm w-full"
              >
                <option value="">All languages</option>
                {languages.slice(0, 25).map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {(selectedLanguage || selectedTag) && (
              <button
                onClick={() => { setSelectedLanguage(""); setSelectedTag(""); }}
                className="nav-item text-xs w-full text-left text-danger dark:text-red-400"
              >
                <X className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-border dark:border-gray-800">
            <Link to="/collab" className="nav-item text-xs w-full">
              <Users className="w-3.5 h-3.5" /> Real-time collab
            </Link>
            <a
              href="https://github.com/RajBhut"
              target="_blank" rel="noreferrer"
              className="nav-item text-xs w-full"
            >
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Content toolbar */}
          <div className="flex items-center justify-between px-5 py-2.5
                          border-b border-border dark:border-gray-800
                          bg-surface-0 dark:bg-gray-950">
            <div className="flex items-center gap-3">
              {showSearch && searchResults.length > 0 ? (
                <span className="text-sm font-medium text-ink dark:text-gray-100">
                  {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}{" "}
                  <span className="text-accent">"{searchTerm}"</span>
                </span>
              ) : (
                <span className="text-sm font-medium text-ink dark:text-gray-100">
                  {totalPosts > 0 ? `${totalPosts} note${totalPosts !== 1 ? "s" : ""}` : "Notes"}
                </span>
              )}
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-ink-4 dark:text-gray-500" />}
            </div>

            <div className="flex items-center gap-1">
              {/* Mobile create */}
              <button onClick={() => setShowCreate(!showCreate)} className="btn-primary btn-sm text-xs md:hidden">
                <Plus className="w-3.5 h-3.5" /> New
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "btn-secondary btn-icon btn-sm" : "btn-ghost btn-icon btn-sm"}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "btn-secondary btn-icon btn-sm" : "btn-ghost btn-icon btn-sm"}
                title="Grid view"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="flex-1 overflow-auto bg-surface-0 dark:bg-gray-950">
            {user && (
              <NoteList
                posts={displayedPosts}
                user={user}
                onDelete={handleDelete}
                loading={isLoading}
                viewMode={viewMode}
                selectedLanguage={selectedLanguage}
                selectedTag={selectedTag}
                sortBy={sortBy}
              />
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 px-5 py-3
                            border-t border-border dark:border-gray-800
                            bg-surface-0 dark:bg-gray-950">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-ghost btn-icon btn-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                const page = currentPage <= 4 ? i + 1
                  : currentPage >= totalPages - 3 ? totalPages - 6 + i
                  : currentPage - 3 + i;
                if (page < 1 || page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`btn btn-sm min-w-[32px] ${page === currentPage ? "btn-primary" : "btn-ghost"}`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-ghost btn-icon btn-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar closeButton={false} />
    </div>
  );
}
