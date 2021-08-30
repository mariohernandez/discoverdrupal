module.exports = {
    sass: {},
    autoprefixer: {},
    jshint: {
        esversion: 6,
        laxbreak: true,
        "-W086": true, // Allow switch/case fall-through
        "-W027": true  // Allow early return before if statements
    },
    plumber: {},
    php: {
        base: 'public',
        hostname: '127.0.0.1',
        port: '8000'
    },
    paths: {
        pub: 'pub.json',
        sources: {
            sass: 'resources/assets/sass/app.sass',
            scripts: 'resources/assets/scripts/**/*.js'
        },
        builds: {
            sass: {
                base: 'public',
                filename: 'app.css'
            },
            scripts: {
                base: 'public',
                filename: 'app.js'
            }
        },
        watch: {
            scripts: 'resources/assets/scripts/**/*.js',
            sass: [
                'resources/assets/sass/**/*.sass',
                'resources/assets/sass/**/*.scss',
                'resources/assets/sass/**/*.css'
            ],
            reloaders: [
                'public/assets/templates/**/*.html',
                'resources/views/**/*.blade.php',
                'public/builds/local/scripts/app.js'
            ]
        }
    }
};
