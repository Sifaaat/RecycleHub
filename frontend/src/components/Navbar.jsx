function Navbar() {
  return (
    <nav
      style={{
        background: "#1f2937",
        color: "white",
        padding: "18px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <h2>RecycleHub</h2>

      <div>
        Home | Products | Contact | Login
      </div>
    </nav>
  );
}

export default Navbar;
