import Navbar from "./Navbar";
import Footer from "./Footer";

const Main = ({ child }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{child}</main>
      <Footer />
    </div>
  );
};

export default Main;
