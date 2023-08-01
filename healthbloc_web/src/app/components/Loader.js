import React from "react";
import { PuffLoader } from "react-spinners";

export default function Loader() {
  return (
    <div
      style={{
        height: "75vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PuffLoader size={100} color="blue" />
    </div>
  );
}
