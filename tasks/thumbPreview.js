'use strict';

const config = global.config,
      gulp = require('gulp'),
      gutil = require('gulp-util'),
      Pageres = require('pageres'),
      rename = require('gulp-rename'),
      functions = require('../config/functions'),
      path = require('path'),
      fs = require('fs');

module.exports = function () {
    return config.slides.reduce(function( curName, currentSlide ){
        currentSlide.copy ? curName = currentSlide.copy : curName = currentSlide.num;
        let folderName = functions.getCurNameSlide( currentSlide.num );
        
        if(currentSlide.isFile){
            
            gulp.src('./config/preview.jpg')
                .pipe(rename(folderName+'/'+folderName+'-thumb.jpg'))
                .pipe(gulp.dest(config.readyBDir));
            gutil.log('Thumb preview for file ' + gutil.colors.blue(folderName) + ' created!');
            
        }else{        
            let html = path.join(config.readyBDir, folderName, folderName + '.html'),
                pageres = new Pageres({delay: 0, filename: folderName+'-thumb', format: 'jpg', scale: 0.2})
                .src(html, ['1024x768'])
                .dest(path.join(config.readyBDir, folderName))
                .run()
                .then(() => gutil.log('Thumb preview for ' + gutil.colors.green(folderName) + ' created!'));
        }
    },0);  
};
