import CreateCV from "@/components/CreateCV";
import Seo from "@/components/SEO/Seo";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="QWrYLFY4ClbZpEeLBLM4_BzguCPEmuVEhGWHzNnILe8"
        />
      </Head>
      <Seo />
      <CreateCV />
    </>
  );
}
