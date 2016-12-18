var nconf = require('nconf');
nconf
	.file({ file: 'appconfig.json' })
	.argv()
	.env()
	.defaults({
		'ODataEndpoint' : '',
		'Environment': 'dev'
	});

var configurationData = {};

configurationData.ODataEndpoint = nconf.get('ODataEndpoint');
configurationData.Environment = nconf.get('Environment');

module.exports = configurationData;