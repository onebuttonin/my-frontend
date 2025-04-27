import React from "react";
import { useParams } from "react-router-dom";

export default function CategoryDetail() {
  const { categoryName } = useParams(); // Get the category from the URL

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center">
        Welcome to {categoryName.replace("-", " ")} Collection
      </h1>
      <p className="text-center text-gray-600 mt-4">
        Explore our latest {categoryName.replace("-", " ")} styles.
      </p>
    </div>
  );
}
