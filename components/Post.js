import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { HeartIcon, ChatIcon, TrashIcon, ShareIcon, XIcon, DotsHorizontalIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import Moment from "react-moment";
import { db, storage } from "../firebase";
import { modalState, postIdState } from "../atom/modalAtom";
import { userState } from "../atom/userAtom";

export default function Post({ post, id }) {
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [currentUser] = useRecoilState(userState);
  const [editText, setEditText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeLikes = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );

    const unsubscribeComments = onSnapshot(
      collection(db, "posts", id, "comments"),
      (snapshot) => setComments(snapshot.docs)
    );

    return () => {
      unsubscribeLikes();
      unsubscribeComments();
    };
  }, [db, id]);

  useEffect(() => {
    setHasLiked(likes.some((like) => like.id === currentUser?.uid));
  }, [likes, currentUser]);

  const likePost = async () => {
    if (!currentUser) {
      router.push("/auth/signin");
      return;
    }

    try {
      const likeRef = doc(db, "posts", id, "likes", currentUser?.uid);
      if (hasLiked) {
        await deleteDoc(likeRef);
      } else {
        await setDoc(likeRef, { username: currentUser?.username });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const deletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "posts", id));
        if (post.data().image) {
          await deleteObject(ref(storage, `posts/${id}/image`));
        }
        router.push("/");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const sharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.data()?.text,
          text: post.data()?.text,
          url: window.location.href,
        });
        console.log("Successful share");
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      console.log("Web Share API not supported");
    }
  };

  const handleEdit = () => {
    setEditText(post?.data()?.text);
    setPostId(id);
    setEditModalOpen(true);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "posts", id), { text: editText });
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error saving edited text:", error);
    }
  };

  return (
    <>
    <div className="relative flex p-3 cursor-pointer border-b border-gray-200">
      {/* User Image */}
      <img className="h-11 w-11 rounded-full mr-4" src={post?.data()?.userImg} alt="user-img" />
      {/* Right Side */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            {/* <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">{post?.data()?.name}</h4> */}
            <span className="font-bold text-sm sm:text-[15px]">@{post?.data()?.username} - </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
            </span>
          </div>
          {currentUser?.uid === post?.data()?.id && (
            <DotsHorizontalIcon
              onClick={handleEdit}
              className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2"
            />
          )}
        </div>
        {/* Post Text */}
        <p onClick={() => router.push(`/posts/${id}`)} className="text-gray-800 text-[15px sm:text-[16px] mb-2">
          {isEditing ? editText : post?.data()?.text}
        </p>
        {/* Post Image */}
        {post?.data()?.image && (
          <img
            onClick={() => router.push(`/posts/${id}`)}
            className="rounded-2xl mr-2"
            src={post?.data()?.image}
            alt="Post"
          />
        )}
        {/* Icons */}
        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center select-none">
            <ChatIcon
              onClick={() => {
                if (!currentUser) {
                  router.push("/auth/signin");
                } else {
                  setPostId(id);
                  setOpen(!open);
                }
              }}
              className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
            />
            {comments.length > 0 && <span className="text-sm">{comments.length}</span>}
          </div>
          {currentUser?.uid === post?.data()?.id && (
            <TrashIcon
              onClick={deletePost}
              className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
              />
            ) : (
              <HeartIcon
                onClick={likePost}
                className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            {likes.length > 0 && <span className={`${hasLiked && "text-red-600"} text-sm select-none`}>{likes.length}</span>}
          </div>
          <ShareIcon
            onClick={sharePost}
            className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
          />
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
                src={currentUser.userImg}
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
