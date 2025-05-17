import React from "react";
import Link from "next/link";
import { PAGE_ROUTES } from "@constants/route.constant";
import Upload from "./Upload";

const Page = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav
        className="text-sm mb-4 text-gray-500 flex items-center gap-2"
        aria-label="Breadcrumb"
      >
        <Link
          href={PAGE_ROUTES.HOME.path}
          className="hover:underline text-primary font-semibold"
        >
          Home
        </Link>
        <span className="mx-1">/</span>
        <Link
          href={PAGE_ROUTES.SURVEY.path}
          className="hover:underline text-primary font-semibold"
        >
          Survey
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-700">Upload</span>
      </nav>

      {/* Back Button */}
      <Link
        href={PAGE_ROUTES.SURVEY.path}
        className="inline-flex items-center mb-6 text-primary hover:underline font-medium"
      >
        <span className="mr-2 text-lg">←</span> Back to Survey
      </Link>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 leading-tight">
        Upload Your Survey Data
      </h1>

      {/* Content */}
      <p className="text-lg text-gray-700 mb-8 font-serif">
        Easily upload your completed survey files here. Make sure your data is
        accurate and complete before submitting. If you have any questions,
        please refer to the survey instructions or contact support.
      </p>

      <Upload />
    </div>
  );
};

export default Page;
