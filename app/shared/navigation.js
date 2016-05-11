var config = require("./config");
var frameModule = require("ui/frame");

module.exports = {
	goToLoginPage: function() {
		frameModule.topmost().navigate("views/login/login");
	},
	goToRegisterPage: function() {
		frameModule.topmost().navigate("views/register/register");
	},
	goToPasswordPage: function() {
		frameModule.topmost().navigate("views/password/password");
	},
	goToListPage: function() {
		frameModule.topmost().navigate({
			moduleName: "views/list/list",
			clearHistory: !!frameModule.topmost().ios
		});
	},
	goToideaPage: function(args) {
		var key=args.id;
		var title=args.title;
		var author=args.author;
		frameModule.topmost().navigate({
			moduleName: "views/ideaList/ideaList",
			context: {
				topicKey: key,
				topicTitle: title,
				topicAuthor: author
			}
		});
	},
	signOut: function() {
		// config.invalidateToken();
		frameModule.topmost().navigate({
			moduleName: "views/login/login",
			animated: false,
			clearHistory: !!frameModule.topmost().ios
		});
	},
	startingPage: function() {
		return config.token ? "views/list/list" : "views/login/login";
	}
};
