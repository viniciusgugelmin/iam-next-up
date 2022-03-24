import type { NextPage } from "next";
import { useContext } from "react";
import authContext from "../stores/AuthContext";

const Home: NextPage = () => {
  const context = useContext(authContext);

  return <div>Home</div>;
};

export default Home;
