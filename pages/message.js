import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import Layout from "../components/Layout";
import Header from "../components/Header";
import NotificationComp from "../components/NotificationComp";

export default function Notification({ newsResults }) {
  return (
    <div>
      <Header title={"Notification"} />

      <Layout>
        {/* Sidebar */}
        <Sidebar />

        <div className="xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] ml-[60px] sm:ml-[73px] flex-grow max-w-xl">
          <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold cursor-pointer">
              Messages
            </h2>
          </div>
          <h1 className="p-2 text-md font-semibold">
            There is no current message available.
          </h1>
        </div>
      </Layout>
    </div>
  );
}

export async function getServerSideProps() {
  const newsResults = await fetch(
    "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json"
  ).then((res) => res.json());

  return {
    props: {
      newsResults,
    },
  };
}
