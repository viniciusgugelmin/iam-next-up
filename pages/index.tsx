import type { NextPage } from "next";
import { useContext } from "react";
import authContext from "../stores/AuthContext";

const Home: NextPage = () => {
  const context = useContext(authContext);
  console.log(context);

  return <div>Home</div>;
};

export default Home;
