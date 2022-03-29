import "./style.css";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../src/stores/AuthContext";
import Head from "next/head";
import { useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [pageSubttitle, setPageSubtitle] = useState("");

  return (
    <>
      <Head>
        <title>
          Go Drink
          {pageSubttitle ? ` - ${pageSubttitle}` : ""}
        </title>
      </Head>
      <AuthContextProvider>
        <Component {...pageProps} setPageSubtitle={setPageSubtitle} />
      </AuthContextProvider>
    </>
  );
}

export default MyApp;
