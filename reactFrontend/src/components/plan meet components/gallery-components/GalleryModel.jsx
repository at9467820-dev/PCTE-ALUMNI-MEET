import React, { useEffect, useRef, useState, useMemo } from "react";
import { IoClose } from "react-icons/io5";
import { FastAverageColor } from "fast-average-color";
import Header from "./Header";
import Video from "./Video";
import Images from "./Images";
import { useSelector } from "react-redux";
import { IoMdImages } from "react-icons/io";
import { FaVideo } from "react-icons/fa6";

function GalleryModel({ values, setters }) {
  const {
    mediaInputFields,
    imageIds,
    isGalleryOpen,
    mobileViewImages,
    mobileViewVideo,
    isVideoSelected,
    isImagesSelected,
    isMediaUploadModelOpen,
    meetId,
    allMeets,
  } = values;

  const {
    setIsGalleryOpen,
    handleMediaUpdate,
    setImageIds,
    handleMobileMediaChange,
    setIsMediaUploadModelOpen,
    setMobileViewImages,
    setMobileViewVideo,
    setIsVideoSelected,
    setIsImagesSelected,
    handleMobileViewMediaSubmit,
  } = setters;

  const { isTablet, screenWidth, isDesktop, isMobile } = useSelector(
    (state) => state.ui
  );

  // derive selected meet safely
  const selectedMeetArray = useMemo(
    () => allMeets.find((meet) => String(meet._id) === String(meetId)) || null,
    [allMeets, meetId]
  );

  const [submitModel, setSubmitModel] = useState(false);
  const [bgcolor, setBgcolor] = useState("#ffffff");
  const [toggle, setToggle] = useState(false);
  const [isVideo, setIsVideo] = useState(true);
  const [video, setVideo] = useState(null);
  const [images, setImages] = useState([]);
  const mediaRef = useRef(null);
  const videoRef = useRef(null);


  const fac = useMemo(() => new FastAverageColor(), []);


  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    let interval;

    const updateColor = () => {
      if (videoEl.paused || videoEl.ended) return;
      const color = fac.getColor(videoEl);
      setBgcolor(color.hex);
    };

    const onPlay = () => {
      interval = setInterval(updateColor, 1000);
    };
    const onPause = () => {
      clearInterval(interval);
      setBgcolor("#ffffff");
    };
    const onEnded = () => clearInterval(interval);

    videoEl.addEventListener("play", onPlay);
    videoEl.addEventListener("pause", onPause);
    videoEl.addEventListener("ended", onEnded);

    return () => {
      clearInterval(interval);
      videoEl.removeEventListener("play", onPlay);
      videoEl.removeEventListener("pause", onPause);
      videoEl.removeEventListener("ended", onEnded);
    };
  }, [fac]);

 
  useEffect(() => {
    if (selectedMeetArray?._id) {
      setVideo((prev) =>
        prev !== selectedMeetArray.media.videoLink
          ? selectedMeetArray.media.videoLink
          : prev
      );
      setImages((prev) =>
        prev !== selectedMeetArray.media.images ? selectedMeetArray.media.images : prev
      );
    } else {
      setVideo(null);
      setImages([]);
    }
  }, [selectedMeetArray]);
  return (
    <div
      className={`relative h-screen no-scrollbar overflow-auto
              px-4 sm:px-8 lg:px-20 bg-[#f5f6fa] 
              flex flex-col items-center py-6 sm:py-10`}
    >
      <div
        onClick={() => setIsMediaUploadModelOpen(false)}
        className={`absolute choose-fileType-model overflow-hidden w-full h-full flex justify-center items-center 
              bg-black/30 backdrop-blur-sm z-20 top-0 left-0 transition-opacity duration-500
              ${
                isMediaUploadModelOpen
                  ? "opacity-100 visible"
                  : "opacity-0 invisible"
              }`}
      >
        <div className="w-full h-full relative">
          <div
            className={`w-72 sm:w-80 bg-white absolute -translate-x-1/2 -translate-y-1/2 
                  left-1/2 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-6 
                  transition-all duration-500
                  ${isMediaUploadModelOpen ? "top-1/2" : "top-[150%]"}`}
          >
            {!isVideoSelected && !isImagesSelected && (
              <h2 className="text-lg font-semibold text-red-600">
                Choose File Type
              </h2>
            )}

            <div className="flex justify-center gap-10 text-red-600">
              {((!isImagesSelected && !isVideoSelected) ||
                (isImagesSelected && !isVideoSelected)) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    mediaRef.current.accept = "image/*";
                    mediaRef.current.multiple = true;

                    mediaRef.current.click();
                  }}
                  className="flex flex-col items-center gap-2 hover:text-red-700 transition-colors"
                >
                  <div
                    className={`w-14 h-14 flex items-center justify-center ${
                      mobileViewImages.length > 0
                        ? "bg-green-100 hover:bg-red-200 text-green-500"
                        : "bg-red-100 hover:bg-red-200"
                    }  rounded-full  transition-colors`}
                  >
                    <IoMdImages size={28} />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      mobileViewImages.length > 0 ? " text-green-500" : ""
                    } `}
                  >
                    {mobileViewImages.length} Image
                  </span>
                </button>
              )}

              {((!isImagesSelected && !isVideoSelected) ||
                (isVideoSelected && !isImagesSelected)) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    mediaRef.current.accept = "video/*";
                    mediaRef.current.multiple = false;

                    mediaRef.current.click();
                  }}
                  className="flex flex-col items-center gap-2 hover:text-red-700 transition-colors"
                >
                  <div className="w-14 h-14 flex items-center justify-center bg-red-100 rounded-full hover:bg-red-200 transition-colors">
                    <FaVideo size={28} />
                  </div>
                  <span className="text-sm font-medium">Video</span>
                </button>
              )}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setMobileViewImages([]);
                setMobileViewVideo(null);
                setIsVideoSelected(false);
                setIsImagesSelected(false);
              }}
              className="gap-4 flex "
            >
              {(isVideoSelected || isImagesSelected) && (
                <button className="text-md font-semibold text-red-600 border-[.01rem] px-3 py-1 rounded-full">
                  Reset
                </button>
              )}
              {(isVideoSelected || isImagesSelected) && (
                <button
                  onClick={handleMobileViewMediaSubmit}
                  className="text-md font-semibold text-green-600 border-[.01rem] px-3 py-1 rounded-full"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Header
        values={{
          toggle,
          mediaInputFields,
          isDesktop,
          isMobile,
          mediaRef,
          video,
          mobileViewImages,
          mobileViewVideo,
          isVideoSelected,
          isImagesSelected,
        }}
        setters={{
          setToggle,
          setIsGalleryOpen,
          handleMediaUpdate,
          setIsMediaUploadModelOpen,
          setVideo,
          handleMobileMediaChange,
        }}
      />
      <hr className="w-full border-red-700 mt-4 sm:mt-5" />

      {isDesktop ? (
        !toggle ? (
          isGalleryOpen && (
            <Video
              key={video}
              values={{ videoLink: video, bgcolor, toggle, videoRef }}
            />
          )
        ) : (
          <Images
            key={images}
            values={{ images, imageIds }}
            setters={{ setImageIds }}
          />
        )
      ) : (
        <div className=" mb-10 no-scrollbar ">
          {isGalleryOpen && (
            <Video
              key={video}
              values={{ videoLink: video, bgcolor, toggle, videoRef }}
            />
          )}
          <Images
            key={images}
            values={{ images, imageIds }}
            setters={{ setImageIds }}
          />
        </div>
      )}
    </div>
  );
}

export default GalleryModel;
