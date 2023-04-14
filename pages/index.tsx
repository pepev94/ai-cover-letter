import CreateCV from "@/components/CreateCV";
import Seo from "@/components/SEO/Seo";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="5IRS4lod80OkHaQEfkyPAejW_GLUr_cY1jKlx8g2in0"
        />
      </Head>
      <Seo />
      <CreateCV />
    </>
  );
}
