import getBlogPosts from "@/utils/contentful";

//pages/sitemap.xml.js
const BASE_DOMAIN = "https://www.aicoverlettergenerator.com";

function generateSiteMap(posts: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://www.aicoverlettergenerator.com</loc>
     </url>
     ${posts
       .map((slug) => {
         return `
       <url>
           <loc>${`${BASE_DOMAIN}/blog/${slug}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}
//@ts-ignore
export async function getServerSideProps({ res }) {
  const blogs = await getBlogPosts();
  const postSlugs = blogs.map((blog) => blog.fields.slug);

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(postSlugs);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
