"use client"

import { useState } from 'react';
import Accordion from './accordItem';

export default function FaqSection({ faqSectionData }) {
    const { title, background, faqs } = faqSectionData;
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div
            className="relative flex items-center justify-center overflow-hidden bg-black bg-opacity-50 py-10 md:py-20 px-2 md:px-8"
            style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
                <div className="bg-[#317ACC] bg-opacity-90 rounded-xl shadow-lg w-full max-w-screen-lg px-6 md:px-16 py-8 md:py-12">
                    <h2 className="text-xl md:text-3xl text-white font-bold mb-8 text-center">{title}</h2>
                    <Accordion items={faqs} />
                </div>
        </div>

    );
}
