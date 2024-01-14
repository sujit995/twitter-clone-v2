
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

        {/* notifications */}

       <NotificationComp />

        {/* Widgets */}

        <Widgets
          newsResults={newsResults?.articles}
        />

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