
import CommentModal from "../components/CommentModal";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import Header from "../components/Header";
import Layout from "../components/Layout";

export default function Home({ newsResults }) {
  return (
    <div>
      <Header title={"Home"} />
      <Layout>
        <Sidebar />
        <Feed />
        <Widgets
          newsResults={newsResults?.articles}
        />
        <CommentModal />
      </Layout>
    </div>
  );
}

// https://saurav.tech/NewsAPI/top-headlines/category/business/us.json

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