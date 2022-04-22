import "./style.css";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../front/stores/AuthContext";
import Head from "next/head";
import { useState } from "react";
import { AlertsBox } from "../front/components/Utils/AlertsBox";
import { COnfirmBox } from "../front/components/Utils/ConfirmBox";

function MyApp({ Component, pageProps }: AppProps) {
  const [pageSubttitle, setPageSubtitle] = useState("");

  return (
    <>
      <Head>
        <title>
          {process.env.NEXT_PUBLIC_APP_NAME}
          {pageSubttitle ? ` - ${pageSubttitle}` : ""}
        </title>
      </Head>
      <AuthContextProvider>
        <Component {...pageProps} setPageSubtitle={setPageSubtitle} />
        <AlertsBox />
        <COnfirmBox />
      </AuthContextProvider>
    </>
  );
}

export default MyApp;
