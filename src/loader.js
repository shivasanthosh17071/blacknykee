import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Loader = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const select = (s) => svgRef.current.querySelector(s);

    gsap.set(svgRef.current, {
      visibility: "visible",
    });

    const tl = gsap.timeline({
      repeat: -1,
      defaults: {
        ease: "elastic(0.13, 0.5)",
      },
    });

    tl.to("#box1", {
      rotation: "+=180",
      transformOrigin: "100% 0%",
    })
      .from(
        "#box5",
        {
          rotation: "-=180",
          transformOrigin: "0% 0%",
        },
        0
      )
      .to("#box1", {
        rotation: "+=90",
        transformOrigin: "0% 0%",
      })
      .to("#box1", {
        rotation: "+=90",
        transformOrigin: "0% 100%",
      })
      .to("#box1", {
        rotation: "+=90",
        transformOrigin: "100% 100%",
      })
      .to("#box1", {
        rotation: "+=180",
        transformOrigin: "100% 0%",
      })

      // Box 2
      .to(
        "#box2",
        {
          rotation: "+=180",
          transformOrigin: "100% 0%",
        },
        "-=0.5"
      )
      .to("#box2", {
        rotation: "+=90",
        transformOrigin: "0% 0%",
      })
      .to("#box2", {
        rotation: "+=90",
        transformOrigin: "0% 100%",
      })
      .to("#box2", {
        rotation: "+=90",
        transformOrigin: "100% 100%",
      })
      .to("#box2", {
        rotation: "+=180",
        transformOrigin: "100% 0%",
      })

      // Box 3
      .to(
        "#box3",
        {
          rotation: "+=180",
          transformOrigin: "100% 0%",
        },
        "-=0.5"
      )
      .to("#box3", {
        rotation: "+=90",
        transformOrigin: "0% 0%",
      })
      .to("#box3", {
        rotation: "+=90",
        transformOrigin: "0% 100%",
      })
      .to("#box3", {
        rotation: "+=90",
        transformOrigin: "100% 100%",
      })
      .to("#box3", {
        rotation: "+=180",
        transformOrigin: "100% 0%",
      })

      // Box 4
      .to(
        "#box4",
        {
          rotation: "+=180",
          transformOrigin: "100% 0%",
        },
        "-=0.5"
      )
      .to("#box4", {
        rotation: "+=90",
        transformOrigin: "0% 0%",
      })
      .to("#box4", {
        rotation: "+=90",
        transformOrigin: "0% 100%",
      })
      .to("#box4", {
        rotation: "+=90",
        transformOrigin: "100% 100%",
      })
      .to("#box4", {
        rotation: "+=180",
        transformOrigin: "100% 0%",
      })

      // Box 5
      .to(
        "#box5",
        {
          rotation: "+=180",
          transformOrigin: "100% 0%",
        },
        "-=0.5"
      )
      .to("#box5", {
        rotation: "+=90",
        transformOrigin: "0% 0%",
      })
      .to("#box5", {
        rotation: "+=90",
        transformOrigin: "0% 100%",
      })
      .to("#box5", {
        rotation: "+=90",
        transformOrigin: "100% 100%",
      })

      // Slide left
      .to(
        "#whole",
        {
          duration: 2 * 5,
          x: -(64 * 5),
          ease: "none",
        },
        0
      );

    return () => tl.kill(); // Clean up
  }, []);
  const modalBackdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };
  return (
    <div className="modal-backdrop" style={modalBackdropStyle}>
      <div className="d-flex flex-column align-items-center">
        <div
          style={{
            backgroundColor: "",
            overflow: "hidden",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            id="mainSVG"
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 400"
            style={{
              width: "50%",
              height: "50%",
              visibility: "hidden",
            }}
          >
            <g id="whole">
              <g id="box1">
                <rect x="40" y="200" width="64" height="64" fill="#FB8500" />
              </g>
              <g id="box2">
                <rect x="104" y="200" width="64" height="64" fill="#FFB703" />
              </g>
              <g id="box3">
                <rect x="168" y="200" width="64" height="64" fill="#023047" />
              </g>
              <g id="box4">
                <rect x="232" y="200" width="64" height="64" fill="#219EBC" />
              </g>
              <g id="box5">
                <rect x="296" y="200" width="64" height="64" fill="#8ECAE6" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Loader;
