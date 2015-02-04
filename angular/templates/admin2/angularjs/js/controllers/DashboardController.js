'use strict';

MetronicApp.controller('DashboardController', function($rootScope, $scope, $http, $timeout, contests, myData, $window) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();
    });

    $scope.contests = contests;
    $scope.myData = myData;

	// Start Countdown Timer
	// set the date we're counting down to
	var target_date = new Date(contests.results[0].start_time).getTime();
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
	    if (hours >= 0) {
	    	document.getElementById('countdown').innerHTML = 'Next contest begins in <span class="days">' + days + ' <b>Days</b></span> <span class="hours">' + hours + ' <b>Hours</b></span> <span class="minutes">' + minutes + ' <b>Minutes</b></span> <span class="seconds">' + seconds + ' <b>Seconds</b></span>';
	    }
	    else {
	    	document.getElementById('countdown').innerHTML = 'Sorry, there are no upcoming contests at this time.';
	    }

	}, 1000);
	// End Countdown Timer

    $scope.filterContests = function(contestsList) {
        var openContests = [];
        var inProgressContests = [];
        var completedContests = [];

		var now = new Date();
		now = Date.parse(now);
		// var contestStartDate = Date.parse(contestsList[0].start_time);
		// var contestEndDate = Date.parse(contestsList[0].end_time);
		// console.log(now);
		// console.log(contestStartDate);
		// console.log(contestEndDate);
		// console.log(contestStartDate == contestEndDate);

		for (var contest in contestsList) {
			var start_time = Date.parse(contestsList[contest].start_time);
			var end_time = Date.parse(contestsList[contest].end_time);

			if (now < start_time) {
				$scope.convertDateTime(contest, contestsList);
				openContests.push(contestsList[contest]);
			}
			else if (now > start_time && now < end_time) {
				$scope.convertDateTime(contest, contestsList);
				inProgressContests.push(contestsList[contest]);
			}
			else if (now > end_time) {
				$scope.convertDateTime(contest, contestsList);
				completedContests.push(contestsList[contest]);
			}
		}

		$scope.openContests = openContests;
		$scope.inProgressContests = inProgressContests;
		$scope.completedContests = completedContests;
	};

	$scope.convertDateTime = function(contest, contestsList) {
		//convert datetimes
		contestsList[contest].start_time = new Date(contestsList[contest].start_time).toLocaleDateString();
		contestsList[contest].end_time = new Date(contestsList[contest].end_time).toLocaleDateString();
	};

	$scope.myCurrentContests = function(myEntryList) {
		if (myEntryList) {
			for (var i=0; i < myEntryList.length; i++) {
				$scope.convertDateTime(i, myEntryList);
			}
			return myEntryList;
		}
		
	}

	$scope.passModal = function(title, entry_fee, prize, description, start_time, end_time, status, contest_id) {
		$scope.title = title;
		$scope.entry_fee = entry_fee;
		$scope.prize = prize;
		$scope.description = description;
		$scope.start_time = start_time;
		$scope.end_time = end_time;
		$scope.status = status;
		$scope.contest_id = contest_id;
	}

	$scope.goToContest = function(status, contest_id) {
		if (status == 'open') {
			$window.location.href = '#/opencontests/' + contest_id;
		}
		else if (status == 'inProgress') {
			$window.location.href = '#/inprogresscontests/' + contest_id;
		}
		else if (status == 'completed') {
			$window.location.href = '#/completedcontests/' + contest_id;
		}
	}

	// My Contest Info
	$scope.myContestInfo = [];

   	var getContestInfo = function(i, contestNum){
    	$http({
            url: '/api/contests/' + contestNum,
            method: "GET",
            // data: JSON.stringify($scope.form),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
    	  	// console.log(data);
    	  	$scope.myContestInfo.push(data);
    	  	$scope.convertDateTime(i, $scope.myContestInfo);
    	  	// console.log("SUCCESS");
        }).error(function (data, status, headers, config) {
            // $scope.status = status;
    	  	// console.log(data);
    	  	// console.log("FAILURE");
        });
	};

	if (myData.my_entries) {
		for (var i=0; i < myData.my_entries.length; i++) {
			var contestNum = myData.my_entries[i].contest;
			getContestInfo(i, contestNum);
		}
	}
	// End My Contest Info

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
});