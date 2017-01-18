/**
 */

function addEntityBehavior(vm, OSource, ODefinition) {
    var viewModel = vm;

    viewModel.entity = {};

    viewModel.entity.model = {};

    viewModel.entity.isEditMode = false;
    viewModel.entity.OSource = OSource;
    viewModel.entity.RedirectPathPrefix = OSource;
    viewModel.entity.ODefinition = ODefinition;

    viewModel.entity.getMetadataFromApi = function() {
        function isPropertyTypeValid(propertyType) {
            switch (propertyType) {
                case 'array':
                    return false;
            }
            return true;
        }

        var metadataUrl = window.configuration.ODataApiMetadataEndpoint;

        var promise = new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();

            request.onreadystatechange = function() {
                if (request.readyState == 4 && request.status == 200) {
                    var json = JSON.parse(request.responseText);

                    var definition = json.definitions[viewModel.entity.ODefinition];

                    var properties = definition.properties;

                    var metadata = {
                        properties: {},
                        required: definition.required
                    };

                    var names = Object.keys(definition.properties);

                    for(var i = 0; i < names.length; i++) {
                        var name = names[i];
                        var property = properties[name];

                        if (isPropertyTypeValid(property.type)) {
                            metadata.properties[name] = property;
                        }
                    }

                    resolve(metadata)
                }
            };

            request.open("GET", metadataUrl, true);
            request.send();
        });

        return promise;
    };

    viewModel.entity.getFromApi = function() {
        var uri = new URI(window.location.search);
        var query = uri.query(true);

        var currentItemId = query.id;
        viewModel.entity.isEditMode = !!currentItemId;

        var promises = [];
        promises.push(viewModel.entity.getMetadataFromApi());

        if (!viewModel.entity.isEditMode) {
            promises.push(Promise.resolve({}));
        } else {
            var promise = new Promise(function (resolve, reject) {
                var table = o(viewModel.entity.OSource);
                table.find(currentItemId).get()
                    .then(function(response) {
                        var entity = response.data;
                        resolve(entity);
                    })
            });
            promises.push(promise);
        }

        return Promise.all(promises);
    };

    viewModel.entity.saveToApi = function(entity) {
        var table = o(viewModel.entity.OSource);

        if (viewModel.entity.isEditMode) {
            table.find(entity.Id).patch(entity).save()
                .then(function(){
                    viewModel.entity.redirectToList();
                });
        } else {
            table.post(entity).save()
                .then(function(){
                    viewModel.entity.redirectToList();
                });
        }
    };

    viewModel.entity.getFromForm = function() {
        var entity = {};
        var properties = Object.keys(viewModel.entity.model);

        for (var i = 0; i < properties.length; i++) {
            var propertyName = properties[i];

            entity[propertyName] = viewModel.entity.model[propertyName]();
        }
        return entity;
    };

    viewModel.entity.setToForm = function (metadata, entity) {
        var properties = Object.keys(metadata.properties);

        for (var i = 0; i < properties.length; i++) {
            var propertyName = properties[i];

            viewModel.entity.model[propertyName] = ko.observable(entity[propertyName]);
        }
    };

    viewModel.entity.loadItem = function() {
        return viewModel.entity.getFromApi()
            .then(function(results) {
                var metadata = results[0];
                var entity = results[1];

                viewModel.entity.setToForm(metadata, entity);
                return Promise.resolve();
            });
    };

    viewModel.entity.saveItem = function() {
        var entity = viewModel.entity.getFromForm();
        viewModel.entity.saveToApi(entity);
    };


    viewModel.entity.redirectToList = function() {
        window.location.href = '/' + viewModel.entity.RedirectPathPrefix + '/list';
    };

    return viewModel;
}