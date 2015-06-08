module.exports = {
  options: {
    banner: '<%= banner %>',
    stripBanners: true
  },
  dist: {
    src: ['src/core.js', 'src/org/**/*js'],
    dest: 'dist/ESAPI.js'
  }
};
