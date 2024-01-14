import React from "react";

const DetailNews = ({ newsResults }) => {
  console.log(newsResults);
  return (
    <div className="xl:ml-[370px] border-l border-r border-gray-200  xl:min-w-[576px] ml-[60px] sm:ml-[73px] flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Explore</h2>
      </div>
      <div className="flex flex-col items-center gap-[20px] mt-4">
        {newsResults?.map((article) => (
          <a rel="noreferrer" href={article.url} target="_blank">
            <div className="gap-x-4">
            <img
              className=""
              src={article.urlToImage}
              alt="post_image"
              width="auto"
              height="auto"
            />
            <div className="space-y-2">
              <h6 className="text-sm font-bold">{article.description}</h6>
              <p className="text-xs font-medium text-gray-500">
                {article.source.name}
              </p>
            </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default DetailNews;
