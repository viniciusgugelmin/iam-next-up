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
          {process.env.NEXT_PUBLIC_APP_NAME}
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
