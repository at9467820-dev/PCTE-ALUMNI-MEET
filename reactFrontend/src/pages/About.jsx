import React, { useState } from "react";
import { FaLaptopCode, FaServer, FaVideo, FaFileExcel, FaShieldAlt, FaMobileAlt, FaCloudUploadAlt, FaChevronDown, FaChevronUp, FaDatabase, FaCode, FaFolderOpen, FaQuestionCircle, FaNetworkWired } from "react-icons/fa";
import { HiOutlineDatabase } from "react-icons/hi";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { techStackFrontend, techStackBackend, databaseTables, apiEndpoints, folderStructure, vivaQA } from "./AboutData";

const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

/* ─── Section Title ─── */
const SectionTitle = ({ icon, title, subtitle, color = "red" }) => (
  <motion.div variants={fadeIn} className="text-center mb-14">
    <div className={`inline-flex items-center gap-3 bg-${color}-50 text-${color}-600 px-5 py-2 rounded-full text-sm font-bold mb-4 tracking-wider uppercase`}>
      {icon} {subtitle}
    </div>
    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">{title}</h2>
  </motion.div>
);

/* ─── Accordion Item for Q&A ─── */
const QAItem = ({ item, index, open, toggle }) => (
  <motion.div variants={fadeIn} className="border border-gray-200 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
    <button onClick={() => toggle(index)} className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-gray-50 transition">
      <span className="flex items-center gap-3">
        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">Q{index + 1}</span>
        <span className="font-bold text-gray-800 text-sm md:text-base">{item.q}</span>
      </span>
      {open === index ? <FaChevronUp className="text-red-500 flex-shrink-0" /> : <FaChevronDown className="text-gray-400 flex-shrink-0" />}
    </button>
    <AnimatePresence>
      {open === index && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
          <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl text-gray-700 text-sm md:text-base leading-relaxed">
              <span className="font-bold text-green-700">Answer: </span>{item.a}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

function About() {
  const navigate = useNavigate();
  const [openQA, setOpenQA] = useState(null);
  const toggleQA = (i) => setOpenQA(openQA === i ? null : i);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-800 font-sans relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply blur-[120px] opacity-25 animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply blur-[120px] opacity-25 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply blur-[180px] opacity-15" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-28 pb-20 relative">
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="fixed right-6 top-24 z-50 flex items-center justify-center w-11 h-11 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 hover:scale-110 transition text-gray-700">
          <IoMdArrowRoundBack size={22} />
        </button>

        {/* ═══════ HERO ═══════ */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gray-900 tracking-tight leading-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500">AlumniTalks</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">A full-stack web application that connects current PCTE students with successful alumni through an interactive library of career journeys, scheduled talks, multimedia galleries & automated reporting.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["React 19","Vite","Tailwind v4","Redux","Express v5","SQLite","Cloudinary","JWT Auth","TypeScript","Node-Cron"].map((t) => (
              <span key={t} className="px-4 py-1.5 bg-white/80 backdrop-blur border border-gray-200 rounded-full text-xs font-bold text-gray-600 shadow-sm">{t}</span>
            ))}
          </div>
        </motion.div>

        {/* ═══════ 1. SYSTEM FLOW ═══════ */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-28">
          <SectionTitle icon={<FaNetworkWired />} title="How The App Works (System Flow)" subtitle="Architecture" color="blue" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {[
              { icon: <span className="text-4xl">🧑‍🎓</span>, title: "User", sub: "Student or Admin opens the website in a browser", color: "from-gray-600 to-gray-800" },
              { icon: <FaLaptopCode className="text-4xl" />, title: "React Frontend", sub: "Renders the UI. Sends HTTP requests to backend via Axios. Uses Redux for state.", color: "from-blue-500 to-indigo-600" },
              { icon: <FaServer className="text-4xl" />, title: "Express Backend", sub: "REST API server. Validates data, runs business logic, handles auth middleware.", color: "from-green-500 to-emerald-600" },
              { icon: <FaDatabase className="text-4xl" />, title: "SQLite Database", sub: "Stores alumni, meets, users, feedback data in a local file 'alumni.db'.", color: "from-yellow-500 to-amber-600" },
              { icon: <FaCloudUploadAlt className="text-4xl" />, title: "Cloudinary CDN", sub: "Stores heavy images & videos. Returns a fast URL that we save in SQLite.", color: "from-purple-500 to-violet-600" },
            ].map((item, i) => (
              <React.Fragment key={i}>
                <motion.div variants={fadeIn} className="flex flex-col items-center text-center bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/60 hover:-translate-y-2 transition-transform duration-300">
                  <div className={`bg-gradient-to-br ${item.color} text-white p-4 rounded-2xl mb-4 shadow-md`}>{item.icon}</div>
                  <h3 className="text-lg font-extrabold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.sub}</p>
                  {i === 0 && <span className="mt-3 text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">STEP 1: Opens Website</span>}
                  {i === 1 && <span className="mt-3 text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">STEP 2: Sends API Request</span>}
                  {i === 2 && <span className="mt-3 text-[10px] bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold">STEP 3: Processes Logic</span>}
                  {i === 3 && <span className="mt-3 text-[10px] bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">STEP 4a: Read/Write Data</span>}
                  {i === 4 && <span className="mt-3 text-[10px] bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">STEP 4b: Upload Media</span>}
                </motion.div>
              </React.Fragment>
            ))}
          </div>
          <motion.div variants={fadeIn} className="mt-8 bg-white/60 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 text-center">
            <p className="text-gray-600 text-sm leading-relaxed"><strong className="text-gray-800">In Simple Words:</strong> User clicks something → React Frontend sends a request via Axios → Express Backend receives it, checks authentication via JWT middleware → Queries SQLite database for text data → If media is needed, fetches/uploads to Cloudinary → Sends JSON response back → React renders the updated UI beautifully.</p>
          </motion.div>
        </motion.section>

        {/* ═══════ 2. FRONTEND TECH STACK ═══════ */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-28">
          <SectionTitle icon={<FaLaptopCode />} title="Frontend Tech Stack" subtitle="Client Side" color="red" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {techStackFrontend.map((t, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-shadow group">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-extrabold text-gray-900">{t.name}</h3>
                  <span className="px-2.5 py-0.5 bg-red-100 text-red-600 text-[11px] font-bold rounded-full">{t.badge}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2"><strong className="text-gray-800">What is it?</strong> {t.desc}</p>
                <p className="text-sm text-green-700 bg-green-50 p-3 rounded-xl border-l-4 border-green-400"><strong>Why we use it:</strong> {t.why}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════ 3. BACKEND TECH STACK ═══════ */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-28">
          <SectionTitle icon={<FaServer />} title="Backend Tech Stack" subtitle="Server Side" color="blue" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {techStackBackend.map((t, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-extrabold text-gray-900">{t.name}</h3>
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-600 text-[11px] font-bold rounded-full">{t.badge}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2"><strong className="text-gray-800">What is it?</strong> {t.desc}</p>
                <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-xl border-l-4 border-blue-400"><strong>Why we use it:</strong> {t.why}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════ 4. DATABASE SCHEMA ═══════ */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-28">
          <SectionTitle icon={<HiOutlineDatabase />} title="Database Schema (5 Tables)" subtitle="SQLite Structure" color="yellow" />
          <div className="space-y-5">
            {databaseTables.map((t, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-100 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">{i + 1}</span>
                  <h3 className="text-xl font-extrabold text-gray-900 font-mono">{t.name}</h3>
                </div>
                <div className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs md:text-sm font-mono mb-3 overflow-x-auto">
                  <span className="text-purple-400">CREATE TABLE</span> <span className="text-yellow-300">{t.name}</span> ( {t.columns} )
                </div>
                <p className="text-gray-600 text-sm">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════ 5. API ENDPOINTS ═══════ */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-28">
          <SectionTitle icon={<FaCode />} title="API Endpoints (REST API)" subtitle="Backend Routes" color="green" />
          <motion.div variants={fadeIn} className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-900 text-white text-left">
                  <th className="px-5 py-4 font-bold">Method</th>
                  <th className="px-5 py-4 font-bold">Endpoint</th>
                  <th className="px-5 py-4 font-bold">Auth?</th>
                  <th className="px-5 py-4 font-bold">Description</th>
                </tr></thead>
                <tbody>
                  {apiEndpoints.map((ep, i) => (
                    <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}>
                      <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-md text-xs font-bold text-white ${ep.method === "GET" ? "bg-green-500" : ep.method === "POST" ? "bg-blue-500" : ep.method === "PUT" ? "bg-yellow-500" : "bg-red-500"}`}>{ep.method}</span></td>
                      <td className="px-5 py-3 font-mono text-xs text-gray-800">{ep.path}</td>
                      <td className="px-5 py-3">{ep.auth ? <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">🔒 Yes</span> : <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">🌐 Public</span>}</td>
                      <td className="px-5 py-3 text-gray-600">{ep.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.section>

        {/* ═══════ 6. FOLDER STRUCTURE ═══════ */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-28">
          <SectionTitle icon={<FaFolderOpen />} title="Project Folder Structure" subtitle="Code Organization" color="purple" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {folderStructure.map((f, i) => (
              <motion.div key={i} variants={fadeIn} className="flex items-start gap-4 bg-white/70 backdrop-blur-lg p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <FaFolderOpen className="text-yellow-500 text-xl flex-shrink-0 mt-1" />
                <div>
                  <p className="font-mono text-xs font-bold text-gray-800 mb-1">{f.path}</p>
                  <p className="text-gray-500 text-xs">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════ 7. KEY FEATURES ═══════ */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-28">
          <SectionTitle icon={<MdOutlineDashboardCustomize />} title="Key Features" subtitle="What Makes It Special" color="red" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <MdOutlineDashboardCustomize className="text-3xl" />, title: "Dual Dashboard", desc: "Students get a beautiful reading view. Admins get a full CRUD panel with sidebar navigation for managing alumni, meets, and reports.", gradient: "from-purple-500 to-indigo-600" },
              { icon: <FaShieldAlt className="text-3xl" />, title: "JWT + Bcrypt Security", desc: "Passwords are hashed with 12 salt rounds. JWT tokens are stored in HttpOnly cookies (invisible to JavaScript). Logout blacklists the token.", gradient: "from-green-400 to-emerald-600" },
              { icon: <HiOutlineDatabase className="text-3xl" />, title: "Automated CRON Jobs", desc: "node-cron runs every hour (0 * * * *). It automatically checks dates and moves past events from 'Upcoming' to 'Completed' status.", gradient: "from-yellow-400 to-orange-500" },
              { icon: <FaVideo className="text-3xl" />, title: "Cloud Video Streaming", desc: "Videos up to 100MB+ are stored on Cloudinary CDN. Images are organized in folders: alumniMeet/images, alumniMeet/videos, alumniMeet/profilePic.", gradient: "from-red-400 to-pink-600" },
              { icon: <FaFileExcel className="text-3xl" />, title: "Dynamic Excel Reports", desc: "Admin selects columns → ExcelJS generates styled .xlsx with bold headers, centered text, gray header fill, and color-coded status cells.", gradient: "from-teal-400 to-cyan-600" },
              { icon: <FaMobileAlt className="text-3xl" />, title: "Responsive + Animated UI", desc: "Tailwind CSS handles responsive layouts. Framer Motion adds scroll-triggered animations. Glassmorphism with backdrop-blur creates premium feel.", gradient: "from-blue-400 to-sky-600" },
            ].map((f, i) => (
              <motion.div key={i} variants={fadeIn} className="bg-white/70 backdrop-blur-md p-7 rounded-2xl border border-white/50 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${f.gradient} text-white shadow-lg mb-5`}>{f.icon}</div>
                <h3 className="text-xl font-extrabold mb-2 text-gray-800">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══════ 8. VIVA Q&A — 20 Questions ═══════ */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
          <SectionTitle icon={<FaQuestionCircle />} title="Viva Questions & Answers (20)" subtitle="Exam Preparation" color="orange" />
          <p className="text-center text-gray-500 text-sm mb-8 -mt-8">Click any question to reveal the answer. These are the most likely questions your teacher will ask.</p>
          <div className="space-y-3">
            {vivaQA.map((item, i) => (
              <QAItem key={i} item={item} index={i} open={openQA} toggle={toggleQA} />
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center pt-10 border-t border-gray-200">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} PCTE AlumniTalks — Full Stack Web Application</p>
        </motion.div>
      </div>
    </div>
  );
}

export default About;
