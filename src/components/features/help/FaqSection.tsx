"use client";

import { useState } from "react";
import Link from "next/link";

interface faqItemProps{
    question: string, 
    answer: string, 
    isOpen: boolean, 
    onClick: () => void
}

const FAQItem = ({ question, answer, isOpen, onClick }: faqItemProps) => (
  <div className="border-b border-[#D9D9D9]/75 mt-6">
    <button
      className="w-full flex font-bold justify-between items-center text-left focus:outline-none py-4"
      onClick={onClick}
    >
      <span className="text-mid md:text-mid font">{question}</span>
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

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "What types of construction materials do you offer?",
      answer:
        "We offer a wide range of construction materials including cement, aggregates, steel, lumber, roofing materials, plumbing supplies, electrical components, and more. Our catalog is constantly expanding to meet your project needs.",
    },
    {
      question: "How do I request a quote for bulk orders?",
      answer:
        'For large or specialized orders, please visit our "Request a Quote" page or contact our sales team directly. Provide details about the materials and quantities you require, and we will get back to you with a customized quote.',
    },
    {
      question: "What are your delivery options for construction sites?",
      answer:
        "We offer various delivery options tailored for construction sites, including flatbed trucks, crane trucks, and smaller vehicles for limited access areas. Delivery costs and timelines vary depending on the location and the size of your order. Please see our Delivery & Shipping guide for more details.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept major credit cards (Visa, Mastercard, American Express), bank transfers, and potentially offer credit accounts for established businesses. Please refer to our Payment Options page for a complete list.",
    },
    {
      question: "What is your return policy on construction materials?",
      answer:
        "Due to the nature of construction materials, our return policy may vary depending on the product. Please review our Returns & Exchanges guide or contact our support team for specific information regarding returns.",
    },
  ];

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mb-12 max-w-7xl mx-auto">
      <h2 className="text-mid md:text-title font-bold text-center mb-8">
        Frequently Asked Questions
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
        <p className="font md:text-base text-small">
          My question is not here.
        </p>
        <Link
          href="/contact-us"
          className="text-white p-2 uppercase md:text-[16px] text-small font rounded bg-[#0B2B4E]"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default FAQ;