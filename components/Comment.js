import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { HeartIcon, ChatIcon, TrashIcon, DotsHorizontalIcon, XIcon, } from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import Moment from "react-moment";
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { modalState, postIdState } from "../atom/modalAtom";
import { userState } from "../atom/userAtom";

export default function Comment({ comment, commentId, originalPostId }) {
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [currentUser] = useRecoilState(userState);
  const [editText, setEditText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", originalPostId, "comments", commentId, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );

    return () => unsubscribe();
  }, [db, originalPostId, commentId]);

  useEffect(() => {
    setHasLiked(likes.some((like) => like.id === currentUser?.uid));
  }, [likes, currentUser]);

  const likeComment = async () => {
    if (!currentUser) {
      router.push("/auth/signin");
      return;
    }

    try {
      const likeRef = doc(db, "posts", originalPostId, "comments", commentId, "likes", currentUser?.uid);
      if (hasLiked) {
        await deleteDoc(likeRef);
      } else {
        await setDoc(likeRef, { username: currentUser?.username });
      }
    } catch (error) {
      return error;
    }
  };

  const deleteComment = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteDoc(doc(db, "posts", originalPostId, "comments", commentId));
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleEdit = () => {
    setEditText(comment?.comment);
    setPostId(comment?.userId);
    setEditModalOpen(true);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "posts", originalPostId, "comments", commentId), { comment: editText });
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error saving edited text:", error);
    }
  };

  return (
    <>
    <div className="relative flex p-3 border-b border-gray-200 pl-20">
      {/* User Image */}
      <img className="h-11 w-11 rounded-full mr-4" src={comment?.userImg} alt="user-img" />
      {/* Right Side */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Post User Info */}
          <div className="flex items-center space-x-1 whitespace-nowrap">
            {/* <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">{comment?.name}</h4> */}
            <span className="text-sm sm:text-[15px]">@{comment?.username} -</span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
            </span>
          </div>
          {/* Dot Icon */}
          {currentUser?.uid === comment?.userId && (
            <DotsHorizontalIcon
              onClick={handleEdit}
              className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2"
            />
          )}
        </div>
        {/* Post Text */}
        <p className="text-gray-800 text-[15px sm:text-[16px] mb-2">
          {isEditing ? editText : comment?.comment}
        </p>
        {/* Icons */}
        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center select-none">
            <ChatIcon
              onClick={() => {
                if (!currentUser) {
                  router.push("/auth/signin");
                } else {
                  setPostId(originalPostId);
                  setOpen(!open);
                }
              }}
              className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
            />
          </div>
          {currentUser?.uid === comment?.userId && (
            <TrashIcon
              onClick={deleteComment}
              className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likeComment}
                className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
              />
            ) : (
              <HeartIcon
                onClick={likeComment}
                className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            {likes.length > 0 && (
              <span className={`${hasLiked && "text-red-600"} text-sm select-none`}>{likes.length}</span>
            )}
          </div>
        </div>
      </div>
    </div>
    {editModalOpen && (
        <div className="max-w-lg w-[90%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-200 rounded-xl shadow-md">
          <div className="p-1">
            <div className="border-b border-gray-200 py-2 px-1.5">
              <div
                onClick={() => setEditModalOpen(false)}
                className="hoverEffect w-10 h-10 flex items-center justify-center"
              >
                <XIcon className="h-[23px] text-gray-700 p-0" />
              </div>
            </div>
            <div className="flex p-3 space-x-3">
              <img
                src={comment?.userImg}
                alt="user-img"
                className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
              />
              <div className="w-full divide-y divide-gray-200">
                <div className="">
                  <textarea
                    className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                    rows="2"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between pt-2.5">
                  <button
                    onClick={handleSave}
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
