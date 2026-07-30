import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />

      <main
        style={{
          textAlign: "center",
          padding: "80px 20px",
          minHeight: "70vh",
        }}
      >
        <h1>Welcome to RecycleHub</h1>

        <p>
          Recycle today for a greener tomorrow.
        </p>
      </main>

      <Footer />
    </>
  );
}

export default App;