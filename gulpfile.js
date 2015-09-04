/*
|
| The file is containing 3 tasks.
| The "default" task is changing the strings vith hardcoded credentials
| The "api-data-prompt" task i using prompt
| The "api-data" task is created for automated Jenkins job and it is accepting parameters on task call
|
*/


var gulp = require('gulp');
var replace = require('gulp-replace-task');
var prompt = require('gulp-prompt');
var argv = require('yargs').argv;


gulp.task('default', function(){

	gulp.src('app/js/app.js')
	.pipe(replace({
      patterns: [
        {
          match: 'u-name',
          replacement: "admin"
        },
        {
          match: 'api-pass',
          replacement: "admin"
        },
        {
          match: 'api-url',
          replacement: "http://grandvision-ifair-server.appropo.info/api"
        }
      ],
      usePrefix: false
    }))
	.pipe(gulp.dest('app/src/'));

});

gulp.task('api-data-prompt', function(){

	gulp.src('app/js/app.js')
	.pipe(prompt.prompt([{

		type: 'input',
		name: 'username',
		message: 'Enter the username:'

	},
	{

		type: 'password',
		name: 'password',
		message: 'Enter the password:'

	},
	{

		type: 'input',
		name: 'api',
		message: 'Enter the Api URL:'

	}], function(res){

		gulp.src('app/js/app.js')
		.pipe(replace({
      patterns: [
        {
          match: 'u-name',
          replacement: res.username
        },
        {
          match: 'api-pass',
          replacement: res.password
        },
        {
          match: 'api-url',
          replacement: res.api
        }
      ],
      usePrefix: false
    }))
	.pipe(gulp.dest('app/src/'));

	}))

});

gulp.task('api-data', function(){

	//console.dir(argv.x);

	gulp.src('app/js/app.js')
		.pipe(replace({
      patterns: [
        {
          match: 'u-name',
          replacement: argv.x
        },
        {
          match: 'api-pass',
          replacement: argv.y
        },
        {
          match: 'api-url',
          replacement: argv.z
        }
      ],
      usePrefix: false
    }))
	.pipe(gulp.dest('app/src/'));

})































