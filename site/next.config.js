const withImages = require('next-images')

/** @type {import("next").NextConfig} */
const config = withImages({
  esModule: true,
  experimental: {
    serverComponents: true,
  },
})

module.exports = config
