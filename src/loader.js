import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Loader = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const boxes = Array.from(svgRef.current.querySelectorAll(".box"));

    gsap.set(svgRef.current, { visibility: "visible" });

    const tl = gsap.timeline({ repeat: -1 });

    boxes.forEach((box, index) => {
      tl.to(
        box,
        {
          rotation: "+=360",
          scale: 1.2,
          transformOrigin: "50% 50%",
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        },
        index * 0.1
      ).to(
        box,
        {
          scale: 1,
          duration: 0.4,
          ease: "power2.inOut",
        },
        index * 0.1 + 0.6
      );
    });

    return () => tl.kill();
  }, []);

  return (
    <div style={styles.backdrop}>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 100"
        style={styles.svg}
      >
        <g className="box" transform="translate(40, 20)">
          <rect width="50" height="50" fill="rgb(255, 0, 25)" rx="8" />
        </g>
        <g className="box" transform="translate(100, 20)">
          <rect width="50" height="50" fill="rgb(255, 247, 0)" rx="8" />
        </g>
        <g className="box" transform="translate(160, 20)">
          <rect width="50" height="50" fill=" white" rx="8" />
        </g>
        <g className="box" transform="translate(220, 20)">
          <rect width="50" height="50" fill="	#E0E0E0" rx="8" />
        </g>
        <g className="box" transform="translate(280, 20)">
          <rect width="50" height="50" fill="#8ECAE6" rx="8" />
        </g>
      </svg>
    </div>
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(61, 61, 61, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  svg: {
    width: "240px",
    height: "80px",
    visibility: "hidden",
  },
};

export default Loader;
