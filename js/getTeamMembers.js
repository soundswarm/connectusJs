var members = 'https://api.github.com/teams/1178417/members?access_token=1ce7e4e705d292beda12fb0a2ef4c39ef780c2e7';
var getMembers = function(url) {
	return new Promise(function(resolve, reject){
		$.ajax({
			url: members,
			data: {'per_page': 100},
			success: function(members) {
				var array = _.pluck(members, 'login');
				console.log(array);
				resolve(members);
			}
		});
	});
};

getMembers(members)

