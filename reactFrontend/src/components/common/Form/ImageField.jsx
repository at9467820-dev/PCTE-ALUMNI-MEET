import React from 'react'

function ImageField({previewURL,onMobileImageChange}) {
  return (
    <div className="md:hidden">
              <label
                htmlFor="mobileProfile"
                className="block text-xs text-gray-700 font-semibold mb-2"
              >
                Profile Photo
              </label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                  <img
                    src={
                      previewURL ||
                      "https://www.gravatar.com/avatar/?d=mp&s=200"
                    }
                    alt="profile preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  id="mobileProfile"
                  type="file"
                  accept="image/*"
                  onChange={onMobileImageChange}
                  className="
                    w-full rounded-xl bg-white border border-gray-300 
                    px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400
                  "
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                JPG/PNG/SVG • Max 2MB
              </p>
            </div>
  )
}

export default ImageField
