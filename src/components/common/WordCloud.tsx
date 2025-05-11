import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

interface WordCloudProps {
  words: WordItem[];
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  padding?: number;
  rotate?: number | ((word: WordItem) => number);
  colors?: string[];
}

interface WordItem {
  text: string;
  value: number;
}

interface WordLayout extends WordItem {
  size: number;
  x?: number;
  y?: number;
  rotate?: number;
  color?: string;
}

const WordCloud: React.FC<WordCloudProps> = ({
  words,
  width = 800,
  height = 600,
  fontSize = 20,
  fontFamily = "Arial",
  padding = 5,
  rotate = 0,
  colors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
  ],
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!words.length || !svgRef.current) return;

    try {
      // Clear previous content
      d3.select(svgRef.current).selectAll("*").remove();

      // Normalize word values to be used for font sizing
      const maxValue = Math.max(...words.map((w) => w.value));
      const normalizedWords = words.map((word) => ({
        ...word,
        size: (word.value / maxValue) * fontSize * 3 + fontSize,
      }));

      // Create the layout
      const layout = cloud<WordLayout>()
        .size([width, height])
        .words(normalizedWords)
        .padding(padding)
        .rotate(() => {
          if (typeof rotate === "function") {
            // Handle the case where rotate is a function
            const firstWord = normalizedWords[0];
            return rotate(firstWord);
          }
          // Handle the case where rotate is a number
          return rotate;
        })
        .fontSize((d) => (d as WordLayout).size)
        .on("end", (layoutWords: WordLayout[]) => {
          if (!svgRef.current) return;

          // Add colors to the words
          layoutWords.forEach((word, i) => {
            word.color = colors[i % colors.length];
          });

          // Render the words
          const svg = d3.select(svgRef.current);

          svg
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`)
            .selectAll("text")
            .data(layoutWords)
            .enter()
            .append("text")
            .style("font-size", (d) => `${d.size}px`)
            .style("font-family", fontFamily)
            .style("fill", (d) => d.color || "#000")
            .attr("text-anchor", "middle")
            .attr(
              "transform",
              (d) =>
                `translate(${d.x || 0},${d.y || 0}) rotate(${d.rotate || 0})`
            )
            .text((d) => d.text);
        });

      layout.start();
    } catch (error) {
      console.error("Error generating word cloud:", error);
    }
  }, [words, width, height, fontSize, fontFamily, padding, rotate, colors]);

  return (
    <div className="word-cloud-container" style={{ width, height }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ overflow: "visible" }}
      ></svg>
    </div>
  );
};

export default WordCloud;
