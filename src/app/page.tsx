import { asset } from "@/lib/path";
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
        name="何宣颖"
        tagline="写下即永恒"
        avatar={asset("/avatar.png")}
      />
      <AboutSection bio="你好，我是何宣颖。一个热爱阅读、旅行和思考的人。这里是我的精神自留地——没有算法推荐，没有流量焦虑，只有真诚的记录和分享。" />
      <FeaturedPosts posts={posts} />
      <BookShelf books={books} />
      <Gallery />
    </Layout>
  );
}
