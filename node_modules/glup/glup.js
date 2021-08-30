// Import some stuff
var gulp = require('gulp');
var plugins = require('./libs/plugins.js');
var defaults = require('./libs/defaults.js');
var build = require('./libs/build.js');
var options;

// Define & export our buddy, glup
module.exports = function glup(config) {
    // Define options as an extension of config & defaults
    options = plugins.extend(true, {}, defaults, config || {});
    options.plumber.errorHandler = handleGulpErrors;

    // Setup allScripts, which includes bower plugins
    options.paths.sources.allScripts = plugins.bower().dev().ext('js').files.concat(options.paths.sources.scripts);

    // Initialize the build configuration
    build.init(plugins.jsonfile, plugins.extend, plugins.yargs, options);

    // Create the tasks
    gulp.task('scripts', compileScripts);
    gulp.task('sass', compileSass);
    gulp.task('watch', ['php-sync', 'default'], gulpWatch);
    gulp.task('php-sync', gulpPhp);
    gulp.task('default', ['scripts', 'sass']);
};

/**
 * Compile the scripts!
 */
function compileScripts() {
    // Set up the filter
    const filter = plugins.filter(options.paths.sources.scripts, {restore: true});

    // Do that gulp thang
    return gulp.src(options.paths.sources.allScripts)
        .pipe(plugins.plumber(options.plumber))
        .pipe(plugins.cached('scripts'))
        .pipe(filter)
        .pipe(plugins.pub(build.config.paths, build.config.base))
        .pipe(plugins.jshint(options.jshint))
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'))
        .pipe(plugins.gif(!plugins.yargs.argv.production, plugins.sourcemaps.init()))
        .pipe(plugins.babel({ presets: ['es2015'] }))
        .pipe(filter.restore)
        .pipe(plugins.remember('scripts'))
        .pipe(plugins.concat(options.paths.builds.scripts.filename))
        .pipe(plugins.gif(plugins.yargs.argv.production, plugins.uglify()))
        .pipe(plugins.gif(!plugins.yargs.argv.production, plugins.sourcemaps.write()))
        .pipe(gulp.dest(`${options.paths.builds.scripts.base}/${build.config.outputPaths.js}`))
        .pipe(plugins.notify({
            title: 'Scripts Compiled',
            message: `Environment: ${build.env.toUpperCase()}`
        }));
}

/**
 * Compile SASS!
 */
function compileSass() {
    return gulp.src(options.paths.sources.sass)
        .pipe(plugins.plumber(options.plumber))
        .pipe(plugins.gif(!plugins.yargs.argv.production, plugins.sourcemaps.init()))
        .pipe(plugins.sass(options.sass))
        .pipe(plugins.pub(build.config.paths, build.config.base))
        .pipe(plugins.postcss([plugins.lost()]))
        .pipe(plugins.gif(!plugins.yargs.argv.production, plugins.sourcemaps.write()))
        .pipe(plugins.autoprefixer(options.autoprefixer))
        .pipe(gulp.dest(`${options.paths.builds.sass.base}/${build.config.outputPaths.css}`))
        .pipe(plugins.browserSync.stream())
        .pipe(plugins.notify({
            title: 'SASS Compiled',
            message: `Environment: ${build.env.toUpperCase()}`
        }));
}

/**
 * Watch stuff!
 */
function gulpWatch() {
    // Watch scripts
    gulp.watch(options.paths.watch.scripts, ['scripts'])
        .on('change', function scriptsChanged(event) {
            if ( event.type == 'deleted' ) {
                delete plugins.cached.caches.scripts[event.path];
                plugins.remember.forget('scripts', event.path);
            }
        });

    // Watch sass
    gulp.watch(options.paths.watch.sass, ['sass']);

    // Watch things that we need to reload the browser for
    gulp.watch(options.paths.watch.reloaders, plugins.browserSync.reload);

    // Watch pub.json
    gulp.watch(options.paths.pub, ['default'])
        .on('change', function pubJsonChanged(event) {
            plugins.cached.caches = {};
            plugins.remember.forgetAll('scripts');
        });
}

/**
 * Get PHP running with browser sync!
 */
function gulpPhp() {
    plugins.php.server(options.php,
    function phpConnected() {
        // Initialize Browsersync
        plugins.browserSync.init({
            proxy: `${options.php.hostname}:${options.php.port}`
        });
    });
}

/**
 * Handle gulp errors
 */
function handleGulpErrors(error) {
    // Configure the error message
    plugins.notify.onError({
        title: `${error.name}: ${error.plugin}`,
        message: '<%= error.message %>'
    })(error);

    // Tell gulp to go to the end
    this.emit('end');
}
