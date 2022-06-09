import { NextPage } from "next";
import useAuthentication from "../../front/hooks/UseAuthentication";
import { PageLoading } from "../../front/components/Base/PageLoading";
import { useEffect } from "react";
import { HomeLoggedPage } from "../../front/components/Template/Home/HomeLoggedPage";
import IPageProps from "../../interfaces/IPageProps";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

const HomeLogged: NextPage<IPageProps> = ({ setPageSubtitle }: IPageProps) => {
  const isAuthenticated = useAuthentication();
  const data = {
    backgroundColor: "#ababab",
    labels: ["January", "February"],
    datasets: [
      {
        label: "aaaa",
        data: [0.1, 0.4],
        backgroundColor: ["#ababab", "#121212"],
        hoverOffset: 4,
      },
    ],
  };
  const options = {
    elements: {
      arc: {
        weight: 0.5,
        borderWidth: 3,
      },
    },
    cutout: 150,
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
  );

  useEffect(() => {
    setPageSubtitle("Home");
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <PageLoading />;
  }

  return (
    <HomeLoggedPage>
      <h1></h1>
    </HomeLoggedPage>
  );
};

export default HomeLogged;
