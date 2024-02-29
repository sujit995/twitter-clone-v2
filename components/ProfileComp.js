import React from "react";
import { getAuth } from "firebase/auth";
import dateFormat from 'dateformat'



const ProfileComp = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    const createdTime = user?.metadata.creationTime

  return (
    <div className="xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] ml-[60px] sm:ml-[73px] flex-grow max-w-xl">
    <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
      <h2 className="text-lg sm:text-xl font-bold cursor-pointer">
        Profile
      </h2>
    </div>
    <div className="bg-gray-400 relative mx-auto flex w-full flex-col items-left bg-cover bg-clip-border h-[200px]">
      <div className="relative mt-[5%] flex h-32 w-full justify-left rounded-xl bg-cover ml-6">
      <div className="absolute -bottom-[120px] flex h-[150px] w-[150px] items-center justify-center rounded-full border-[4px] border-whit">
          <img
            className="h-full w-full rounded-full"
            src={user?.photoURL}
            alt="profile_image"
          />
        </div>
      </div>
    </div>
     <div className="mt-[25%] sm:mt-[15%] ml-10">
    <h1 className="text-bold text-[20px]">{user?.displayName}</h1>
    <h1 className="text-bold text-md text-[#536471]">{user?.email}</h1>
    <p className="text-md text-[#536471]">Joined at {dateFormat(createdTime, "mmmm dS, yyyy")}</p>
    </div>
  </div>
  );
};

export default ProfileComp;
