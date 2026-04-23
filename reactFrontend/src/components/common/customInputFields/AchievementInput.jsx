import React from 'react'

import { IoClose } from "react-icons/io5";
function AchievementInput({values , setters}) {
    const {newAch , achievement ,title , placeholder } = values
    const {setAchievement , setNewAch} = setters
  return (
                <div className="mt-6  md:mt-8">
                  <h2 className="md:text-md text-base font-medium text-gray-600  ">
                     {title}
                  </h2>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {(achievement || []).map((ach, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-100 text-xs md:text-sm px-2 md:px-3 py-1 rounded-full shadow-sm"
                      >
                        <span className="mr-1 md:mr-2">{ach}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setAchievement(
                              achievement.filter((_, i) => i !== index)
                            )
                          }
                          className="text-red-500  hover:text-red-700"
                        >
                          <IoClose size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
    
                  <div className="mt-3 md:mt-4 flex gap-2">
                    <input
                      type="text"
                      value={newAch}
                      onChange={(e) => setNewAch(e.target.value)}
                      placeholder={placeholder}
                      className="
                        rounded-xl md:rounded-full text-xs md:text-sm bg-gray-50 border border-gray-300
                        px-3 md:px-4 py-2 md:py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-300
                      "
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newAch.trim() !== "") {
                          setAchievement([...achievement, newAch]);
                          setNewAch("");
                        }
                      }}
                      className="
                        flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-400
                        hover:from-red-700 hover:to-red-500 text-white font-semibold
                        text-xs md:text-sm px-4 md:px-5 py-2 rounded-full shadow-md
                      "
                    >
                      Add
                    </button>
                  </div>
                </div>
  )
}

export default AchievementInput
