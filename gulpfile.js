'use strict';

const { src, dest, parallel, watch, series } = require('gulp'),
                                uglify       = require('gulp-uglify'),
                                scss         = require('gulp-sass'),
                                babel        = require('gulp-babel'),
                                cleanCss     = require('gulp-clean'),
                                glob         = require('gulp-sass-glob'),
                                browserSync  = require("browser-sync").create(),
                                pug          = require('gulp-pug');


const path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/'
    },
    src: {
        html: 'src/[^_]*.pug',
        js: 'src/js/*.js',
        css: 'src/css/*.scss'
    },
    clean: 'build'
};

function browser() {
    browserSync.init({
        server: {
            baseDir: "build"
        },
        notify: false,
    })
}

function watchFiles() {
    watch("src/**/*.scss", css).on('change', function () {
        css()
        browserSync.reload()
    });
    watch("src/**/*.js").on('change', function () {
        js()
        browserSync.reload()
    })
    watch("src/*.pug").on('change', function () {
        html()
        browserSync.reload()
    });
}

function html() {
    return src(path.src.html)
        .pipe(pug())
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(glob())
        .pipe(scss())
        .pipe(cleanCss())
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream());
}

function js() {
    return src(path.src.js)
        .pipe(babel())
        // .pipe(uglify())
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream());
}

exports.default = series(
    series(css, js, html),
    parallel(browser, watchFiles)
);