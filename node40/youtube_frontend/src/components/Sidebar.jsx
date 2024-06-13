import React from "react";
import { Stack } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { getVideoTypeAPI } from "../utils/fetchFromAPI";

let categories = [];

const Categories = ({ selectedCategory, setSelectedCategory }) => {

  getVideoTypeAPI().then(result => {
    console.log(result)
    categories = result
  })

  const navigate = useNavigate();

  return (<Stack
    direction="row"
    sx={{
      overflowY: "auto",
      height: { sx: "auto", md: "95%" },
      flexDirection: { md: "column" },
    }}
  >
    {categories.map((category) => (
      <button
        className="category-btn"
        onClick={() => navigate("/videoType/" + category.type_id)}
        style={{
          background: category.type_id === selectedCategory && "#FC1503",
          color: "white",
        }}
        key={category.type_id}
      >
        <span style={{ color: category.name === selectedCategory ? "white" : "red", marginRight: "15px" }}>

          <i className={category.icon}></i>
        </span>
        <span style={{ opacity: category.name === selectedCategory ? "1" : "0.8" }}>
          {category.type_name}
        </span>
      </button>
    ))}
  </Stack>
  )
};

export default Categories;
