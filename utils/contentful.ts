import { createClient } from "contentful";

export type ContenfullBlog = {
  sys: {
    id: string;
    createdAt: Date;
  };
  fields: {
    title: string;
    slug: string;
    description: string;
    heroImg: { fields: { file: { description: string; url: string } } };
    body: any;
  };
};

// Retrieve the list of blog posts from Contentful
const getBlogPosts = async (): Promise<ContenfullBlog[]> => {
  const client = createClient({
    space: process.env.CONTENFUL_SPACEID || "",
    accessToken: process.env.CONTENFUL_ACCESS_TOKEN || "",
  });

  console.log(
    "accestoken",
    process.env.CONTENFUL_SPACEID,
    process.env.CONTENFUL_ACCESS_TOKEN
  );

  const response = await client.getEntries({
    // content_type: "Post",
  });

  return response.items as unknown as ContenfullBlog[];
};

export default getBlogPosts;
