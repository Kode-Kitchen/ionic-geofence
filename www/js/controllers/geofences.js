angular.module('ionic-geofence').controller('GeofencesCtrl', function (
    $scope,
    $ionicActionSheet,
    $timeout,
    $log,
    $state,
    geolocationService,
    geofenceService,
    $ionicLoading
) {
    $ionicLoading.show({
        template: 'Getting geofences from device...',
        duration: 5000
    });

    $scope.geofences = [];

    geofenceService.getAll().then(function (geofences) {
        $ionicLoading.hide();
        $scope.geofences = geofences;
    }, function (reason) {
        $ionicLoading.hide();
        $log.log('An Error has occured', reason);
    });

    $scope.createNew = function () {
        $log.log('Obtaining current location...');
        $ionicLoading.show({
            template: 'Obtaining current location...'
        });
        geolocationService.getCurrentPosition()
            .then(function (position) {
                $log.log('Current location found');
                $ionicLoading.hide();

                geofenceService.createdGeofenceDraft = {
                    id: UUIDjs.create().toString(),
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    radius: 1000,
                    transitionType: TransitionType.ENTER,
                    notification: {
                        id: geofenceService.getNextNotificationId(),
                        title: 'Ionic geofence example',
                        text: '',
                        icon: 'res://ic_menu_mylocation',
                        openAppOnClick: true
                    }
                };
                $state.go('geofence', {
                    geofenceId: geofenceService.createdGeofenceDraft.id
                });
            }, function (reason) {
                $log.log('Cannot obtain current location', reason);
                $ionicLoading.show({
                    template: 'Cannot obtain current location',
                    duration: 1500
                });
            });
    };

    $scope.editGeofence = function (geofence) {
        $state.go('geofence', {
            geofenceId: geofence.id
        });
    };

    $scope.removeGeofence = function (geofence) {
        geofenceService.remove(geofence);
    };

    $scope.more = function () {
        // Show the action sheet
        $ionicActionSheet.show({
            titleText: 'More options',
            buttons: [
                { text: '<i class="icon ion-checkmark-circled"></i> Test application' }
            ],
            destructiveText: '<i class="icon ion-trash-b"></i> Delete all geofences',
            cancelText: '<i class="icon ion-android-cancel"></i> Cancel',
            destructiveButtonClicked: function () {
                geofenceService.removeAll();
                return true;
            },
            buttonClicked: function() {
                window.location.href = 'cdvtests/index.html';
            }
        });
    };
});
