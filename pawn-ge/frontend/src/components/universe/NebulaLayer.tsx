"use client";

import { universeColors, motionTiming } from "./universe.config";

export default function NebulaLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Nebula cloud 1 - blue */}
      <div
        className="absolute rounded-full blur-[90px]"
        style={{
          width: "50vw",
          height: "35vw",
          left: "-10%",
          top: "10%",
          background: `radial-gradient(circle, ${universeColors.electricBlue}, transparent 70%)`,
          opacity: 0.07,
          animation: `nebulaDrift ${motionTiming.nebulaCycle}ms ease-in-out infinite alternate`,
        }}
      />
      
      {/* Nebula cloud 2 - violet */}
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: "45vw",
          height: "30vw",
          right: "-5%",
          top: "25%",
          background: `radial-gradient(circle, ${universeColors.electricViolet}, transparent 70%)`,
          opacity: 0.06,
          animation: `nebulaDrift2 ${motionTiming.nebulaCycle * 1.1}ms ease-in-out infinite alternate-reverse`,
        }}
      />
      
      {/* Nebula cloud 3 - indigo depth */}
      <div
        className="absolute rounded-full blur-[80px]"
        style={{
          width: "40vw",
          height: "28vw",
          left: "30%",
          bottom: "15%",
          background: `radial-gradient(circle, ${universeColors.deepIndigo}, transparent 70%)`,
          opacity: 0.08,
          animation: `nebulaDrift3 ${motionTiming.nebulaCycle * 0.9}ms ease-in-out infinite alternate`,
        }}
      />
      
      {/* Nebula cloud 4 - subtle violet cloud */}
      <div
        className="absolute rounded-full blur-[120px]"
        style={{
          width: "55vw",
          height: "38vw",
          right: "15%",
          bottom: "-10%",
          background: `radial-gradient(circle, ${universeColors.nebulaViolet}, transparent 70%)`,
          opacity: 0.05,
          animation: `nebulaDrift4 ${motionTiming.nebulaCycle * 1.2}ms ease-in-out infinite alternate-reverse`,
        }}
      />
    </div>
  );
}
