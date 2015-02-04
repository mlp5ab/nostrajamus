'use strict';

MetronicApp.controller('UserProfileController', ["$rootScope", "$scope", "$http", "$timeout", function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        Metronic.initAjax(); // initialize core components
        Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu 
    });

    $http.get('/api/users/me').then(function(response) {
        $scope.myInfo = response.data;
        // console.log($scope.myInfo);
        return response.data;
    });

    $scope.getProfilePicture = function(pic) {
    	var src = '';
        
    	if (pic == null) {
            var randomPic = Math.random()*100;
            if (randomPic < 100/3) {
                return src = '/assets/admin/pages/media/profile/profile-landscape.jpg';
            }
            else if (randomPic >= 100/3 && randomPic <= 200/3) {
                return src = '/assets/admin/pages/media/profile/profile-swan.jpg';
            }
            else if (randomPic > 200/3) {
                return src = '/assets/admin/pages/media/profile/profile-car.jpg'; 
            }
    	}
    	else {
    		return pic;
    	}
    };

    $scope.getNumContests = function(entriesList) {
    	if (entriesList == null) {
    		return 0;
    	} else {
    		return Object.keys(entriesList).length;
    	}
    };

    $scope.getSrc = function(track) {
    	var SCUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + track.track.sc_id + '&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true';

    	var trustedUrl = $sce.trustAsResourceUrl(SCUrl);

    	return trustedUrl;
    }

    $scope.getPlayIncrease = function(track) {
		// get play count increase
		var currPlayCount = track.current_playback_count;
		var initPlayCount = track.initial_playback_count;

		var playIncrease = ((currPlayCount - initPlayCount) / (initPlayCount)) * 100;

		return playIncrease;
    };

    $scope.getFollowIncrease = function(track) {
		// get follower count increase
		var currFollowCount = track.current_follower_count;
		var initFollowCount = track.initial_follower_count;
		
		var followIncrease = ((currFollowCount - initFollowCount) / (initFollowCount)) * 100;

		return followIncrease;
    };

    // $scope.saveChanges = function() {
    //     $http.put().success(successCallback);
    // }

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
}]); 
