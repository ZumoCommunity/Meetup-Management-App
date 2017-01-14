function addGridBehavior (vm, OSource, OOrderBy) {
    var viewModel = vm;

    viewModel.grid = {};

    viewModel.grid.gridArray = ko.observableArray([]);
    viewModel.grid.isGridLoaded = ko.observable(true);
    viewModel.grid.pageSize = 3;
    viewModel.grid.currentPage = ko.observable(1);
    viewModel.grid.totalPages = ko.observable(0);
    viewModel.grid.totalPagesArray = ko.observableArray([]);
    viewModel.grid.OSource = OSource;
    viewModel.grid.OOrderBy = OOrderBy;
    
    
    viewModel.grid.getGridPage = function(pageNumber){
        viewModel.grid.isGridLoaded(false);

        viewModel.grid.currentPage(pageNumber);

        var itemsToSkip = (viewModel.grid.currentPage() - 1) * viewModel.grid.pageSize;

        var table = o(viewModel.grid.OSource);

        table.top(viewModel.grid.pageSize).skip(itemsToSkip).orderBy(viewModel.grid.OOrderBy).inlineCount('true').get()
            .then(function(response) {
                viewModel.grid.gridArray.removeAll();

                var totalPages = Math.ceil(response.inlinecount / viewModel.grid.pageSize) || 1;

                viewModel.grid.totalPages(totalPages);

                viewModel.grid.populateTotalPagesArray(viewModel.grid.totalPages());

                var entities = response.data;
                entities.forEach(function(location){
                    viewModel.grid.gridArray.push(location);
                });

                viewModel.grid.isGridLoaded(true);
            }, function (error) {
                console.log(error);
            });
    };

    viewModel.grid.refreshGridPage = function() {
        viewModel.grid.getGridPage(viewModel.grid.currentPage());
    };

    viewModel.grid.populateTotalPagesArray = function(totalPages) {
        viewModel.grid.totalPagesArray.removeAll();

        var i = 1;
        for (i; i <= totalPages; i++) {
            viewModel.grid.totalPagesArray.push(i);
        }
    };

    viewModel.grid.navigateToItemPage = function (page) {
        viewModel.grid.getGridPage(page);
    };

    viewModel.grid.pageIsActive = function (pageLink) {
        if (pageLink == viewModel.grid.currentPage()) {
            return true;
        }
            else {
                return false;
            }
    };

    viewModel.grid.deleteItem = function (item) {
        if (!confirm('Delete item ' + item[viewModel.grid.OOrderBy] + '?')) {
            return;
        }

        viewModel.grid.isGridLoaded(false);
        var table = o(viewModel.grid.OSource);
        table.find(item.Id).remove().save()
            .then(function() {
                viewModel.grid.getGridPage(viewModel.grid.currentPage());
            });
    };

    return viewModel;
}
