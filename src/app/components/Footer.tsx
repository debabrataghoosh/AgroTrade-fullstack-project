import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white w-full shadow-lg p-10 mt-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-0 justify-between items-start">
        {/* Left: Logo, description, socials */}
        <div className="flex-1 min-w-[220px] flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/agro-tradelogo.png" alt="AgroTrade Logo" className="h-10 w-auto" />
          </div>
          <p className="text-gray-600 max-w-md leading-relaxed">
            A modern marketplace for farm produce, byproducts, and more. Empowering agriculture, one trade at a time.
          </p>
          <div className="flex gap-4 mt-2">
            {[FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaYoutube].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                aria-label="Social"
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-xl"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
        {/* Right: Links */}
        <div className="flex flex-1 justify-end w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full max-w-2xl">
            <div>
              <h3 className="font-bold text-green-700 mb-4 text-base">Product</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Features</Link></li>
                <li><Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Integrations</Link></li>
                <li><Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-700 mb-4 text-base">Resources</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Tutorials</Link></li>
                <li><Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-700 mb-4 text-base">Company</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">About</Link></li>
                <li><Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Partners</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-gray-200 my-8" />
      {/* Bottom row */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
        <div>&copy; {new Date().getFullYear()} AgroTrade. All rights reserved.</div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Cookies Settings</Link>
        </div>
      </div>
    </footer>
  );
} 