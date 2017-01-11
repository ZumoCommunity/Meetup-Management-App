var express = require('express');
var router = express.Router();
var minify = require('html-minifier').minify;

var configurationData = require('../services/configuration');

var pageModel = {
	partials: {
		header: '_layout/header',
		footer: '_layout/footer',
		layout: '_layout/base'
	},
	configuration: configurationData
};
var minifyConfig = (function() {
	var isProduction = configurationData.Environment == 'prod';
	return {
		removeComments: isProduction,
		collapseWhitespace: isProduction,
		minifyJS: isProduction,
		minifyCSS: isProduction,
		minifyURLs: isProduction
	}
})();

var routes = [
	'meetups/list',
	'meetups/entity',
	'locations/list',
	'locations/entity',
	'partners/list',
	'partners/entity',
	'registrations/list',
	'registrations/entity'
];

function addRoute(url, view) {
	router.get(url, function(req, res, next) {
		res.render(view, pageModel, function(err, html) {
			res.send(minify(html, minifyConfig));
		});
	});
}

addRoute('', 'index');

routes.forEach(function(route){
	var url = '/' + route;
	var view = 'pages/' + route;

	addRoute(url, view);
});

module.exports = router;
