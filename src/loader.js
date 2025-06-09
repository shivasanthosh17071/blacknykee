import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Loader = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const circles = svgRef.current.querySelectorAll(".circle");
    gsap.set(svgRef.current, { visibility: "visible" });

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    circles.forEach((circle, i) => {
      tl.to(
        circle,
        {
          y: -20,
          duration: 0.5,
          ease: "power1.inOut",
        },
        i * 0.1
      );
    });

    return () => tl.kill();
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center  position-fixed top-0 start-0 w-100 h-100"
      style={{ zIndex: 1050 ,
        background:"  linear-gradient(45deg,rgba(0, 0, 0, 0.25),rgba(0, 0, 0, 0.28))"
      }}
    >
      <svg
        ref={svgRef}
        width="160"
        height="60"
        viewBox="0 0 160 60"
        style={{ visibility: "hidden" }}
      >
        <circle className="circle" cx="20" cy="30" r="10" fill="#FF595E" />
        <circle className="circle" cx="50" cy="30" r="10" fill="#FFCA3A" />
        <circle className="circle" cx="80" cy="30" r="10" fill="#8AC926" />
        <circle className="circle" cx="110" cy="30" r="10" fill="#1982C4" />
        <circle className="circle" cx="140" cy="30" r="10" fill="#6A4C93" />
      </svg>
    </div>
  );
};

export default Loader;
