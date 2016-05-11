var config = require("../../shared/config");
var Observable = require("data/observable").Observable;
var validator = require("email-validator");
var firebase = require("nativescript-plugin-firebase");

function getKey() {
	var onChildEvent = function(result) {
        if (result.type === "ChildAdded") {            
            if(result.value.UID === config.uid){
            	config.key = result.key;
            	config.username = result.value.username;
            	return result;
            }
        }
    };
    return firebase.addChildEventListener(onChildEvent, "/V1/GUsers").then(
        function () {
          console.log("firebase.addChildEventListener added");
        },
        function (error) {
          console.log("firebase.addChildEventListener error: " + error);
        }
    )   
}

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
	    }).then(function (response) {
	            config.uid = response.uid;
	            getKey();
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
					'/V1/GUsers', 
					{
						'username': viewModel.get("username"),
						'UID': response.key
					}
				).then(
					function (result) {
						console.log("created key: "+result.key);
						config.uid = response.key;
						config.key = result.key;
						config.username = viewModel.get("username");
					}
				);
	            console.log(response);
	            return response;
	          }
	      );
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