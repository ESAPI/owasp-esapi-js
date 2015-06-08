module.exports = {
        build: {
            files: [{
                expand: true,
                dot: true,
                cwd: 'src',
                dest: 'dist',
                src: [
                    'Base.esapi.properties.js', 'i18n/**'
                ]
            }]
        }
};
