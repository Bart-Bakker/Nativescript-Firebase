var Animation = require("ui/animation").Animation;
var Color = require("color").Color;
var dialogsModule = require("ui/dialogs");
var Observable = require("data/observable").Observable;
var platform = require("platform");
var frameModule = require("ui/frame");

var statusBarUtil = require("../../shared/utils/status-bar-util");
var formUtil = require("../../shared/utils/form-util");
var navigation = require("../../shared/navigation");
var UserViewModel = require("../../shared/view-models/user-view-model");

var pageData;
var user;
var page;
var username;
var email;
var password;
var submitButton;

exports.loaded = function(args) {
	page = args.object;

	user = new UserViewModel({
		username: "Steven",
		email: "steven@mytest.com",
		password: "steven"
	});

	pageData = new Observable({
		user: user,
		authenticating: false
	});
	
	page.bindingContext = pageData;
	statusBarUtil.configure();

	username = page.getViewById("username");
	email = page.getViewById("email");
	password = page.getViewById("password");
	submitButton = page.getViewById("submit-button");

	formUtil.hideKeyboardOnBlur(page, [username, email, password]);
	user.init();
};

exports.focusPassword = function() {
	password.focus();
};

exports.focusEmail = function() {
	email.focus();
};

exports.submit = function() {
	console.log("Hello, submit");
	if (!user.isValidEmail()) {
		dialogsModule.alert({
			message: "Enter a valid email address.",
			okButtonText: "OK"
		});
		return;
	}
	dialogsModule.confirm({
			title: "User Register!",
			message: "Do you really register?",
			okButtonText: "Yes",
			cancelButtonText: "No"
		}).then(function(result) {
			if (result) {
				disableForm();
	 			user.register()
		 		.then(function() {
		 			dialogsModule
						.alert("Your account was successfully created.")
						.then(function() {
							navigation.goToListPage();
						});
				}).catch(function() {
					dialogsModule
						.alert({
							message: "Unfortunately we were unable to create your account.",
							okButtonText: "OK"
						});
				}).then(enableForm());			
			}

		});
};

function disableForm() {

	username.isEnabled = false;
	email.isEnabled = false;
	password.isEnabled = false;
	submitButton.isEnabled = false;
	pageData.set("authenticating", true);
}

function enableForm() {

	username.isEnabled = true;
	email.isEnabled = true;
	password.isEnabled = true;
	submitButton.isEnabled = true;
	pageData.set("authenticating", false);
}
