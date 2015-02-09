
/* Setup general page controller */
MetronicApp.controller('InProgressContestsController', ['$rootScope', '$scope', 'settings', 'contestInfo', 'contestEntries', '$sce', '$http', function($rootScope, $scope, settings, contestInfo, contestEntries, $sce, $http) {
    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	Metronic.initAjax();

    	// set default layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    $scope.contestInfo = contestInfo;
    $scope.contestEntries = contestEntries;

    $scope.timeOffset = function(date, offset) {
        var d = new Date(date);

        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

        var nd = new Date(utc + (3600000*offset));

        var formattedTime = moment(nd).format("MM/DD/YYYY, h:mm A");
        return formattedTime;
    }

    $scope.contestInfo.start_time = $scope.timeOffset($scope.contestInfo.start_time, '+0');
    $scope.contestInfo.end_time = $scope.timeOffset($scope.contestInfo.end_time, '+0');


    // Start Countdown Timer
    // set the date we're counting down to
    var target_date = new Date($scope.contestInfo.start_time).getTime();
    var time_now = Date.now();

    // variables for time units
    var days, hours, minutes, seconds;
    // get tag element
    // var countdown = document.getElementById('countdown');

    // update the tag with id "countdown" every 1 second
    setInterval(function () {
        // find the amount of "seconds" between now and target
        var current_date = new Date().getTime();

        var seconds_left = (target_date - current_date) / 1000;

        // do some time calculations
        days = parseInt(seconds_left / 86400);
        seconds_left = seconds_left % 86400;

        hours = parseInt(seconds_left / 3600);
        seconds_left = seconds_left % 3600;

        minutes = parseInt(seconds_left / 60);
        seconds = parseInt(seconds_left % 60);

        // format countdown string + set tag value
        document.getElementById('countdown-inprogress').innerHTML = '<span class="days">' + days + ' <b>Days</b></span> <span class="hours">' + hours + ' <b>Hours</b></span> <span class="minutes">' + minutes + ' <b>Minutes</b></span> <span class="seconds">' + seconds + ' <b>Seconds</b></span>';

    }, 1000);
    // End Countdown Timer

    $scope.getSrc = function(track) {
        var SCUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + track.track.sc_id + '&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true';

        var trustedUrl = $sce.trustAsResourceUrl(SCUrl);

        return trustedUrl;
    };

    // pagination
    $scope.currentPage = 1;
    $scope.pageSize = 5;

    $scope.numberOfPages=function() {
        return Math.ceil($scope.contestEntries.count/$scope.pageSize);                
    };


    $scope.prevPage = function() {
        $scope.currentPage = $scope.currentPage - 1;

        $http({
            url: '/api/contests/' + $scope.contestInfo.id + "/entries/?page=" + $scope.currentPage,
            method: "GET",
            // data: JSON.stringify($scope.form),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            // console.log(data);
            $scope.contestEntries = data;
            console.log($scope.contestEntries);
            // console.log("SUCCESS");
        }).error(function (data, status, headers, config) {
            // $scope.status = status;
            // console.log(data);
            // console.log("FAILURE");
        });
    }

    $scope.nextPage = function() {
        $scope.currentPage = $scope.currentPage + 1;

        $http({
            url: '/api/contests/' + $scope.contestInfo.id + "/entries/?page=" + $scope.currentPage,
            method: "GET",
            // data: JSON.stringify($scope.form),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            // console.log(data);
            $scope.contestEntries = data;
            console.log($scope.contestEntries);
            // console.log("SUCCESS");
        }).error(function (data, status, headers, config) {
            // $scope.status = status;
            // console.log(data);
            // console.log("FAILURE");
        });
    }

    $scope.getRanks = function() {
        return ($scope.currentPage-1) * $scope.pageSize;
    }

}]);