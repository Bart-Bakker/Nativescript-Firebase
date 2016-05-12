var dialogsModule = require("ui/dialogs");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var viewModule = require("ui/core/view");
var utilsModule = require("utils/utils");
var frameModule = require("ui/frame");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var config = require("../../shared/config");

var statusBarUtil = require("../../shared/utils/status-bar-util");
var navigation = require("../../shared/navigation");
var TopicListViewModel = require("../../shared/view-models/topic-list-view-model");

var page;

var topicList = new TopicListViewModel([{
	title: "",
	author: ""
}]);
var pageData = new Observable({
	topicList: topicList,
	newTopic: ""
});

exports.loaded = function(args) {
	page = args.object;

    if (page.ios) {
        var listView = viewModule.getViewById(page, "topicList");
        swipeDelete.enable(listView, function(index) {
            console.log(topicList.getItem(index).id);
            if (topicList.getItem(index).author==config.username) {
                topicList.delete(index);
            } else {
                dialogsModule.alert({
                    message: "You can't delete",
                    okButtonText: "OK"
                });
            }
            
        });
        var navigationBar = frameModule.topmost().ios.controller.navigationBar;
        navigationBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(0.011, 0.278, 0.576, 1);
        navigationBar.titleTextAttributes = new NSDictionary([UIColor.whiteColor()], [NSForegroundColorAttributeName]);
        navigationBar.barStyle = 1;
        navigationBar.tintColor = UIColor.whiteColor();

        // frameModule.topmost().ios.navBarVisibility = "always";
    }

	page.bindingContext = pageData;
	statusBarUtil.configure();

	console.log("uid: "+config.uid);
	console.log("key: "+config.key);

	topicList.empty();
	pageData.set("isLoading", true);
	topicList.load().then(function() {
        pageData.set("isLoading", false);
    });
};

exports.onNavBtnTap = function () {
	console.log("Navigation Logout Button Tapped!");
	navigation.signOut();
};

exports.onTopicAddBtnTap = function () {
	console.log("Navigation Add Button Tapped!");

    // Check for empty submissions
    if (pageData.get("newTopic").trim() !== "") {
        // Dismiss the keyboard
        page.getViewById("newTopic").dismissSoftInput();
        topicList.add(pageData.get("newTopic"))
            .catch(function() {
                dialogsModule.alert({
                    message: "An error occurred while adding an item to your list.",
                    okButtonText: "OK"
                });
            });
        // Empty the input field
        pageData.set("newTopic", "");
    } else {
        dialogsModule.alert({
            message: "Enter a new Topic item",
            okButtonText: "OK"
        });
    }
};

exports.onSelectTopic = function(args) {
	var selectedTopic = args.view.bindingContext;
	console.log("TopicList Tapped! "+selectedTopic.title+","+selectedTopic.author);
    navigation.goToideaPage(selectedTopic);
};