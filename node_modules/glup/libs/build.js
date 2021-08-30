module.exports = {
    // This is the current environment we're building for.
    // It defaults to local
    env: 'local',

    // This holds the configuration after init is run
    config: {},

    /**
     * Initialize the build configuraiton
     *
     * @param  {object} jsonfile
     * @param  {function} extend
     * @param  {object} yargs
     * @param  {string} path
     * @param  {object} options
     */
    init: function init(jsonfile, extend, yargs, options) {
        // Get the pub configuration file
        var json = jsonfile.readFileSync(options.paths.pub);

        // Initialize the environment & config
        this.config = extend(true, {}, json['*'], json[environment.bind(this)()]);

        // Create the output paths
        this.config.outputPaths = getOutputPaths(this.config.paths);

        // Do certain things for certain environments
        switch ( this.env ) {
            case 'production':
                options.sass.outputStyle = 'compressed';
                break;
        }

        ///////////////////////
        // PRIVATE FUNCTIONS //
        ///////////////////////

        /**
         * Get the current environment
         *
         * @return {string}
         */
        function environment() {
            if ( yargs.argv.testing ) return this.env = 'testing';
            if ( yargs.argv.staging ) return this.env = 'staging';
            if ( yargs.argv.production ) return this.env = 'production';
            return this.env;
        }

        /**
         * Get the output paths. If we encounter
         * any variables, then we need to remove them
         * and anything after them.
         *
         * @param  {object} paths
         * @return {object}
         */
        function getOutputPaths(paths) {
            // Prep the output paths object
            var outputPaths = {};

            // Loop through each path, getting its key
            for ( var key in paths ) {
                // Regex to see if there is a variable, recording what comes before it
                var matching = paths[key].match(/(.*?){{.*?}}/);

                // If there is nothing matching,
                // then just record this in the outputPaths & continue
                if ( matching === null ) {
                    outputPaths[key] = paths[key];
                    continue;
                }

                // There is a match, so we need to only record
                // the matching information before the variable
                outputPaths[key] = matching[1];
            }

            // Return the outputPaths
            return outputPaths;
        }
    }
};
