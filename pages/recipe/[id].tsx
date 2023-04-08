import AllRecepies from "@/components/AllRecepies";
import RecipiePage from "@/components/Recipe";
import Seo from "@/components/SEO/Seo";
import { useRouter } from "next/router";

export default function Recipe() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <Seo />
      <RecipiePage id={id as string} />
    </>
  );
}
