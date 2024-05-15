// import { useEffect, useState } from "react";

// const Bubble = ({
//   color,
//   popped,
//   onClick,
//   children,
//   bubbleSize = 100,
// }: any) => {
//   const [position, setPosition] = useState({
//     x: Math.random() * window.innerWidth - bubbleSize,
//     y: Math.random() * window.innerHeight - bubbleSize,
//   });

//   const [speed] = useState(Math.random() * 4 + 2); // Random speed between 1 and 5
//   const screenWidth = window.innerWidth;
//   const screenHeight = window.innerHeight;

//   useEffect(() => {
//     let increasing = true;
//     // const intervalId = setInterval(() => {
//     //   setPosition((prevPosition) => {
//     //     let newY = prevPosition.y - speed;

//     //     // If bubble reaches the top or bottom, reverse its direction
//     //     if (newY <= 0 || newY >= screenHeight - bubbleSize) {
//     //       newY = newY <= 0 ? prevPosition.y + speed : screenHeight - bubbleSize;
//     //     }
//     //     console.log(newY <= 0, newY, screenHeight - bubbleSize);
//     //     return { ...prevPosition, y: newY };
//     //   });
//     // }, 50);
//     const intervalId = setInterval(() => {
//       setPosition((prevPosition) => {
//         let newY = 0;
//         if (increasing) {
//           newY = prevPosition.y - speed;
//           if (newY <= 0) {
//             increasing = false;
//             newY = prevPosition.y + speed;
//           }
//         } else {
//           newY = prevPosition.y + speed;
//           if (newY >= screenHeight - bubbleSize) {
//             increasing = true;
//             newY = prevPosition.y - speed;
//           }
//         }
//         return { ...prevPosition, y: newY };
//       });
//     }, 50);

//     return () => clearInterval(intervalId);
//   }, []);

//   function bubbleMovement() {
//     let increasing = true;
//     const intervalId = setInterval(() => {
//       setPosition((prevPosition) => {
//         let newY = 0;
//         if (increasing) {
//           newY = prevPosition.y - speed;
//           if (newY <= 0) {
//             increasing = false;
//             newY = prevPosition.y + speed;
//           }
//         } else {
//           newY = prevPosition.y + speed;
//           if (newY >= screenHeight - bubbleSize) {
//             increasing = true;
//             newY = prevPosition.y - speed;
//           }
//         }
//         return { ...prevPosition, y: newY };
//       });
//     }, 1000);

//     // Uncomment this if you want to stop the interval after a certain number of iterations
//     setTimeout(() => {
//       clearInterval(intervalId);
//     });
//   }
//   const floatAnimation = `
//   @keyframes float {
//     0% {
//       transform: translateY(0px);
//     }
//     50% {
//       transform: translateY(-300px);
//     }
//     100% {
//       transform: translateY(0px);
//     }
//   }
// `;

//   return (
//     <div
//       className={` cursor-pointer bubble absolute rounded-full ${
//         popped ? "hidden" : "block"
//       }`}
//       style={{
//         position: "absolute",
//         top: position.y,
//         left: position.x,
//         backgroundColor: color,
//         width: `${bubbleSize}px`,
//         height: `${bubbleSize}px`,
//       }}
//       onClick={onClick}
//     >
//       {children}
//     </div>
//     // <div
//     //   className={` cursor-pointer bubble absolute rounded-full ${
//     //     popped ? "hidden" : "block"
//     //   }`}
//     //   style={{
//     //     position: "absolute",
//     //     // top: position.y,
//     //     left: position.x,
//     //     backgroundColor: color,
//     //     width: `${bubbleSize}px`,
//     //     height: `${bubbleSize}px`,
//     //     animation: `float 5s ease-in-out infinite`,
//     //   }}
//     //   onClick={onClick}
//     // >
//     //   {children}
//     //   <style>{floatAnimation}</style>
//     // </div>
//   );
// };

// export default Bubble;

import { useEffect, useState } from "react";

const Bubble = ({ color, onClick, bubbleSize = 100 }: any) => {
  // console.log(color);
  const [position, setPosition] = useState({
    x: Math.random() * window.innerWidth - bubbleSize,
    y: Math.random() * window.innerHeight - bubbleSize,
  });

  const [speed] = useState(Math.random() * 4 + 2); // Random speed between 1 and 5
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  useEffect(() => {
    let increasing = true;

    const intervalId = setInterval(() => {
      setPosition((prevPosition) => {
        let newY = 0;
        if (increasing) {
          newY = prevPosition.y - speed;
          if (newY <= 0) {
            increasing = false;
            newY = prevPosition.y + speed;
          }
        } else {
          newY = prevPosition.y + speed;
          if (newY >= screenHeight - bubbleSize) {
            increasing = true;
            newY = prevPosition.y - speed;
          }
        }
        return { ...prevPosition, y: newY };
      });
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  const floatAnimation = `
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-300px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

  return (
    <div
      className="cursor-pointer bubble absolute rounded-full block"
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        backgroundColor: color,
        width: `${bubbleSize}px`,
        height: `${bubbleSize}px`,
      }}
      onClick={onClick}
    ></div>
  );
};

export default Bubble;
