"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

import Brand from "@/public/images/DesiKing.png";
import Turmeric from "@/public/images/Turmeric.png";

const width = 800;
const height = 800;
const centerX = width / 2;
const centerY = height / 2;
const radius = 200;

const BrandRadialTree = () => {
  const svgRef = useRef();

  const data = {
    name: "DesiKing",
    image: Brand,
    children: [
      {
        name: "Turmeric Powder",
        icon: "🌿",
        description:
          "Rich in color and flavor, known for its anti-inflammatory benefits.",
        image: Turmeric,
      },
      {
        name: "Red Chilli Powder",
        icon: "🌶️",
        description: "Spicy and vibrant, perfect for adding heat to any dish.",
        image: "..publicimagesDesiKing.png",
      },
      {
        name: "Cumin Powder",
        icon: "🌾",
        description: "Warm and earthy spice used in many Indian recipes.",
        image: "..publicimagesDesiKing.png",
      },
      {
        name: "Coriander Powder",
        icon: "🍃",
        description: "Mild, lemony flavor perfect for curries and chutneys.",
        image: "..publicimagesDesiKing.png",
      },
    ],
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Central brand circle with image
    const centerGroup = g.append("g");

    centerGroup
      .append("circle")
      .attr("r", 60)
      .attr("fill", "#c0a16b")
      .attr("stroke", "#5a4b29")
      .attr("stroke-width", 2);

    centerGroup
      .append("text")
      .text(data.name)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("fill", "#1a1a1a")
      .style("font-weight", "bold");

    const angleScale = d3
      .scaleLinear()
      .domain([0, data.children.length])
      .range([0, 2 * Math.PI]);

    const productNodes = g
      .selectAll(".product-node")
      .data(data.children)
      .enter()
      .append("g")
      .attr("class", "product-node")
      .attr("opacity", 0)
      .attr("transform", "translate(0,0)");

    g.on("mouseenter", () => {
      productNodes
        .transition()
        .duration(1000)
        .attr("opacity", 1)
        .attrTween("transform", function (d, i) {
          return function (t) {
            const angle = angleScale(i);
            const x = t * radius * Math.cos(angle);
            const y = t * radius * Math.sin(angle);
            return `translate(${x},${y})`;
          };
        });

      productNodes
        .append("path")
        .attr("class", "connector")
        .attr("d", function (d, i) {
          const angle = angleScale(i);
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return d3.line().curve(d3.curveBasis)([
            [0, 0],
            [x / 2, y / 2 - 40],
            [x, y],
          ]);
        })
        .attr("fill", "none")
        .attr("stroke", "#888")
        .attr("stroke-width", 1.5);
    });

    g.on("mouseleave", () => {
      productNodes
        .transition()
        .duration(300)
        .attr("opacity", 0)
        .attr("transform", "translate(0,0)");
      svg.selectAll(".connector").remove();
    });
  }, []);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
      <svg ref={svgRef} width={width} height={height} />
      <Box
        sx={{
          position: "absolute",
          top: "160px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {data.children.map((product, index) => (
          <Card
            key={index}
            sx={{
              width: 200,
              opacity: 0,
              transition: "opacity 0.3s ease",
              animation: "fadeIn 1s forwards",
              animationDelay: `${index * 0.2}s`,
            }}
          >
            <CardMedia
              component="img"
              height="120"
              image={product.image}
              alt={product.name}
            />
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {product.name}
              </Typography>
              <Typography variant="body2">{product.description}</Typography>
              <Button variant="contained" size="small" sx={{ mt: 1 }}>
                Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default BrandRadialTree;
