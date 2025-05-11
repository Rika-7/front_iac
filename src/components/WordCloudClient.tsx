"use client";

import React from "react";
import dynamic from "next/dynamic";
import { WordCloudItem } from "@/types/dashboard";

const WordCloudDynamic = dynamic(
  () => import("@/components/common/WordCloud"),
  { ssr: false }
);

interface Props {
  words: WordCloudItem[];
}

const WordCloudClient: React.FC<Props> = ({ words }) => {
  if (!words || words.length === 0 || !words[0]?.text) {
    return <p className="text-gray-500">表示するキーワードがありません</p>;
  }

  return (
    <WordCloudDynamic
      words={words}
      width={600}
      height={400}
      fontSize={20}
      fontFamily="Arial"
      padding={5}
      rotate={0}
    />
  );
};

export default WordCloudClient;
