
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import Layout from "../components/Layout";
import Header from "../components/Header";
import ProfileComp from "../components/ProfileComp";


export default function Profile({ newsResults }) {
  return (
    <div>
      <Header title={"Profile"} />

     <Layout>
        {/* Sidebar */}
        <Sidebar />

        {/* notifications */}

       <ProfileComp />

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