const withImages = require('next-images')

/** @type {import("next").NextConfig} */
const config = withImages({
  esModule: true,
})

module.exports = config
