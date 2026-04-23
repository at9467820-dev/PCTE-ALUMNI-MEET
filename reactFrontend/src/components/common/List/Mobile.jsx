import React, { useState } from "react";
import AlumniList from '../../add alumni components/AlumniList/Mobile'
import TalksList from "../../plan meet components/TalkList/Mobile";

function Mobile({ props }) {
  const {
    section,
    list,
    setSelectedMeetArray,
    setClickedItem,
    clickedItem,
    isAction,
    setIsAction,
    setters,
    setRpProfile,
    setRpAchievement,
    setRpBatch,
    setRpCareerTimeline,
    setRpCurrentCompany,
    setRpCurrentRole,
    setRpEmail,
    setIsAdding,
    setIsRightPanelOpen,
    setRpLinkedIn,
    setRpName,
    setRpQuote,
    setSearch,
    isAdding,
    search,
    setShowDeleteConfirm,
    setDeletingAlumniId,
    setDeletingMeetId,
    Step,
    setStep,
  } = props;

  const [actionIndex, setActionIndex] = useState(-1);

  return (
    <div className="w-full flex-1 overflow-auto px-4 pb-6 space-y-4">
      {section === "addAlumni"
        ? <AlumniList props={{
             list,
    setClickedItem,
    clickedItem,
    isAction,
    setIsAction,
    setters,
    setRpProfile,
    setRpAchievement,
    setRpBatch,
    setRpCareerTimeline,
    setRpCurrentCompany,
    setRpCurrentRole,
    setRpEmail,
    setIsAdding,
    setIsRightPanelOpen,
    setRpLinkedIn,
    setRpName,
    setRpQuote,
    setSearch,
    isAdding,
    search,
    setShowDeleteConfirm,
    setDeletingAlumniId,
    Step,
    setStep,
    actionIndex,
    setActionIndex
        }}/>
        : <TalksList props={{
            list,
    setSelectedMeetArray,
    setClickedItem,
    clickedItem,
    isAction,
    setIsAction,
    setters,
    setIsAdding,
    setIsRightPanelOpen,
    setSearch,
    isAdding,
    search,
    setShowDeleteConfirm,
    setDeletingMeetId,
    Step,  
    setStep,
    actionIndex,
    setActionIndex
        }}/>}
    </div>
  );
}

export default Mobile;
