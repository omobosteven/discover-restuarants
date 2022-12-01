/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // disabled because it is creating double data in airtable, React 18 strict issue with nextJs
  images: {
    domains: ["images.unsplash.com", "fastly.4sqi.net"],
  },
};

module.exports = nextConfig;
