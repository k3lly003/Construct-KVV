"use client";

import { useState } from "react";
import Link from "next/link";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

interface FAQProps {
  faqHeading: string;
  faqData: Array<{ question: string; answer: string }>;
  notFoundText: string;
  contactButton: string;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => (
  <div className="border-b border-[#D9D9D9]/75 mt-6">
    <button
      className="w-full flex font-bold justify-between items-center text-left focus:outline-none py-4"
      onClick={onClick}
    >
      <span className="text-lg md:text-xl font">{question}</span>
      <span className="ml-2">
        {isOpen ? (
          <svg
            className="w-5 h-5 text-[#FAFAFA]/90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-[#FAFAFA]/90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </span>
    </button>
    {isOpen && (
      <p className="overflow-hidden transition-all duration-500 ease-in-out px-1 pb-4 text-base">
        {answer}
      </p>
    )}
  </div>
);

const FAQ: React.FC<FAQProps> = ({ faqHeading, faqData, notFoundText, contactButton }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mb-12 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        {faqHeading}
      </h2>
      <div>
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
      <div className="flex my-9 justify-center gap-3 items-center">
        <p className="font md:text-base text-sm">
          {notFoundText}
        </p>
        <Link
          href="/contact-us"
          className="text-white p-2 uppercase md:text-[16px] text-xs font rounded bg-[#0B2B4E]"
        >
          {contactButton}
        </Link>
      </div>
    </div>
  );
};

export default FAQ;