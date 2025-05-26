import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FloatingCartButton({ loginStatus }) {
  const navigate = useNavigate();

  if (!(loginStatus?.Status && loginStatus?.Role === 0)) return null;

  return (
    <div
      onClick={() => navigate("/cart")}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        background: "linear-gradient(to right, #000, #333)",
        color: "white",
        borderRadius: "50%",
        padding: "15px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <ShoppingCart size={28} />
    </div>
  );
}

export default FloatingCartButton;
