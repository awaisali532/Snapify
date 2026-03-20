import Hero from "../../components/Public/Home/Hero";
import Features from "../../components/Public/Home/Features";
import ReviewSlider from "../../components/Public/Home/ReviewSlider";

const HomePage = () => {
  return (
    <div className="bg-white dark:bg-snap-dark min-h-screen text-black dark:text-snap-text transition-colors duration-300">
      <Hero />
      <Features />
      <ReviewSlider />
    </div>
  );
};
export default HomePage;
