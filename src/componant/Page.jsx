import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Usercontext } from "./UsrProvider";
import { CodeComponent } from "./Home";
import QRCode from "react-qr-code";
import axios from "axios";
import { BiUpvote, BiSolidUpvote } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import { Home, Copy, QrCode, Palette, Code, X } from "lucide-react";
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

export default function Page() {
  const { user } = useContext(Usercontext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [upvotecount, setUpvotecount] = useState(0);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [style, setStyle] = useState("atomOneDark");
  const [title, setTitle] = useState("New Document");
  const [showQr, setShowQr] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [is_upvoted, setIsUpvoted] = useState(false);

  useEffect(() => {
    fetchUpvotedata();
  }, []);
  async function fetchUpvotedata() {
    try {
      const res = await axios.get(
        `${API_URL}/post/upvotes/data`,
        {
          postId: Number(id),
          userId: Number(user.id),
        },
        {
          withCredentials: true,
        }
      );
      const { upvotecount, userupvote } = res.data;
      setIsUpvoted(userupvote);
      setUpvotecount(upvotecount);
    } catch (error) {
      console.error(error);
    }
  }
  async function upvote() {
    try {
      const res = await axios.post(
        `${API_URL}/post/upvote`,
        {
          postId: Number(id),
          userId: Number(user.id),
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.message === "Upvoted") {
        setIsUpvoted(true);
      } else {
        setIsUpvoted(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchNote = async () => {
    try {
      const res = await axios.get(`${API_URL}/post/${id}`, {
        withCredentials: true,
      });

      if (res.data.message) {
        navigate("/home");
      } else {
        setTitle(res.data.title);
        setText(res.data.content);
      }
    } catch (error) {
      toast.error("Note not found", {
        icon: "📋",
      });
      navigate("/home");
    }
  };

  useEffect(() => {
    fetchNote();
    fetchUpvotedata();
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      icon: "📋",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-4">
            <Link
              to="/home"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <h1 className="text-2xl font-bold mr-10 text-gray-900">{title}</h1>
            {upvotecount}
            {is_upvoted ? (
              <BiSolidUpvote
                onClick={() => upvote()}
                className="w-6 h-6 text-red-500"
              />
            ) : (
              <BiSolidUpvote
                onClick={() => upvote()}
                className="w-6 h-6"
              ></BiSolidUpvote>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Code
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Palette className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={() => setShowQr(!showQr)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {showQr ? (
                <X className="w-4 h-4" />
              ) : (
                <QrCode className="w-4 h-4" />
              )}
              {showQr ? "Hide QR" : "Show QR"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Panel */}
          {showSettings && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Editor Settings
                  </h2>
                </div>

                <div className="space-y-4">
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
            </div>
          )}

          {/* Main Content */}
          <div
            className={`${showSettings ? "lg:col-span-3" : "lg:col-span-4"}`}
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Code Preview
                </h2>
                {showQr && text && (
                  <div className="p-4 bg-white rounded-lg shadow-lg">
                    <QRCode
                      size={256}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "128px",
                      }}
                      value={`https://paster.rajb.codes/page/${id}`}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                )}
              </div>
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
      </div>
    </div>
  );
}
