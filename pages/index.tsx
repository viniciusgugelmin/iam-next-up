import type { NextPage } from "next";
import { useContext } from "react";
import authContext from "../stores/AuthContext";

const Home: NextPage = (props) => {
  const context = useContext(authContext);
  context;
  props;

  return <div>Home</div>;
};

export default Home;
