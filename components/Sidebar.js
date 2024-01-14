import Image from "next/image";
import SidebarMenuItem from "./SidebarMenuItem";
import { HomeIcon } from "@heroicons/react/solid";
import {
  BellIcon,
  BookmarkIcon,
  ClipboardIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
  HashtagIcon,
  InboxIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRecoilState } from "recoil";
import { userState } from "../atom/userAtom";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Sidebar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUser = async () => {
          const docRef = doc(db, "users", auth.currentUser.providerData[0].uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data());
          }
        };
        fetchUser();
      }
    });
  }, []);

  function onSignOut() {
    signOut(auth);
    setCurrentUser(null);
  }
  return (
    <div className="sm:flex flex-col p-2 xl:items-start fixed h-full xl:ml-24">
      {/* Twitter Logo */}
      <div className="hoverEffect p-0 hover:bg-blue-100 xl:px-1">
        <Image
          width="50"
          height="50"
          src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
        ></Image>
      </div>

      {/* Menu */}

      <div className="mt-4 mb-2.5 xl:items-start">
        <Link href="/">
          <SidebarMenuItem text="Home" Icon={HomeIcon} active />
        </Link>
        <Link href="/explore">
          <SidebarMenuItem text="Explore" Icon={HashtagIcon} />
        </Link>
        {currentUser && (
          <>
            <Link href="/notification">
              <SidebarMenuItem text="Notifications" Icon={BellIcon} />
            </Link>
            <Link href="/message">
            <SidebarMenuItem text="Messages" Icon={InboxIcon} />
            </Link>
            <Link href="/profile">
            <SidebarMenuItem text="Profile" Icon={UserIcon} />
            </Link>
            <SidebarMenuItem text="More" Icon={DotsCircleHorizontalIcon} />
          </>
        )}
      </div>

      {/* Button */}

      {currentUser ? (
        <>
          <button
            onClick={onSignOut}
            className="bg-red-400 text-white rounded-full w-12 xl:w-36 h-6 xl:h-12 font-normal xl:font-bold shadow-md hover:brightness-95 text-xs xl:text-lg xl:inline"
          >
            Sign out
          </button>

          {/* Mini-Profile */}

          <div className="hoverEffect text-gray-700 flex items-center justify-start mt-auto">
            <img
              src={currentUser?.userImg}
              alt="user-img"
              className="h-10 w-10 rounded-full xl:mr-2"
            />
            <div className="leading-5 hidden xl:inline">
              <h4 className="font-bold">{currentUser?.name}</h4>
              <p className="text-gray-500">@{currentUser?.username}</p>
            </div>
            <DotsHorizontalIcon className="h-5 xl:ml-8 hidden xl:inline" />
          </div>
        </>
      ) : (
        <button
          onClick={() => router.push("/auth/signin")}
          className="bg-blue-400 text-white rounded-full w-12 xl:w-36 h-6 xl:h-12 font-normal xl:font-bold shadow-md hover:brightness-95 text-xs xl:text-lg xl:inline"
        >
          Sign in
        </button>
      )}
    </div>
  );
}
