const htmlmin = require('html-minifier');
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  // Watch our compiled assets for changes
  eleventyConfig.addWatchTarget('./src/compiled-assets/main.css');
  eleventyConfig.addWatchTarget('./src/compiled-assets/main.js');
  eleventyConfig.addWatchTarget('./src/compiled-assets/vendor.js');

  // Copy src/compiled-assets to /assets
  eleventyConfig.addPassthroughCopy({ 'src/compiled-assets': 'assets' });
  // Copy all images
  eleventyConfig.addPassthroughCopy('src/images');

  // Generate Atom XML feed
  eleventyConfig.addPlugin(pluginRss);

  if (process.env.ELEVENTY_ENV === 'production') {
    eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
      if (outputPath.endsWith('.html')) {
        const minified = htmlmin.minify(content, {
          collapseInlineTagWhitespace: false,
          collapseWhitespace: true,
          removeComments: true,
          sortClassName: true,
          useShortDoctype: true,
        });

        return minified;
      }

      return content;
    });
  }

  return {
    dir: {
      includes: '_includes',
      input: 'src',
      layouts: '_layouts',
      output: 'dist',
    },
    markdownTemplateEngine: 'njk',
    templateFormats: [
      'njk',
      'md',
    ],
  };
};