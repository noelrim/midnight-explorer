// src/pages/SPODetails.jsx
import React from "react";
import { useParams } from "react-router-dom";
import SPODetailsCard from "../components/SPODetailsCard";

export default function SPODetails() {
  const { author } = useParams();

  return (
    <div className="panel-wrapper" style={{ padding: "2rem" }}>
      <SPODetailsCard authorKey={author} />
    </div>
  );
}