import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTalksOnFrontend } from "../api/meet.api";
import { FaCalendarAlt, FaMapMarkerAlt, FaMicrophoneAlt } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Schedule() {
  const navigate = useNavigate();

  const { data: upcomingTalksRes, isLoading } = useQuery({
    queryKey: ["upcomingTalks"],
    queryFn: () => fetchTalksOnFrontend("allUpcomings"),
  });

  const upcomingTalks = upcomingTalksRes?.data || [];
  
  // Find the absolute closest talk
  const nextTalk = [...upcomingTalks].sort((a, b) => new Date(a.time) - new Date(b.time))[0];

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!nextTalk) return;
    
    const targetDate = new Date(nextTalk.time).getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextTalk]);

  return (
    <div className="w-full min-h-screen pt-24 pb-16 bg-[#f8fafc] overflow-hidden relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Text */}
        <div className="text-center mb-16 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute right-0 md:right-10 top-0 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 hover:scale-110 transition z-50 text-gray-700"
          >
            <IoMdArrowRoundBack size={24} />
          </button>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Event <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Schedule</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Stay updated with our exciting roster of upcoming alumni talks, professional seminars, and guest speaker events.
          </p>
        </div>

        {/* Live Countdown Hero Section */}
        {nextTalk ? (
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 mb-20 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
              {/* Speaker Profile */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-600 text-sm font-bold mb-6">
                  🔥 Next Big Event
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {nextTalk.title}
                </h2>
                
                <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-xl w-full">
                  <img 
                    src={nextTalk.alumni[0]?.profilePic} 
                    alt="Guest Speaker" 
                    className="w-16 h-16 rounded-full border-2 border-indigo-200 object-cover shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{nextTalk.alumni[0]?.name}</h3>
                    <p className="text-sm text-gray-600">{nextTalk.alumni[0]?.currentRole} @ {nextTalk.alumni[0]?.currentCompany}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-gray-600 font-medium w-full">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <FaCalendarAlt className="text-indigo-500" />
                    <span>{new Date(nextTalk.time).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span>{nextTalk.location} ({nextTalk.organizedBy})</span>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex flex-col items-center justify-center bg-gray-900 rounded-3xl p-8 shadow-inner text-white">
                <h3 className="text-xl font-semibold mb-6 text-gray-300">Countdown to Live</h3>
                
                <div className="grid grid-cols-4 gap-2 md:gap-4 w-full">
                  <div className="flex flex-col items-center justify-center bg-gray-800 rounded-xl p-3 shadow-lg">
                    <span className="text-3xl md:text-5xl font-mono font-bold text-red-500">{timeLeft.days}</span>
                    <span className="text-xs text-gray-400 mt-1 uppercase">Days</span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-gray-800 rounded-xl p-3 shadow-lg">
                    <span className="text-3xl md:text-5xl font-mono font-bold text-blue-400">{timeLeft.hours}</span>
                    <span className="text-xs text-gray-400 mt-1 uppercase">Hours</span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-gray-800 rounded-xl p-3 shadow-lg">
                    <span className="text-3xl md:text-5xl font-mono font-bold text-green-400">{timeLeft.minutes}</span>
                    <span className="text-xs text-gray-400 mt-1 uppercase">Mins</span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-gray-800 rounded-xl p-3 shadow-lg">
                    <span className="text-3xl md:text-5xl font-mono font-bold text-yellow-400">{timeLeft.seconds}</span>
                    <span className="text-xs text-gray-400 mt-1 uppercase">Secs</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          !isLoading && (
            <div className="w-full bg-white rounded-3xl p-12 text-center shadow-md border border-gray-100 mb-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Upcoming Events Right Now 😢</h2>
              <p className="text-gray-500">Check back later for exciting new guest speakers and workshops!</p>
            </div>
          )
        )}

        {/* --- DETAILED EVENT ITINERARY (NEW) --- */}
        {nextTalk && (
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Event Day <span className="text-indigo-600">Itinerary</span></h2>
            <p className="text-center text-gray-500 mb-10 max-w-lg mx-auto">A minute-by-minute breakdown of what you can expect during the primary guest alumni program.</p>
            
            <div className="relative border-l-4 border-indigo-200 ml-4 md:ml-12 pl-6 md:pl-10 space-y-12">
              {[
                {
                  time: "09:00 AM",
                  title: "Welcome Ceremony",
                  location: "Main Reception",
                  icon: "🎉",
                  image: "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=500",
                  desc: "Check-in at the desk, collect your passes, and grab a welcome coffee before the session begins."
                },
                {
                  time: "10:30 AM",
                  title: "Keynote Address",
                  location: nextTalk.location,
                  icon: "🎤",
                  image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=500",
                  desc: "The main talk delivered by our esteemed alumni guest speaker."
                },
                {
                  time: "12:30 PM",
                  title: "Networking Lunch",
                  location: "Campus Cafeteria",
                  icon: "🍽️",
                  image: "https://images.pexels.com/photos/1181438/pexels-photo-1181438.jpeg?auto=compress&cs=tinysrgb&w=500",
                  desc: "Enjoy a complimentary buffet lunch while mingling directly with industry professionals and peers."
                },
                {
                  time: "02:00 PM",
                  title: "Interactive Open Q&A",
                  location: "Creative WebLab",
                  icon: "💬",
                  image: "https://images.pexels.com/photos/716276/pexels-photo-716276.jpeg?auto=compress&cs=tinysrgb&w=500",
                  desc: "An open floor asking questions related to career growth, technology trends, and placement roadmaps."
                },
                {
                  time: "03:30 PM",
                  title: "High Tea & Group Photos",
                  location: "Campus Lawns",
                  icon: "☕",
                  image: "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=500",
                  desc: "Final networking session over high tea and light snacks followed by group pictures."
                }
              ].map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Node Ring */}
                  <div className="absolute -left-[54px] md:-left-[70px] w-12 h-12 bg-white border-4 border-indigo-500 rounded-full flex items-center justify-center text-xl shadow-lg z-10 group-hover:bg-indigo-50 transition duration-300">
                    {step.icon}
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
                    <div className="w-full md:w-1/3 shrink-0 overflow-hidden rounded-xl h-40">
                      <img src={step.image} alt={step.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg">{step.time}</span>
                        <span className="text-sm font-medium text-gray-500 flex items-center gap-1"><FaMapMarkerAlt className="text-gray-400"/> {step.location}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Schedule List */}
        {upcomingTalks.length > 0 && (
          <div>
             <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-blue-500 pb-2 inline-block">Full Upcoming Roster</h2>
             <div className="space-y-6">
                {upcomingTalks.map((talk, i) => (
                  <div key={i} className="flex flex-col md:flex-row bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden group">
                    <div className="md:w-64 bg-slate-900 text-white flex flex-col items-center justify-center p-6 border-r-4 border-red-500 group-hover:bg-slate-800 transition">
                      <FaCalendarAlt className="text-3xl mb-3 text-red-500" />
                      <span className="text-2xl font-bold">{new Date(talk.time).getDate()}</span>
                      <span className="text-sm uppercase tracking-widest">{new Date(talk.time).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      <span className="mt-2 text-xs font-mono bg-white/20 px-2 py-1 rounded">{new Date(talk.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="w-full">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">{talk.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{talk.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500">
                          <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-red-400" /> {talk.location}</span>
                          <span className="flex items-center gap-1"><FaMicrophoneAlt className="text-blue-400" /> Organized by {talk.organizedBy}</span>
                        </div>
                      </div>

                      <div className="w-full md:w-auto flex flex-col items-center md:items-end flex-shrink-0">
                         <img src={talk.alumni[0]?.profilePic} alt="Speaker" className="w-16 h-16 rounded-full object-cover mb-2 border border-gray-200" />
                         <span className="font-bold text-gray-900 text-center md:text-right">{talk.alumni[0]?.name}</span>
                         <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1">Speaker</span>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Schedule;
