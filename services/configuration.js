var nconf = require('nconf');
nconf
	.file({ file: 'appconfig.json' })
	.argv()
	.env()
	.defaults({
		'ODataApiEndpoint' : '',
		'StorageApiEndpoint': '',
		'Environment': 'dev'
	});

var configurationData = {};

configurationData.ODataApiEndpoint = nconf.get('ODataApiEndpoint');
configurationData.StorageApiEndpoint = nconf.get('StorageApiEndpoint');
configurationData.Environment = nconf.get('Environment');

module.exports = configurationData;