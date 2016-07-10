var app = angular.module('sw-demo', []);

app.factory('notify', function () {
    return {
        success: function (text) { toastr.success(text) },
        error: function (text) { toastr.error(text) }
    };
});

app.factory('customerService', function ($http) {
    return {
        list: function () { return $http.get('./customers'); },
        add: function (customer) { return $http.post('./add', customer); },
        remove: function (customer) { return $http.post('./remove', { id: customer.id }); }
    };
});

app.controller('customersCtrl', function ($scope, customerService, notify) {
    $scope.confirmDelete = function (customer) {
        $scope.toBeDeleted = customer;
    };

    $scope.isPendingDelete = function (customer) {
        return $scope.toBeDeleted == customer;
    };

    $scope.doDelete = function (customer) {
        $scope.toBeDeleted = null;
        customer.isDeleting = true;
        customerService.remove(customer).then(function (res) {
            if (res.data && res.data.success) {
                notify.success(customer.name + ' was removed.');
                $scope.refreshList();
            }
        }, function (res) {
            customer.isDeleting = false;
            notify.error('Could not remove customer!');
        });
    };

    $scope.resetForm = function () {
        if ($scope.isSubmitting)
            return;

        $scope.formData = {};
        $scope.form.$setPristine();
    };

    $scope.submitForm = function () {
        if ($scope.isSubmitting)
            return;

        $scope.form.$setDirty();
        if ($scope.form.$invalid)
            return;

        $scope.isSubmitting = true;
        var customer = $scope.formData;
        customerService.add(customer).then(function (res) {
            $scope.isSubmitting = false;
            if (res.data && res.data.success) {
                notify.success(customer.name + ' was added.');
                $scope.resetForm();
                $scope.refreshList();
            }
        }, function (res) {
            notify.error('Could not add new customer!');
            $scope.isSubmitting = false;
        });
    };

    $scope.refreshList = function () {
        customerService.list().then(function (res) {
            $scope.toBeDeleted = null;
            $scope.customers = res.data;
        }, function (res) {
            notify.error('Could not refresh customers!');
        });
    };

    $scope.formData = {};
    $scope.refreshList();
});