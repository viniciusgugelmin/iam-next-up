import { NextPage } from "next";
import { Navbar } from "../../src/components/Utils/Navbar";
import IsAuthenticated from "../../src/hooks/IsAuthenticated";

const Home: NextPage = () => {
  const isAuthenticated = IsAuthenticated();

  return (
    <div>
      Hello Next.js <Navbar />
    </div>
  );
};

export default Home;
