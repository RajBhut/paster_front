import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Usercontext } from "./UsrProvider";
import { CodeComponent } from "./Home";

import "./Page.css";

export default function Page() {
  const { user } = useContext(Usercontext);
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [language, setLanguage] = useState("java");
  const [style, setStyle] = useState("docco");
  const [title, setTitle] = useState("New Document");

  const id = useParams().id;

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);
  const fatch = async () => {
    const res = await fetch(`http://localhost:3000/post/${id}`);
    const data = await res.json();
    if (data.message) {
      navigate("/home");
    } else {
      setTitle(data.title);
      setText(data.content);
    }
  };

  useEffect(() => {
    fatch();
  }, []);

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
  const copytoclipbord = () => {
    navigator.clipboard.writeText(text);
  };
  return (
    <>
      <div className="main">
        <h1>{title}</h1>
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
        <button onClick={() => copytoclipbord()}>copy</button>
        <div className="pre">
          <CodeComponent text={text} language={language} style={style} />
        </div>
      </div>
    </>
  );
}
