import Navbar from '../components/Navbar';
import Select from 'react-select';
import React, { useState, useMemo } from 'react'
import { BsStars } from 'react-icons/bs';
import { FaCode } from "react-icons/fa";
import Editor from '@monaco-editor/react';
import { MdContentCopy, MdRefresh } from "react-icons/md";
import { BiExport } from "react-icons/bi";
import { ImNewTab } from 'react-icons/im';
import { RingLoader } from 'react-spinners'
import { toast } from 'react-toastify';
import { IoCloseSharp } from "react-icons/io5";





const Home = () => {



  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ]



  const [frameWork, setFrameWork] = useState(null);
  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [theme, setTheme] = useState("dark");


  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

 async function getResponse() {
  try {
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
       framework: frameWork?.value
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }

setCode(data.code);
    setOutputScreen(true);

  } catch (error) {
    console.error("Generation error:", error);
    toast.error(error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}




 
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy code!');
    }
  }
  //code for downloading code
  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  const selectStyles = useMemo(() => ({
    control: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#111" : "#fff",
      borderColor: theme === "dark" ? "#333" : "#d1d5db",
      color: theme === "dark" ? "#fff" : "#000",
      boxShadow: "none",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "#111" : "#fff",
      color: theme === "dark" ? "#fff" : "#000"
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? (theme === "dark" ? "#333" : "#ddd")
        : state.isFocused
          ? (theme === "dark" ? "#222" : "#f3f4f6")
          : (theme === "dark" ? "#111" : "#fff"),
      color: theme === "dark" ? "#fff" : "#000"
    }),
    singleValue: (base) => ({
      ...base,
      color: theme === "dark" ? "#fff" : "#000"
    }),
    placeholder: (base) => ({
      ...base,
      color: theme === "dark" ? "#aaa" : "#666"
    }),
    input: (base) => ({
      ...base,
      color: theme === "dark" ? "#fff" : "#000"
    })
  }), [theme]);


  const resetUI = () => {
  setCode("");
  setOutputScreen(false);
  setTab(1);
  setPrompt("");
  setFrameWork(null);
  setIsNewTabOpen(false);
};

  return (

    <div>

      <div className={`${theme === "dark" ? "bg-black text-white" : "bg-[#f5f7fa] text-black"} min-h-screen transition-all duration-300`}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <div className="flex flex-col lg:flex-row items-stretch px-4 sm:px-6 md:px-10 lg:px-[100px] py-6 justify-between gap-6">
          <div className={`left w-full lg:w-[50%] h-auto py-[30px] rounded-xl mt-2 p-5 md:p-6
${theme === "dark" ? "bg-[#141319]" : "bg-white shadow-lg"}`}>
            <h3 className={`text-[22px] md:text-[25px] font-semibold ${theme === "dark" ? "text-teal-300" : "text-indigo-600"
              }`}>
              AI Component Generator
            </h3>

            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-2 text-[14px] md:text-[16px]`}>
              Describe your component,and let our AI generate the code for you.
            </p>


            <p className='text-[15px] font-[700] mt-4'>Framework</p>
            <Select
              className='mt-2'
              options={options}
              value={frameWork}
              styles={selectStyles}
              onChange={(selected) => setFrameWork(selected)}
            />
            <p className='text-[15px] font-[700] mt-5'>Describe your component</p>
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              className={`w-full min-h-[180px] md:min-h-[200px] rounded-xl mt-3 p-3 outline-none resize-none focus:ring-2 focus:ring-purple-500
              ${theme === "dark"
                  ? "bg-[#09090B] text-white placeholder-gray-400"
                  : "bg-gray-100 text-black placeholder-gray-500"}`} placeholder="Describe your component in detail and AI will generate it..."
            ></textarea>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-4 gap-4">
              <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-base md:text-lg`}>
                Click on Generate button to get your code
              </p>
              <button
                onClick={getResponse}
                className={`flex items-center justify-center rounded-lg px-5 py-3 gap-3 min-w-[180px]
${theme === "dark"
                    ? "bg-gradient-to-r from-teal-400 to-teal-700"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"}`}
              >
                <BsStars />

                <span>
                  {loading ? "Generating..." : "Generate"}
                </span>

                {loading && <RingLoader size={22} color="black" />}
              </button>

            </div>
          </div>

          {/* ryt section */}
          <div className={`right relative w-full lg:w-[50%] h-[75vh] lg:h-[80vh] rounded-xl mt-2 overflow-hidden
${theme === "dark" ? "bg-[#141319]" : "bg-white shadow-lg"}`}>
            {
              outputScreen === false ?

                <>


                  <div className=" skeleton w-full h-full flex items-center flex-col justify-center">
                    <div
                      className={`circle p-[20px] w-[90px] h-[90px] flex items-center justify-center text-[30px] rounded-full
  ${theme === "dark"
                          ? "bg-gradient-to-r from-teal-400 to-teal-700 text-white"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"}`}
                    >
                      <FaCode />
                    </div>
                    <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-[16px] mt-3`}>
                      Your component & code will appear here.
                    </p>
                  </div>
                </> : <>
                  <div className={`top w-full h-[60px] flex items-center gap-[15px] px-[20px]
${theme === "dark" ? "bg-[#17171C]" : "bg-gray-100"}`}>
                    <button
                      onClick={() => setTab(1)}
                      className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all duration-300 ${tab === 1
                        ? "bg-[#3A3A3F] text-white"
                        : "bg-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                      Code
                    </button>

                    <button
                      onClick={() => setTab(2)}
                      className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all duration-300 ${tab === 2
                        ? "bg-[#3A3A3F] text-white"
                        : "bg-transparent text-gray-400 hover:text-white"
                        }`}
                    >
                      Preview
                    </button>
                  </div>
                  <div className={`top-2 w-full h-[60px] flex justify-between items-center gap-[15px] px-[20px]
           $ {theme === "dark" ? "bg-[#17171C]" : "bg-gray-100"}`}>
                    <div className="left">
                      <p className="font-bold font-lg">Code Editor</p>
                    </div>
                    <div className="right flex items-center gap-[10px]">
                      {
                        tab === 1 ?
                          <>
                            <button className="copy w-[46px] h-[46px] rounded-xl border border-zinc-800 flex items-center justify-center transition-all duration-200 hover:bg-[#333] hover:border-zinc-400" onClick={copyCode}>
                              <MdContentCopy className="text-[22px]" />
                            </button>

                            <button className="export w-[46px] h-[46px] rounded-xl border border-zinc-800 flex items-center justify-center transition-all duration-200 hover:bg-[#333] hover:border-zinc-400" onClick={downnloadFile}>
                              <BiExport className="text-[24px]" />
                            </button>

                          </> :
                          <>
                            <button className="copy w-[46px] h-[46px] rounded-xl border border-zinc-800 flex items-center justify-center transition-all duration-200 hover:bg-[#333] hover:border-zinc-400" onClick={() => { setIsNewTabOpen(true) }}>
                              <ImNewTab className="text-[22px]" />
                            </button>

                            <button
                              onClick={resetUI}
                              className="export w-[46px] h-[46px] rounded-xl border border-zinc-800 flex items-center justify-center transition-all duration-200 hover:bg-[#333] hover:border-zinc-400"
                            >
                              <MdRefresh className="text-[24px]" />
                            </button>

                          </>
                      }


                    </div>

                  </div>

                  <div className="editor h-full">
                    {
                      tab === 1 ?
                        <>
                          <Editor
                            value={code}
                            height="100%"
                            theme={theme === "dark" ? "vs-dark" : "light"}
                            language="html"
                          />
                        </> :
                        <>
                          {/* main preview yahan se kiya h */}
                          <iframe srcDoc={code} className="preview bg-white text-black w-full h-full flex items-center justify-center"></iframe>
                        </>
                    }

                  </div>

                </>

            }
          </div>
        </div>
      </div>


      {/* ✅ Fullscreen Preview Overlay */}
      {isNewTabOpen && (
        <div className={`fixed inset-0 w-screen h-screen overflow-auto z-50
${theme === "dark" ? "bg-[#111]" : "bg-white"}`}>
          <div className={`w-full h-[60px] flex items-center justify-between px-5
${theme === "dark" ? "bg-[#17171C] text-white" : "bg-gray-100 text-black"}`}>
            <p className='font-bold'>Preview</p>
            <button
              onClick={() => setIsNewTabOpen(false)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center
  ${theme === "dark"
                  ? "border border-zinc-700 hover:bg-[#333]"
                  : "border border-zinc-300 hover:bg-gray-200"}`}
            >
              <IoCloseSharp />
            </button>
          </div>
          <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)]"></iframe>
        </div>
      )}

    </div>


  )
}

export default Home
