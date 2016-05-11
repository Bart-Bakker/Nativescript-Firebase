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
var IdeaListViewModel = require("../../shared/view-models/idea-list-view-model");

var page;
var topic_id;
var topic_title;
var topic_author;

var ideaList = new IdeaListViewModel([{
	title: "",
	author: ""
}]);
var pageData = new Observable({
	ideaList: ideaList,
	newIdea: ""
});

exports.loaded = function(args) {
	page = args.object;

    if (page.ios) {
        var listView = page.getViewById("ideaList");
        swipeDelete.enable(listView, function(index) {
            ideaList.delete(index, topic_id);
        });
    }

	page.bindingContext = pageData;
	topic_id = page.navigationContext.topicKey;
	topic_title = page.navigationContext.topicTitle;
	topic_author = page.navigationContext.topicAuthor;

	var spinner = page.getViewById('spinner');
	// statusBarUtil.configure();

	console.log("uid: "+config.uid);
	console.log("key: "+config.key);

	spinner.busy = true;
	ideaList.empty();
	ideaList.load(topic_id).then(function() {
		spinner.busy = false;
    });
};

exports.onBackToTopic = function () {
	console.log("Navigation BackToTopic Button Tapped!");
	// navigation.goBack();
};

exports.onIdeaAddBtnTap = function () {
	console.log("Navigation Add Button Tapped!");

    // Check for empty submissions
    if (pageData.get("newIdea").trim() !== "") {
        // Dismiss the keyboard
        page.getViewById("newIdea").dismissSoftInput();
        ideaList.add(pageData.get("newIdea"), topic_id)
            .catch(function() {
                dialogsModule.alert({
                    message: "An error occurred while adding an item to your list.",
                    okButtonText: "OK"
                });
            });
        // Empty the input field
        pageData.set("newIdea", "");
    } else {
        dialogsModule.alert({
            message: "Enter a new Idea item",
            okButtonText: "OK"
        });
    }
};

// exports.onSelectTopic = function(args) {
// 	var selectedTopic = args.view.bindingContext;
// 	console.log("TopicList Tapped! "+selectedTopic.title+","+selectedTopic.author);

// };