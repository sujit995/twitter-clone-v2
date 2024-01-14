import React from "react";
import { getAuth } from "firebase/auth";
import moment from 'moment';
import dateFormat from 'dateformat'

const NotificationComp = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  console.log(user)
  
  let currentDate = moment().format('MMMM Do YYYY')

  const createdTime = user?.metadata.creationTime
  return (
    <div className="xl:ml-[370px] border-l border-r border-gray-200  xl:min-w-[576px] ml-[60px] sm:ml-[73px] flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Notification</h2>
      </div>
      <h1 className="p-2 text-md font-semibold">
      There was a login to your account @{user?.displayName} from a new device on {currentDate}. Review it now.
      </h1>
    </div>
  );
};

export default NotificationComp;
