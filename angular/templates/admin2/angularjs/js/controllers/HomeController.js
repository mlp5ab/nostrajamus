'use strict';

MetronicApp.controller('HomeController', function($rootScope, $scope, $http, $timeout, contests, $window, authState, globalPlayerService, homeService) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();
    });

    if (!authState.user && $rootScope.firstTime) {
    	$('#tutorialModal').modal('show');
    	$rootScope.firstTime = false;
    }

    $rootScope.homeService = homeService;
    $scope.contests = contests;
    $scope.authState = authState;

    $scope.filterContests = function(contestsList) {
    	contestsList.reverse();

        var openContests = [];
        var inProgressContests = [];
        var completedContests = [];

		var now = new Date();
		// now = Date.parse(now);

		for (var contest in contestsList) {
			var start_time = new Date(contestsList[contest].start_time).addHours(5);
			var end_time = new Date(contestsList[contest].end_time).addHours(5);

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
		$scope.inProgressContests = inProgressContests.reverse();
		$scope.completedContests = completedContests.reverse();
	};

	$scope.insertCommas = function(s) {
        s = s.toString();
        // get stuff before the dot
        var d = s.indexOf('.');
        var s2 = d === -1 ? s : s.slice(0, d);
        // insert commas every 3 digits from the right
        for (var i = s2.length - 3; i > 0; i -= 3)
          s2 = s2.slice(0, i) + ',' + s2.slice(i);
        // append fractional part
        if (d !== -1)
          s2 += s.slice(d);
        return s2;
    };

	Date.prototype.addHours = function(h){
	    this.setHours(this.getHours()+h);
	    return this;
	};

    $scope.timeOffset = function(date, offset) {
    	var d = new Date(date);

    	var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    	var nd = new Date(utc + (3600000*offset));

    	var formattedTime = moment(nd).format("MM/DD/YYYY, h:mm A");
    	return formattedTime;
    };

	$scope.convertDateTime = function(contest, contestsList) {
		// convert datetimes
		contestsList[contest].start_time = $scope.timeOffset(contestsList[contest].start_time, '+0');
		contestsList[contest].end_time = $scope.timeOffset(contestsList[contest].end_time, '+0');
	};

	// $scope.myCurrentContests = function(myEntryList) {
	// 	if (myEntryList) {
	// 		for (var i=0; i < myEntryList.length; i++) {
	// 			$scope.convertDateTime(i, myEntryList);
	// 		}
	// 		return myEntryList;
	// 	}
	// };

	$scope.passModal = function(title, entry_fee, prize, description, start_time, end_time, status, contest_id, isEnabled) {
		$scope.title = title;
		$scope.entry_fee = entry_fee;
		$scope.enabled = isEnabled;

		$scope.prize = prize;
		var prizes = prize.split(",");
		$scope.prizes = prizes;
		var prizeCategories = [];
		var prizeValues = [];

		for (var i in prizes) {
			var eachPrize = prizes[i].split(":");
			prizeCategories.push(eachPrize[0].trim());
			if (eachPrize[1]) {
				prizeValues.push(eachPrize[1].trim());
			}
		}

		$scope.prizeCategories = prizeCategories;
		$scope.prizeValues = prizeValues;

		$scope.description = description;
		$scope.start_time = start_time;
		$scope.end_time = end_time;
		$scope.status = status;
		$scope.contest_id = contest_id;
	};

	$scope.setPanelPlay = function(contest) {
		if ($rootScope.homeService.home.data.panelId != contest.id) {
			$rootScope.homeService.home.data.is_Live = contest.is_live;
			$rootScope.homeService.home.data.panelId = contest.id;
			$rootScope.homeService.home.data.panelContestName = contest.title;
			homeService.home.data.panelId = contest.id;
			homeService.home.data.panelContestName = contest.title;
			homeService.home.data.is_Live = contest.is_live;
			// $rootScope.panelContestPic = contest.contest_picture;

			$http.get('/api/contests/' + homeService.home.data.panelId + "/entries").then(function(response) {
				$rootScope.contestInstance = response.data;
				// console.log($scope.contestInstance.results[0].track);
				$scope.playNewTrack($rootScope.contestInstance.results[0].track, 0, $rootScope.contestInstance.results);
		    })
		}
		else {
			globalPlayerService.player.playPause();
		}
	};

	$scope.panelPause = function() {
		globalPlayerService.player.playPause();
	};

	// $scope.setPanelBack = function() {
	// 	$rootScope.panelId = 0;
	// };

	/* BEGIN PLAYER LOGIC */

    $scope.player = globalPlayerService.player;

    $scope.playNewTrack = function(track, index, contestEntries) {
    	// globalPlayerService.player.data.currentTrackData = track;
        globalPlayerService.player.resetTrack(track);
        var tunes = contestEntries.slice(index+1).map(function(elem) {
            return elem.track;
        });
        globalPlayerService.player.data.trackQueue = tunes;
        // // Set the next url and such
        // var nextUrl = '/api/contests/' + $scope.contestInfo.id + '/entries/?page=' + ($scope.currentPage + 1);
        // globalPlayerService.player.data.nextPageUrl = nextUrl;
    };

    $scope.getCroppedImageUrl = function(url) {
        var cropped = url.replace("-large", "-t300x300");
        return cropped;
    };

    $scope.$on('player.trackProgress.update', function (newState) {
       	// $scope.trackProgress = globalPlayerService.player.data.trackProgress;
        $scope.$apply(function() {
            $scope.player.data = globalPlayerService.player.data;
        });
    });

    /* END PLAYER LOGIC */

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
});