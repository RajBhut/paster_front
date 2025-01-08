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

const NoteCard = ({ post, user, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await onDelete(post);
    }
  };

  return (
    <div className="group relative flex items-center bg-white p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
      <Link
        to={`/page/${post.id}`}
        className="flex-1 text-gray-900 hover:text-blue-600"
      >
        <h4 className="font-medium truncate">{post.title}</h4>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </Link>

      {post.authorId === user.id && (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-gray-100 py-1 w-32 z-10">
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NotesSection = ({ data, user, onDelete, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Your Notes</h2>
      <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
        {data.length === 0 && user != null ? (
          <div className="text-center py-8 text-gray-500">
            {!loading ? (
              " No notes yet. Create your first note!"
            ) : (
              <div className="w-full flex flex-col items-center justify-center">
                <img src="Rhombus.gif" className="w-10 h-10" alt="" />
                <h3>loading...</h3>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((post) => (
              <NoteCard
                key={post.id}
                post={post}
                user={user}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CodeComponent = ({ text, language, style }) => {
  const selectedStyle = hljsStyles[style] || hljsStyles.docco;
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <SyntaxHighlighter
        customStyle={{
          minHeight: "40vh",
          padding: "20px",
          margin: 0,
          borderRadius: "0.5rem",
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
  const [loading, setloading] = useState(false);
  const { user, setuser } = useContext(Usercontext);
  const [data, setData] = useState([]);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [style, setStyle] = useState("atomOneDark");
  const textarea = useRef(null);
  const [title, setTitle] = useState("New Document");
  const [burnAfterRead, setBurnAfterRead] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const fetchPosts = async (page = 1) => {
    setloading(true);
    try {
      const res = await axios.get(`${API_URL}/post`, {
        withCredentials: true,
        params: { page, limit: 5 },
      });

      setData(res.data.posts);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error("Failed to fetch posts.");
    }
    setloading(false);
  };
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => fetchPosts(i)}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/user/logout`, {}, { withCredentials: true });
      setuser(null);
    } catch (error) {
      toast.error("Failed to logout.");
    }
  };
  const addPost = async () => {
    if (!text || !title) {
      toast.warning("Please enter content and title before submitting.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/post`,
        {
          title,
          content: text,
          userId: user.id,
          bar: burnAfterRead,
        },
        { withCredentials: true }
      );

      setData([...data, res.data]);
      setText("");
      setTitle("");
      textarea.current.value = "";
      fetchPosts(1);
      toast.success("Note added successfully!");
    } catch (error) {
      if (error.status == 401) {
        navigate("/");
      }
      toast.error("Failed to add note.");
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
      const menus = document.querySelectorAll(".absolute.right-0.top-full");
      menus.forEach((menu) => {
        if (!menu.contains(event.target) && !event.target.closest("button")) {
          const noteCard = menu.closest(".group");
          if (noteCard) {
            noteCard.querySelector("button").click();
          }
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold font-bold text-gray-900">
            Paster
          </h1>

          <button
            onClick={() => setAddNew((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {addNew ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {addNew ? "Hide Editor" : "New Note"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {addNew && (
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  ref={textarea}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your code here..."
                  className="w-full h-40 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex items-center justify-between">
                  <button
                    onClick={addPost}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Note
                  </button>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-gray-700">
                      <input
                        type="checkbox"
                        checked={burnAfterRead}
                        onChange={() => setBurnAfterRead(!burnAfterRead)}
                        className="w-4 h-4 rounded"
                      />
                      Burn After Read
                      {burnAfterRead ? (
                        <EyeOff className="w-4 h-4 text-red-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            <NotesSection
              data={data}
              user={user}
              loading={loading}
              onDelete={deletePost}
            />
            {renderPagination()}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Editor Settings
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
              <CodeComponent text={text} language={language} style={style} />
            </div>
          </div>
        </div>

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
          theme="light"
        />
        <footer className=" min-h-fit   text-gray-500 text-sm">
          <p className="text-center">© 2024 Paster. All rights reserved</p>
          <p className="flex  text-center gap-3 justify-end items-center">
            <a className="" href="mailto:rajbhut2832005@gmail.com">
              <Mail />
            </a>
            <a className="float-end flex" href="https://github.com/RajBhut">
              <Github />
            </a>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-red-500 my-3  text-white p-2 rounded-md float-end"
            >
              Logout
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
}
