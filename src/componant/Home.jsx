import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Usercontext } from "./UsrProvider";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as hljsStyles from "react-syntax-highlighter/dist/esm/styles/hljs";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  Plus,
  Minus,
  Save,
  Github,
  Mail,
  Eye,
  EyeOff,
  MoreVertical,
  Trash2,
  Code,
  LogOut,
  ChevronDown,
  Loader2,
  Search,
  Filter,
  Heart,
  Share2,
  Download,
  Star,
  Folder,
  Clock,
  Zap,
  Grid3X3,
  List,
  Settings,
  Moon,
  Sun,
  Tag,
  Calendar,
  BarChart3,
  TrendingUp,
  Bookmark,
  Copy,
  ExternalLink,
  FileText,
  Archive,
  X,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const languages = [
  "oneC",
  "abnf",
  "accesslog",
  "actionscript",
  "ada",
  "angelscript",
  "apache",
  "applescript",
  "arcade",
  "arduino",
  "armasm",
  "asciidoc",
  "aspectj",
  "autohotkey",
  "autoit",
  "avrasm",
  "awk",
  "axapta",
  "bash",
  "basic",
  "bnf",
  "brainfuck",
  "c-like",
  "c",
  "cal",
  "capnproto",
  "ceylon",
  "clean",
  "clojure-repl",
  "clojure",
  "cmake",
  "coffeescript",
  "coq",
  "cos",
  "cpp",
  "crmsh",
  "crystal",
  "csharp",
  "csp",
  "css",
  "d",
  "dart",
  "delphi",
  "diff",
  "django",
  "dns",
  "dockerfile",
  "dos",
  "dsconfig",
  "dts",
  "dust",
  "ebnf",
  "elixir",
  "elm",
  "erb",
  "erlang-repl",
  "erlang",
  "excel",
  "fix",
  "flix",
  "fortran",
  "fsharp",
  "gams",
  "gauss",
  "gcode",
  "gherkin",
  "glsl",
  "gml",
  "go",
  "golo",
  "gradle",
  "groovy",
  "haml",
  "handlebars",
  "haskell",
  "haxe",
  "hsp",
  "htmlbars",
  "http",
  "hy",
  "inform7",
  "ini",
  "irpf90",
  "isbl",
  "java",
  "javascript",
  "jboss-cli",
  "json",
  "julia-repl",
  "julia",
  "kotlin",
  "lasso",
  "latex",
  "ldif",
  "leaf",
  "less",
  "lisp",
  "livecodeserver",
  "livescript",
  "llvm",
  "lsl",
  "lua",
  "makefile",
  "markdown",
  "mathematica",
  "matlab",
  "maxima",
  "mel",
  "mercury",
  "mipsasm",
  "mizar",
  "mojolicious",
  "monkey",
  "moonscript",
  "n1ql",
  "nginx",
  "nim",
  "nix",
  "node-repl",
  "nsis",
  "objectivec",
  "ocaml",
  "openscad",
  "oxygene",
  "parser3",
  "perl",
  "pf",
  "pgsql",
  "php-template",
  "php",
  "plaintext",
  "pony",
  "powershell",
  "processing",
  "profile",
  "prolog",
  "properties",
  "protobuf",
  "puppet",
  "purebasic",
  "python-repl",
  "python",
  "q",
  "qml",
  "r",
  "reasonml",
  "rib",
  "roboconf",
  "routeros",
  "rsl",
  "ruby",
  "ruleslanguage",
  "rust",
  "sas",
  "scala",
  "scheme",
  "scilab",
  "scss",
  "shell",
  "smali",
  "smalltalk",
  "sml",
  "sqf",
  "sql",
  "sql_more",
  "stan",
  "stata",
  "step21",
  "stylus",
  "subunit",
  "swift",
  "taggerscript",
  "tap",
  "tcl",
  "thrift",
  "tp",
  "twig",
  "typescript",
  "vala",
  "vbnet",
  "vbscript-html",
  "vbscript",
  "verilog",
  "vhdl",
  "vim",
  "x86asm",
  "xl",
  "xml",
  "xquery",
  "yaml",
  "zephir",
];

const styles = [
  "a11yDark",
  "a11yLight",
  "agate",
  "anOldHope",
  "androidstudio",
  "arduinoLight",
  "arta",
  "ascetic",
  "atelierCaveDark",
  "atelierCaveLight",
  "atelierDuneDark",
  "atelierDuneLight",
  "atelierEstuaryDark",
  "atelierEstuaryLight",
  "atelierForestDark",
  "atelierForestLight",
  "atelierHeathDark",
  "atelierHeathLight",
  "atelierLakesideDark",
  "atelierLakesideLight",
  "atelierPlateauDark",
  "atelierPlateauLight",
  "atelierSavannaDark",
  "atelierSavannaLight",
  "atelierSeasideDark",
  "atelierSeasideLight",
  "atelierSulphurpoolDark",
  "atelierSulphurpoolLight",
  "atomOneDarkReasonable",
  "atomOneDark",
  "atomOneLight",
  "brownPaper",
  "codepenEmbed",
  "colorBrewer",
  "darcula",
  "dark",
  "defaultStyle",
  "docco",
  "dracula",
  "far",
  "foundation",
  "githubGist",
  "github",
  "gml",
  "googlecode",
  "gradientDark",
  "gradientLight",
  "grayscale",
  "gruvboxDark",
  "gruvboxLight",
  "hopscotch",
  "hybrid",
  "idea",
  "irBlack",
  "isblEditorDark",
  "isblEditorLight",
  "kimbieDark",
  "kimbieLight",
  "lightfair",
  "lioshi",
  "magula",
  "monoBlue",
  "monokaiSublime",
  "monokai",
  "nightOwl",
  "nnfxDark",
  "nnfx",
  "nord",
  "obsidian",
  "ocean",
  "paraisoDark",
  "paraisoLight",
  "pojoaque",
  "purebasic",
  "qtcreatorDark",
  "qtcreatorLight",
  "railscasts",
  "rainbow",
  "routeros",
  "schoolBook",
  "shadesOfPurple",
  "solarizedDark",
  "solarizedLight",
  "srcery",
  "stackoverflowDark",
  "stackoverflowLight",
  "sunburst",
  "tomorrowNightBlue",
  "tomorrowNightBright",
  "tomorrowNightEighties",
  "tomorrowNight",
  "tomorrow",
  "vs",
  "vs2015",
  "xcode",
  "xt256",
  "zenburn",
];

const API_URL = import.meta.env.VITE_API_URL;

const NoteCard = ({
  post,
  user,
  onDelete,
  onBookmark,
  isBookmarked,
  darkMode,
  viewMode,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await onDelete(post);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: `${window.location.origin}/page/${post.id}`,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        navigator.clipboard.writeText(
          `${window.location.origin}/page/${post.id}`
        );
        toast.info("Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/page/${post.id}`
      );
      toast.success("Link copied to clipboard!");
    }
  };

  const getLanguageColor = (lang) => {
    const colors = {
      javascript: "bg-yellow-100 text-yellow-800",
      python: "bg-blue-100 text-blue-800",
      java: "bg-red-100 text-red-800",
      cpp: "bg-purple-100 text-purple-800",
      css: "bg-pink-100 text-pink-800",
      html: "bg-orange-100 text-orange-800",
      default: "bg-gray-100 text-gray-800",
    };
    return colors[post.language] || colors.default;
  };

  if (viewMode === "grid") {
    return (
      <div
        className={`group relative ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } rounded-xl border hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden`}
      >
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Link to={`/page/${post.id}`} className="block">
                <h4
                  className={`font-semibold text-lg mb-2 line-clamp-2 ${
                    darkMode
                      ? "text-white hover:text-blue-400"
                      : "text-gray-900 hover:text-blue-600"
                  } transition-colors`}
                >
                  {post.title}
                </h4>
              </Link>

              {post.description && (
                <p
                  className={`text-sm mb-3 line-clamp-2 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {post.description}
                </p>
              )}

              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(
                    post.language
                  )}`}
                >
                  {post.language || "text"}
                </span>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-1">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
                {post.burnAfterRead && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Burn After Read
                  </span>
                )}
              </div>
            </div>

            {post.authorId === user.id && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all ${
                    darkMode
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div
                    className={`absolute right-0 top-full mt-1 ${
                      darkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } rounded-lg shadow-xl border py-1 w-40 z-10`}
                  >
                    <button
                      onClick={handleDelete}
                      className={`w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 ${
                        darkMode ? "hover:bg-red-900/20" : ""
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            } mb-4 line-clamp-3`}
          >
            {post.content?.substring(0, 100)}...
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              {post.views !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {post.views}
                  </span>
                </div>
              )}

              {post.author && (
                <div className="flex items-center gap-1">
                  <span
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    by {post.author.name || post.author.username || "Anonymous"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLiked(!liked)}
                className={`p-2 rounded-full transition-colors ${
                  liked
                    ? "text-red-500"
                    : darkMode
                    ? "text-gray-400 hover:text-red-400"
                    : "text-gray-400 hover:text-red-500"
                }`}
                title="Like feature coming soon!"
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={handleShare}
                className={`p-2 rounded-full transition-colors ${
                  darkMode
                    ? "text-gray-400 hover:text-blue-400"
                    : "text-gray-400 hover:text-blue-500"
                }`}
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onBookmark(post.id)}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked
                    ? "text-yellow-500"
                    : darkMode
                    ? "text-gray-400 hover:text-yellow-400"
                    : "text-gray-400 hover:text-yellow-500"
                }`}
                title="Bookmark feature coming soon!"
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex items-center ${
        darkMode
          ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
          : "bg-white border-gray-100 hover:border-gray-200"
      } p-4 rounded-xl border hover:shadow-md transition-all duration-200`}
    >
      <div className="flex-1 mr-4">
        <Link to={`/page/${post.id}`} className="block">
          <div className="flex items-center gap-3 mb-2">
            <h4
              className={`font-semibold ${
                darkMode
                  ? "text-white hover:text-blue-400"
                  : "text-gray-900 hover:text-blue-600"
              } transition-colors`}
            >
              {post.title}
            </h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(
                post.language
              )}`}
            >
              {post.language || "text"}
            </span>
            {post.bar && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                BAR
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setLiked(!liked)}
          className={`p-2 rounded-full transition-colors ${
            liked
              ? "text-red-500"
              : darkMode
              ? "text-gray-400 hover:text-red-400"
              : "text-gray-400 hover:text-red-500"
          }`}
          title="Like feature coming soon!"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={handleShare}
          className={`p-2 rounded-full transition-colors ${
            darkMode
              ? "text-gray-400 hover:text-blue-400"
              : "text-gray-400 hover:text-blue-500"
          }`}
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onBookmark(post.id)}
          className={`p-2 rounded-full transition-colors ${
            isBookmarked
              ? "text-yellow-500"
              : darkMode
              ? "text-gray-400 hover:text-yellow-400"
              : "text-gray-400 hover:text-yellow-500"
          }`}
          title="Bookmark feature coming soon!"
        >
          <Bookmark
            className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
          />
        </button>

        {post.authorId === user.id && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all ${
                darkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                className={`absolute right-0 top-full mt-1 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } rounded-lg shadow-xl border py-1 w-32 z-10`}
              >
                <button
                  onClick={handleDelete}
                  className={`w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 ${
                    darkMode ? "hover:bg-red-900/20" : ""
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const NotesSection = ({
  data,
  user,
  onDelete,
  loading,
  darkMode,
  viewMode,
  searchTerm,
  selectedLanguage,
  selectedTag,
  sortBy,
}) => {
  const [bookmarkedNotes, setBookmarkedNotes] = useState(new Set());

  const handleBookmark = (noteId) => {
    const newBookmarks = new Set(bookmarkedNotes);
    if (newBookmarks.has(noteId)) {
      newBookmarks.delete(noteId);
      toast.info("Removed from bookmarks");
    } else {
      newBookmarks.add(noteId);
      toast.success("Added to bookmarks");
    }
    setBookmarkedNotes(newBookmarks);
    // TODO: Implement actual bookmark functionality with backend
    toast.info("Bookmark feature coming soon!");
  };

  const filteredData = data.filter((post) => {
    const matchesSearch =
      searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLanguage =
      selectedLanguage === "" || post.language === selectedLanguage;

    const matchesTag =
      selectedTag === "" ||
      (post.tags &&
        post.tags.some((tag) =>
          tag.toLowerCase().includes(selectedTag.toLowerCase())
        ));

    return matchesSearch && matchesLanguage && matchesTag;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "title":
        return a.title.localeCompare(b.title);
      case "views":
        return (b.views || 0) - (a.views || 0);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <FileText className="w-6 h-6 text-blue-500 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Loading your notes...
        </p>
      </div>
    );
  }

  if (sortedData.length === 0 && user) {
    return (
      <div className="text-center py-12">
        <div
          className={`w-24 h-24 mx-auto mb-6 rounded-full ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          } flex items-center justify-center`}
        >
          <FileText
            className={`w-12 h-12 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          />
        </div>
        <h3
          className={`text-xl font-semibold mb-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {searchTerm || selectedLanguage ? "No notes found" : "No notes yet"}
        </h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} mb-6`}>
          {searchTerm || selectedLanguage
            ? "Try adjusting your search filters"
            : "Create your first note and start sharing your code!"}
        </p>
        {!searchTerm && !selectedLanguage && (
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 mx-auto">
            <Plus className="w-5 h-5" />
            Create Your First Note
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`space-y-4 ${
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 space-y-0"
          : ""
      }`}
    >
      {sortedData.map((post) => (
        <NoteCard
          key={post.id}
          post={post}
          user={user}
          onDelete={onDelete}
          onBookmark={handleBookmark}
          isBookmarked={bookmarkedNotes.has(post.id)}
          darkMode={darkMode}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export const CodeComponent = ({ text, language, style, darkMode }) => {
  const selectedStyle = hljsStyles[style] || hljsStyles.docco;

  return (
    <div className="w-full  overflow-hidden shadow-2xl border border-gray-200/50">
      <div
        className={`flex items-center justify-between px-4 py-3 ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-gray-50 border-gray-200"
        } border-b`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {language}
          </span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(text);
            toast.success("Code copied to clipboard!");
          }}
          className={`p-2 rounded-md transition-colors ${
            darkMode
              ? "hover:bg-gray-700 text-gray-400"
              : "hover:bg-gray-200 text-gray-500"
          }`}
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
      <SyntaxHighlighter
        customStyle={{
          minHeight: "40vh",
          padding: "24px",
          margin: 0,
          backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        }}
        wrapLongLines
        language={language}
        style={selectedStyle}
      >
        {text}
      </SyntaxHighlighter>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user, setuser } = useContext(Usercontext);
  const [data, setData] = useState([]);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [style, setStyle] = useState("atomOneDark");
  const textarea = useRef(null);
  const [title, setTitle] = useState("");
  const [burnAfterRead, setBurnAfterRead] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPost, setTotalPost] = useState(0);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("viewMode") || "list"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [description, setDescription] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/post`, {
        withCredentials: true,
        params: { page, limit: 12 },
      });

      setData(res.data.posts);
      setCurrentPage(res.data.currentPage);
      setTotalPost(res.data.totalPosts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error("Failed to fetch posts.");
    }
    setLoading(false);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisible = 5;

    for (
      let i = Math.max(1, currentPage - 2);
      i <= Math.min(totalPages, currentPage + 2);
      i++
    ) {
      pageNumbers.push(
        <button
          onClick={() =>
            setCurrentPage(currentPage === i ? currentPage : fetchPosts(i))
          }
          className={`px-4 py-2 mx-1 rounded-lg font-medium transition-colors ${
            currentPage === i
              ? "bg-blue-600 text-white shadow-lg"
              : darkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="flex items-center justify-center gap-2">
        {currentPage > 1 && (
          <button
            onClick={() => fetchPosts(1)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            First
          </button>
        )}
        {pageNumbers}
        {currentPage < totalPages && (
          <button
            onClick={() => fetchPosts(totalPages)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Last
          </button>
        )}
      </div>
    );
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post(`${API_URL}/user/logout`, {}, { withCredentials: true });
      setuser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to logout.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const addPost = async () => {
    if (!text || !title) {
      toast.warning("Please enter content and title before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${API_URL}/post`,
        {
          title,
          content: text,
          userId: user.id,
          bar: burnAfterRead,
          language,
          tags: selectedTag ? [selectedTag] : [],
          description,
        },
        { withCredentials: true }
      );

      setData([...data, res.data]);
      setText("");
      setTitle("");
      setDescription("");
      setSelectedTag("");
      fetchPosts(1);
      toast.success("Note created successfully! 🎉");
      setAddNew(false);
    } catch (error) {
      if (error.status === 401) {
        navigate("/");
      }
      toast.error("Failed to add note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePost = async (post) => {
    try {
      const res = await axios.delete(`${API_URL}/post/${post.id}`, {
        withCredentials: true,
        data: { userId: user.id, single_post: post },
      });

      if (res.data.message) {
        navigate("/home");
        toast.info("Post deleted and redirected to home.");
      } else {
        fetchPosts();
        toast.success("Post deleted successfully.");
      }
    } catch (error) {
      toast.error("Failed to delete post.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header
          className={`${
            darkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white/80 border-gray-200"
          } backdrop-blur-xl rounded-2xl border shadow-xl mb-8 `}
        >
          <div className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h1
                    className={`text-4xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Paster
                  </h1>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Your ultimate code sharing platform
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={() => setAddNew(!addNew)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${
                    addNew
                      ? darkMode
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl"
                  }`}
                >
                  {addNew ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  {addNew ? "Cancel" : "New Note"}
                </button>

                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showUserMenu && (
                    <div
                      className={`absolute right-0 top-full mt-2 ${
                        darkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      } rounded-lg shadow-xl border py-2 w-48 z-20`}
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {user?.name || "User"}
                        </p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {user?.email || ""}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          toast.info("Profile settings coming soon!");
                        }}
                        className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        } flex items-center gap-2`}
                      >
                        <Settings className="w-4 h-4" />
                        Profile Settings
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        disabled={isLoggingOut}
                        className={`w-full px-4 py-2 text-sm text-left transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 disabled:opacity-50`}
                      >
                        {isLoggingOut ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <LogOut className="w-4 h-4" />
                        )}
                        {isLoggingOut ? "Signing Out..." : "Sign Out"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="mt-6 flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search your notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } focus:ring-2 focus:ring-blue-500/20`}
                />
              </div>

              <div className="flex-1 relative lg:max-w-xs">
                <Tag
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Filter by tag..."
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } focus:ring-2 focus:ring-blue-500/20`}
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className={`px-4 py-3 rounded-xl border transition-all ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="">All Languages</option>
                  {languages.slice(0, 20).map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-3 rounded-xl border transition-all ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">By Title</option>
                  <option value="views">Most Viewed</option>
                </select>

                <button
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                  className={`p-3 rounded-xl transition-colors ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  {viewMode === "grid" ? (
                    <List className="w-5 h-5" />
                  ) : (
                    <Grid3X3 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Note Creator */}
        {addNew && (
          <div
            className={`${
              darkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white/80 border-gray-200"
            } backdrop-blur-xl rounded-2xl border shadow-xl mb-8 overflow-hidden`}
          >
            <div className={`bg-blue-600 px-6 py-4`}>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="w-6 h-6" />
                Create Something Amazing
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Give your code a catchy title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Description
                    </label>
                    <textarea
                      placeholder="Brief description of your code..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500/20`}
                      >
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Theme
                      </label>
                      <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:ring-2 focus:ring-blue-500/20`}
                      >
                        {styles.map((sty) => (
                          <option key={sty} value={sty}>
                            {sty}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Code *
                  </label>
                  <textarea
                    ref={textarea}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your amazing code here..."
                    className={`w-full h-64 px-4 py-3 rounded-xl border font-mono text-sm transition-all ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={burnAfterRead}
                      onChange={() => setBurnAfterRead(!burnAfterRead)}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Burn After Read
                    </span>
                    {burnAfterRead ? (
                      <Zap className="w-5 h-5 text-red-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </label>
                </div>

                <button
                  onClick={addPost}
                  disabled={isSubmitting || !text || !title}
                  className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isSubmitting ? "Creating..." : "Create Note"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Notes Section */}
          <div className="xl:col-span-3">
            <div
              className={`${
                darkMode
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-white/80 border-gray-200"
              } backdrop-blur-xl rounded-2xl border shadow-xl overflow-hidden`}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Your Notes
                    </h2>
                  </div>
                  <div className="flex items-center gap-4">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        <span
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Loading...
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } flex items-center gap-2`}
                      >
                        <BarChart3 className="w-4 h-4" />
                        {totalPost} notes total
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <NotesSection
                  data={data}
                  user={user}
                  loading={loading}
                  onDelete={deletePost}
                  darkMode={darkMode}
                  viewMode={viewMode}
                  searchTerm={searchTerm}
                  selectedLanguage={selectedLanguage}
                  selectedTag={selectedTag}
                  sortBy={sortBy}
                />
              </div>

              {totalPages > 1 && (
                <div
                  className={`px-6 py-4 border-t ${
                    darkMode
                      ? "border-gray-700 bg-gray-800/30"
                      : "border-gray-200 bg-gray-50/50"
                  }`}
                >
                  {renderPagination()}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Preview Section */}
            <div
              className={`${
                darkMode
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-white/80 border-gray-200"
              } backdrop-blur-xl rounded-2xl border shadow-xl overflow-hidden`}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3
                  className={`font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  } flex items-center gap-2`}
                >
                  <Eye className="w-5 h-5" />
                  Live Preview
                </h3>
              </div>
              <div className="p-4">
                <CodeComponent
                  text={text || "// Your code preview will appear here..."}
                  language={language}
                  style={style}
                  darkMode={darkMode}
                />
              </div>
            </div>

            <div
              className={`${
                darkMode
                  ? "bg-gray-800/30 border-gray-700"
                  : "bg-white/50 border-gray-200"
              } backdrop-blur-xl rounded-2xl border p-6`}
            >
              <h3
                className={`font-bold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                } flex items-center gap-2`}
              >
                <Settings className="w-5 h-5 text-blue-500" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => toast.info("Export feature coming soon!")}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-700"
                  } flex items-center gap-3`}
                >
                  <Archive className="w-4 h-4" />
                  Export All Notes
                </button>
                <button
                  onClick={() => toast.info("Backup feature coming soon!")}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-700"
                  } flex items-center gap-3`}
                >
                  <Download className="w-4 h-4" />
                  Backup Data
                </button>
                <button
                  onClick={logout}
                  disabled={isLoggingOut}
                  className={`w-full p-3 rounded-lg text-left transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  {isLoggingOut ? "Signing Out..." : "Sign Out"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="mt-12 py-8">
          <div
            className={`${
              darkMode
                ? "bg-gray-800/30 border-gray-700"
                : "bg-white/50 border-gray-200"
            } backdrop-blur-xl rounded-2xl border p-6`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4"></div>
              <div className="flex items-center space-x-4">
                <a
                  href="mailto:rajbhut2832005@gmail.com"
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com/RajBhut"
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
          className="!z-50"
        />
      </div>
    </div>
  );
}
