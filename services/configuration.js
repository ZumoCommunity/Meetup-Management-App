var nconf = require('nconf');
nconf
	.file({ file: 'appconfig.json' })
	.argv()
	.env()
	.defaults({
		'ODataApiEndpoint' : 'http://meetup-api-odata-p6g7a5qcxvlna.azurewebsites.net/odata/v1',
		'ODataApiMetadataEndpoint': 'http://meetup-api-odata-p6g7a5qcxvlna.azurewebsites.net/swagger/docs/v1',
		'StorageApiEndpoint': '',
		'Environment': 'dev'
	});

var configurationData = {};

configurationData.ODataApiEndpoint = nconf.get('ODataApiEndpoint');
configurationData.ODataApiMetadataEndpoint = nconf.get('ODataApiMetadataEndpoint');
configurationData.StorageApiEndpoint = nconf.get('StorageApiEndpoint');
configurationData.Environment = nconf.get('Environment');

module.exports = configurationData;