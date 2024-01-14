
import CommentModal from "../components/CommentModal";
import Sidebar from "../components/Sidebar";
import DetailNews from "../components/DetailNews";
import FollowersList from "../components/FollowersList";
import Header from "../components/Header";

export default function ({ newsResults }) {
  return (
    <div>
     <Header title={"Explore"} />

      <main className="flex min-h-screen mx-auto">
        {/* Sidebar */}
        <Sidebar />

        {/* DetailNews */}

        <DetailNews newsResults={newsResults?.articles}/>

        {/* Followers */}
        <FollowersList />

        {/* Modal */}

        <CommentModal />
      </main>
    </div>
  );
}

// https://saurav.tech/NewsAPI/top-headlines/category/business/us.json

export async function getServerSideProps() {
  const newsResults = await fetch(
    "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json"
  ).then((res) => res.json());

  // Who to follow section

  // let randomUsersResults = [];

  // try {
  //   const res = await fetch(
  //     "https://randomuser.me/api/?results=30&inc=name,login,picture"
  //   );

  //   randomUsersResults = await res.json();
  // } catch (e) {
  //   randomUsersResults = [];
  // }

  // const randomUsersResults = await fetch(
  //   "https://randomuser.me/api/?results=30&inc=name,login,picture"
  // ).then((res) => res.json());

  return {
    props: {
      newsResults,
    },
  };
}