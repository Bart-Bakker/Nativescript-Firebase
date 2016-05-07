var config = require("../../shared/config");
var Observable = require("data/observable").Observable;
var validator = require("email-validator");
var firebase = require("nativescript-plugin-firebase");

function User(info) {
	info = info || {};

	// You can add properties to observables on creation
	var viewModel = new Observable({
		username: info.username || "",
		email: info.email || "",
		password: info.password || ""
	});

	viewModel.init = function(){
  		firebase.init({
      		url: config.apiUrl
  		}).then(
    		function (instance) {
      			console.log("firebase.init done");
    		},
    		function (error) {
      			console.log("firebase.init error: " + error);
    		}
  		);
	};

	viewModel.login = function() {
	    return firebase.login({
	        type: firebase.LoginType.PASSWORD,
	        email: viewModel.get("email"),
	        password: viewModel.get("password")
	      }).then(
	        function (response) {
	            config.uid = response.uid
	            return response;
	        });
	};

	viewModel.register = function() {
	    return firebase.createUser({
	        email: viewModel.get("email"),
	        password: viewModel.get("password")
	      }).then(
	          function (response) {
	          	firebase.push (
					'/GUsers', 
					{
						'username': viewModel.get("username"),
						'UTopics': {
							'GTopicID': ''
						}
					}
				).then(
					function (result) {
					console.log("created key: "+result.key);
					}
				);
	            console.log(response);
	            return response;
	          }
	      );
	};


	// viewModel.login = function() {
	// 	return fetch(config.apiUrl + "oauth/token", {
	// 		method: "POST",
	// 		body: JSON.stringify({
	// 			username: viewModel.get("email"),
	// 			password: viewModel.get("password"),
	// 			grant_type: "password"
	// 		}),
	// 		headers: {
	// 			"Content-Type": "application/json"
	// 		}
	// 	})
	// 	.then(handleErrors)
	// 	.then(function(response) {
	// 		return response.json();
	// 	}).then(function(data) {
	// 		config.token = data.Result.access_token;
	// 	});
	// };

	// viewModel.register = function() {
	// 	return fetch(config.apiUrl + "Users", {
	// 		method: "POST",
	// 		body: JSON.stringify({
	// 			Username: viewModel.get("email"),
	// 			Email: viewModel.get("email"),
	// 			Password: viewModel.get("password")
	// 		}),
	// 		headers: {
	// 			"Content-Type": "application/json"
	// 		}
	// 	})
	// 	.then(handleErrors);
	// };

	viewModel.resetPassword = function() {
		return fetch(config.apiUrl + "Users/resetpassword", {
			method: "POST",
			body: JSON.stringify({
				Email: viewModel.get("email"),
			}),
			headers: {
				"Content-Type": "application/json"
			}
		})
		.then(handleErrors);
	};

	viewModel.isValidEmail = function() {
		var email = this.get("email");
		return validator.validate(email);
	};

	return viewModel;
}

function handleErrors(response) {
	if (!response.ok) {
		console.log(JSON.stringify(response));
		throw Error(response.statusText);
	}
	return response;
}

module.exports = User;