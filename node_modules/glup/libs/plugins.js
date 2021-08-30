module.exports = require('gulp-load-plugins')({
    DEBUG: false,
    pattern: [
        'gulp-*',
        'yargs',
        'extend',
        'jsonfile',
        'browser-sync',
        'lost',
        'bower-files'
    ],
    scope: ['dependencies'],
    rename: {
        'gulp-if': 'gif',
        'gulp-uglify': 'uglify',
        'bower-files': 'bower',
        'gulp-connect-php': 'php'
    }
});