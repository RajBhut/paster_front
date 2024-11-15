import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Usercontext } from "./UsrProvider";
import "./Home.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as hljsStyles from "react-syntax-highlighter/dist/esm/styles/hljs";
import axios from "axios";
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

export const CodeComponent = ({ text, language, style }) => {
  const selectedStyle = hljsStyles[style] || hljsStyles.docco;
  return (
    <SyntaxHighlighter
      customStyle={{ minHeight: "40vh", padding: "20px", minWidth: "50vw" }}
      wrapLongLines
      language={language}
      style={selectedStyle}
    >
      {text}
    </SyntaxHighlighter>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { user, setuser } = useContext(Usercontext);
  const [data, setData] = useState([]);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("java");
  const [style, setStyle] = useState("docco");
  const textarea = useRef(null);
  const [title, settitle] = useState("New Document");

  const addPost = async () => {
    const text = textarea.current.value;
    if (text) {
      try {
        // const res = await fetch("https://past-back.vercel.app/post", {
        //   method: "POST",
        //   credentials: "include",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     title: title,
        //     content: text,
        //     userId: user.id,
        //   }),
        // });
        const res = await axios.post(
          "https://past-back.vercel.app/post",
          {
            title: title,
            content: text,
            userId: user.id,
          },
          { withCredentials: true }
        );
        const newData = await res.data;
        setData([...data, newData]);
        textarea.current.value = "";
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // const res = await fetch("https://past-back.vercel.app/post", {
        //   method: "GET",
        //   credentials: "include",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });
        const res = await axios.get("https://past-back.vercel.app/post", {
          withCredentials: true,
        });
        const data = await res.data;
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  });
  return (
    <div className="home">
      <header
        style={{
          minHeight: "fit-content",
        }}
      >
        <h1>Home</h1>
      </header>

      <div className="container">
        <div className="add">
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => settitle(e.target.value)}
            style={{ padding: "10px 10px", fontSize: "large" }}
          />
          <textarea
            ref={textarea}
            onChange={(e) => setText(e.currentTarget.value)}
            placeholder="Add a note"
          ></textarea>
          <button onClick={addPost}>Add</button>
        </div>

        <div className="data">
          {data.map((post, index) => (
            <Link key={index} to={`/page/${post.id}`}>
              <div key={index} className="cards" style={{ color: "black" }}>
                <h4>{post.title}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="settings">
        <label>
          Language:
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </label>

        <label>
          Style:
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            {styles.map((sty) => (
              <option key={sty} value={sty}>
                {sty}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="pre">
        <CodeComponent text={text} language={language} style={style} />
      </div>
    </div>
  );
}
