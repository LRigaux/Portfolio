/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'cdn.pixabay.com',
      'source.unsplash.com',
      'placeimg.com',
      'placekitten.com',
      'via.placeholder.com'
    ],
  },
}

module.exports = nextConfig 