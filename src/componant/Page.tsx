import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Usercontext } from "./UsrProvider";
import { CodeComponent } from "./Home";
import QRCode from "react-qr-code";
import { BiSolidUpvote } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import {
  Home,
  Copy,
  QrCode,
  Code2,
  X,
  Share2,
  Download,
  Heart,
  Eye,
  Calendar,
  User,
  Settings,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Save,
  Trash2,
  Flag,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Loader2,
  Flame,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { languages, styles } from "./const";
import {
  usePostQuery,
  useUpdatePost,
  useDeletePost,
  useUpvoteData,
  useUpvote,
} from "@/hooks/usePosts";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Page() {
  const { user } = useContext(Usercontext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [style, setStyle] = useState("atomOneDark");
  const [showQr, setShowQr] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLanguage, setEditLanguage] = useState("javascript");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editContent, setEditContent] = useState("");

  const { data: note, isLoading } = usePostQuery(id);
  const { data: upvoteData } = useUpvoteData(id ? Number(id) : undefined);
  const updateMutation = useUpdatePost(id!);
  const deleteMutation = useDeletePost(1);
  const upvoteMutation = useUpvote(id ? Number(id) : 0);

  const upvotecount = upvoteData?.upvotecount ?? 0;
  const is_upvoted = upvoteData?.userupvote ?? false;
  const isOwner = !!(user && note && note.authorId === user.id);

  useEffect(() => { localStorage.setItem("darkMode", String(darkMode)); }, [darkMode]);
  useEffect(() => { if (!user) navigate("/"); }, [user, navigate]);
  useEffect(() => {
    if (note && (note as unknown as { message?: string }).message) navigate("/home");
  }, [note, navigate]);

  useEffect(() => {
    if (note && !("message" in (note as object))) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditDescription(note.description ?? "");
      setEditLanguage(note.language);
      setEditTags(note.tags ?? []);
    }
  }, [note]);

  if (isLoading || !note) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-950" : "bg-surface-1"}`}>
        <Loader2 className="w-5 h-5 animate-spin text-ink-4" />
      </div>
    );
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  const copyToClipboard = () => {
    navigator.clipboard.writeText(note.content);
    toast.success("Copied");
  };

  const downloadCode = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([note.content], { type: "text/plain" }));
    a.download = `${note.title.replace(/\s+/g, "_")}.${note.language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Downloaded");
  };

  const shareNote = async () => {
    const url = `${window.location.origin}/page/${id}`;
    if (navigator.share) {
      try { await navigator.share({ title: note.title, url }); return; }
      catch { /* fallthrough */ }
    }
    navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  const handleUpvote = async () => {
    if (!user) return;
    try {
      await upvoteMutation.mutateAsync({ userId: user.id });
    } catch {
      toast.error("Failed to vote");
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    try {
      await updateMutation.mutateAsync({
        title: editTitle,
        content: editContent,
        description: editDescription,
        language: editLanguage,
        tags: editTags,
      });
      setIsEditing(false);
      toast.success("Note updated.");
    } catch (err: unknown) {
      const s = (err as { response?: { status?: number } })?.response?.status;
      toast.error(s === 403 ? "Not authorized" : "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    try {
      await deleteMutation.mutateAsync({ id: note.id, userId: user.id });
      navigate("/home");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const dim = darkMode;

  return (
    <div className={`min-h-screen flex flex-col ${dim ? "bg-gray-950 text-gray-100" : "bg-surface-1 text-ink"}`}>
      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <header className={`toolbar ${dim ? "bg-gray-900 border-gray-800" : ""}`}>
        {/* Left: breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            to="/home"
            className={`flex items-center gap-1.5 text-xs ${dim ? "text-gray-400 hover:text-gray-100" : "text-ink-3 hover:text-ink"} transition-colors shrink-0`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Notes</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-ink-5 shrink-0" />
          <span className={`text-sm font-medium truncate ${dim ? "text-gray-100" : "text-ink"}`}>
            {note.title}
          </span>
          {note.bar && <span className="tag-danger ml-1 shrink-0">burn</span>}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 shrink-0">
          {isOwner && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className={`btn-ghost btn-sm text-xs ${dim ? "text-gray-300 hover:bg-gray-800" : ""}`}
              >
                <Code2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className={`btn-ghost btn-sm text-xs text-danger hover:bg-danger-subtle ${dim ? "hover:bg-red-900/30" : ""}`}
              >
                {deleteMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete
              </button>
            </>
          )}

          {isEditing && (
            <>
              <button
                onClick={handleSaveEdit}
                disabled={updateMutation.isPending}
                className="btn-primary btn-sm text-xs"
              >
                {updateMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className={`btn-secondary btn-sm text-xs ${dim ? "bg-gray-800 border-gray-700 text-gray-300" : ""}`}
              >
                Cancel
              </button>
            </>
          )}

          {!isEditing && (
            <>
              <button onClick={copyToClipboard} className={`btn-ghost btn-icon btn-sm ${dim ? "text-gray-300 hover:bg-gray-800" : ""}`} title="Copy code">
                <Copy className="w-4 h-4" />
              </button>
              <button onClick={downloadCode} className={`btn-ghost btn-icon btn-sm ${dim ? "text-gray-300 hover:bg-gray-800" : ""}`} title="Download">
                <Download className="w-4 h-4" />
              </button>
              <button onClick={shareNote} className={`btn-ghost btn-icon btn-sm ${dim ? "text-gray-300 hover:bg-gray-800" : ""}`} title="Share">
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowQr(!showQr)}
                className={`btn-ghost btn-icon btn-sm ${dim ? "text-gray-300 hover:bg-gray-800" : ""}`}
                title="QR code"
              >
                <QrCode className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`btn-ghost btn-icon btn-sm ${showSettings ? (dim ? "bg-gray-800" : "bg-surface-2") : ""} ${dim ? "text-gray-300 hover:bg-gray-800" : ""}`}
                title="View settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`btn-ghost btn-icon btn-sm ${dim ? "text-gray-300 hover:bg-gray-800" : ""}`}
            title="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── Meta row ─────────────────────────────────────────────── */}
      <div className={`px-5 py-3 border-b flex flex-wrap items-center gap-x-5 gap-y-1.5 ${dim ? "border-gray-800 bg-gray-900" : "border-border bg-surface-0"}`}>
        <div className="flex items-center gap-1.5 text-xs text-ink-3">
          {note.author && (
            <>
              <User className="w-3.5 h-3.5" />
              <span>{note.author.name ?? "Unknown"}</span>
              <span className="text-ink-5">·</span>
            </>
          )}
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          {note.views !== undefined && (
            <>
              <span className="text-ink-5">·</span>
              <Eye className="w-3.5 h-3.5" />
              <span>{note.views} views</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="tag font-mono">{note.language}</span>
          {note.bar && <span className="tag-danger flex items-center gap-1"><Flame className="w-3 h-3" />burn after read</span>}
          {note.tags?.map((t) => <span key={t} className="tag">#{t}</span>)}
        </div>

        {/* Engagement */}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={handleUpvote}
            disabled={upvoteMutation.isPending}
            className={`btn btn-sm text-xs gap-1.5 ${is_upvoted ? "btn-primary" : dim ? "btn-ghost text-gray-300 hover:bg-gray-800" : "btn-ghost"}`}
          >
            <BiSolidUpvote className="w-3.5 h-3.5" />
            {upvotecount}
          </button>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`btn-ghost btn-icon btn-sm ${isLiked ? "text-danger" : dim ? "text-gray-400 hover:bg-gray-800" : ""}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() => { setIsBookmarked(!isBookmarked); toast.success(isBookmarked ? "Removed" : "Bookmarked"); }}
            className={`btn-ghost btn-icon btn-sm ${isBookmarked ? "text-warning" : dim ? "text-gray-400 hover:bg-gray-800" : ""}`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() => toast.info("Report submitted.")}
            className={`btn-ghost btn-icon btn-sm ${dim ? "text-gray-400 hover:bg-gray-800" : "text-ink-4"}`}
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* Settings sidebar */}
        {showSettings && !isEditing && (
          <aside className={`w-56 shrink-0 border-r ${dim ? "border-gray-800 bg-gray-900" : "border-border bg-surface-0"} p-4 space-y-5 overflow-y-auto`}>
            <div>
              <p className="text-2xs font-semibold uppercase tracking-wider text-ink-4 mb-2">Language</p>
              <select
                value={note.language}
                onChange={() => {}}
                className={`input-sm w-full ${dim ? "bg-gray-800 border-gray-700 text-gray-100" : ""}`}
              >
                {languages.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <p className="text-2xs font-semibold uppercase tracking-wider text-ink-4 mb-2">Highlight theme</p>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className={`input-sm w-full ${dim ? "bg-gray-800 border-gray-700 text-gray-100" : ""}`}
              >
                {styles.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="pt-3 border-t border-border">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`btn-ghost btn-sm text-xs w-full ${dim ? "text-gray-300 hover:bg-gray-800" : ""}`}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              </button>
            </div>
          </aside>
        )}

        {/* Code panel */}
        <main className={`flex-1 min-w-0 overflow-auto ${isFullscreen ? "fixed inset-0 z-50 " + (dim ? "bg-gray-950" : "bg-surface-0") : ""}`}>
          {isFullscreen && (
            <div className={`flex items-center justify-end px-4 py-2 border-b ${dim ? "border-gray-800 bg-gray-900" : "border-border bg-surface-0"}`}>
              <button onClick={() => setIsFullscreen(false)} className="btn-ghost btn-sm text-xs">
                <Minimize2 className="w-3.5 h-3.5" /> Exit fullscreen
              </button>
            </div>
          )}

          {isEditing ? (
            // ── Edit form ──────────────────────────────────────────
            <div className="max-w-3xl mx-auto p-6 space-y-5">
              <h2 className="text-base font-semibold text-ink">Edit note</h2>

              <div className="field">
                <label htmlFor="edit-title">Title *</label>
                <input id="edit-title" type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="input" />
              </div>

              <div className="field">
                <label htmlFor="edit-desc">Description</label>
                <input id="edit-desc" type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="input" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="field">
                  <label htmlFor="edit-lang">Language</label>
                  <select id="edit-lang" value={editLanguage} onChange={(e) => setEditLanguage(e.target.value)} className="input">
                    {languages.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="edit-tags">Tags <span className="text-ink-4 font-normal">(comma-separated)</span></label>
                  <input
                    id="edit-tags"
                    type="text"
                    value={editTags.join(", ")}
                    onChange={(e) => setEditTags(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                    placeholder="javascript, react"
                    className="input"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="edit-content">Code *</label>
                <textarea
                  id="edit-content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={20}
                  className="textarea text-xs"
                />
              </div>
            </div>
          ) : (
            // ── Code view ─────────────────────────────────────────
            <div className="p-4">
              <CodeComponent text={note.content} language={note.language} style={style} />
            </div>
          )}
        </main>
      </div>

      {/* ── QR modal ─────────────────────────────────────────────── */}
      {showQr && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className={`card shadow-md p-6 w-full max-w-xs ${dim ? "bg-gray-900 border-gray-800" : ""}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-ink">Scan to open</h3>
              <button onClick={() => setShowQr(false)} className="btn-ghost btn-icon btn-sm">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-center p-4 bg-white rounded-md">
              <QRCode size={180} value={`${window.location.origin}/page/${id}`} level="M" />
            </div>
            <p className="text-xs text-ink-4 text-center mt-3">{window.location.origin}/page/{id}</p>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar
        closeButton={false}
        className="!text-sm"
      />
    </div>
  );
}
