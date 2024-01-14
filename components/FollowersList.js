import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FollowersList = () => {
    const [randomUserNum, setRandomUserNum] = useState();
    const [randomNum, setRandomNum] = useState(3)

    const fetchData = async () => {
        try {
          const response = await fetch(
            "https://randomuser.me/api/?results=30&inc=name,login,picture"
          );
          const result = await response.json();
          console.log(result.results);
          setRandomUserNum(result);
        } catch (err) {
          console.error("Error fetching data:", err.message);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, [])


  return (
     <div className="xl:w-[600px] hidden lg:inline ml-8 space-y-2">
      <div className="sticky top-16 text-gray-700 space-y-3 bg-gray-100 pt-2 rounded-xl w-[90%] xl:w-[75%]">
        <h4 className="font-bold text-xl px-4">Who to follow</h4>
        <AnimatePresence>
          {randomUserNum?.results.slice(0, randomNum).map((random) => (
            <motion.div
              key={random.login.username}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div
                key={random.login.username}
                className="flex items-center px-4 py-2  cursor-pointer hover:bg-gray-200 transition duration-500 ease-out"
              >
                <img
                  className="rounded-full"
                  width="40"
                  src={random.picture.thumbnail}
                  alt="thumbnail_image"
                />
                <div className="truncate ml-4 leading-5">
                  <h4 className="font-bold hover:underline text-[14px] truncate">
                    {random.login.username}
                  </h4>
                  <h5 className="text-[13px] text-gray-500 truncate">
                    {random.name.first + " " + random.name.last}
                  </h5>
                </div>
                <button className="ml-auto bg-black text-white rounded-full text-sm px-3.5 py-1.5 font-bold">
                  Follow
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={() => setRandomNum(randomNum + 2)}
          className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
        >
          Show more
        </button>
      </div>
    </div>
  )
}

export default FollowersList