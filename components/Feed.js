import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Input from "./Input";
import Post from "./Post";
import { useRecoilState } from "recoil";
import { userState } from "../atom/userAtom";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
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
import Link from "next/link";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const auth = getAuth();
  const router = useRouter();

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    []
  );

  function onSignOut() {
    signOut(auth);
    setCurrentUser(null);
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="border-l border-r border-gray-200 ml-[60px] sm:ml-[73px] xl:ml-[300px] flex-grow xl:min-w-[576px] max-w-xl">
      <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
        {/* <div className=" ml-auto">
          {currentUser ? (
            <button
              onClick={onSignOut}
              className="bg-red-400 text-white rounded-full px-4 py-1 font-bold shadow-md hover:brightness-95 text-[12px] xl:hidden"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/signin")}
              className="bg-blue-400 text-white rounded-full px-4 py-1 font-bold shadow-md hover:brightness-95 text-[12px] xl:hidden"
            >
              Sign in
            </button>
          )}
        </div> */}
      </div>
      <Input />
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Post key={post.id} id={post.id} post={post} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
