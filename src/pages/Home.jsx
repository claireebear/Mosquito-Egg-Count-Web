import { Navbar, Main, Product, Footer } from "../components";
import LoadingDialog from "../components/LoadingDialog";

function Home() {
  return (
    <>
      <Navbar />
      <Main />
      <Product />
      <Footer />
      <LoadingDialog />
    </>
  )
}

export default Home