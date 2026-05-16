import { getAllPosts } from "@/lib/posts";
import { getAllBooks } from "@/lib/books";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturedPosts from "@/components/FeaturedPosts";
import BookShelf from "@/components/BookShelf";
import Gallery from "@/components/Gallery";

export const dynamic = "force-static";

export default function HomePage() {
  const posts = getAllPosts();
  const books = getAllBooks();

  return (
    <Layout>
      <HeroSection
        name="我的博客"
        tagline="记录思考、阅读与旅途中的见闻"
        avatar="/avatar.jpg"
      />
      <AboutSection bio="你好，我是一个热爱阅读、旅行和思考的人。这个博客是我与世界分享想法的地方。在这里，没有算法推荐、没有流量焦虑，只有真诚的记录。" />
      <FeaturedPosts posts={posts} />
      <BookShelf books={books} />
      <Gallery />
    </Layout>
  );
}
