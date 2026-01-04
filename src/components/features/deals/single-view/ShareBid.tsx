import React from 'react';
import { Mail, Facebook, Linkedin, Twitter, Instagram } from 'lucide-react';

interface ShareProps {
  title?: string;
  url?: string; 
}

const Share: React.FC<ShareProps> = ({ title = 'Share', url }) => {
  // If no URL is provided, you might want to use the current page URL.
  // In a Next.js app, you can use useRouter, but for broader compatibility,
  // we'll leave it as an optional prop.  If you *always* want current URL
  // in a Next.js app, you'd uncomment the lines below.
  // const router = useRouter();
  // const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const currentUrl = url || "https://example.com";

  const shareLinks = {
    email: `mailto:?subject=${encodeURIComponent(title || 'Share this')}&body=${encodeURIComponent(currentUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title || '')}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title || '')}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(currentUrl)}`,
  };

  return (
    <div className="flex flex-col items-start">
      <span className="text-small font-medium text-gray-700 dark:text-gray-300 mb-2">{title}</span>
      <div className="flex space-x-4">
        <a href={shareLinks.email} target="_blank" rel="noopener noreferrer" aria-label="Share via Email">
          <Mail className="h-5 w-5 text-gray-700 hover:text-blue-900 transition-colors" />
        </a>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
          <Facebook className="h-5 w-5 text-gray-700 hover:text-blue-900 transition-colors" />
        </a>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
          <Linkedin className="h-5 w-5 text-gray-700 hover:text-blue-900 transition-colors" />
        </a>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
          <Twitter className="h-5 w-5 text-gray-700 hover:text-blue-900 transition-colors" />
        </a>
        <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Share on Instagram">
          <Instagram className="h-5 w-5 text-gray-500 hover:text-blue-900 transition-colors" />
        </a>
      </div>
    </div>
  );
};

export default Share;
