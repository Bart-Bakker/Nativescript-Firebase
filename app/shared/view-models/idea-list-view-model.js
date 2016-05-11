var config = require("../../shared/config");
var firebase = require("nativescript-plugin-firebase");
var ObservableArray = require("data/observable-array").ObservableArray;

function indexOf(item) {
    var match = -1;
    this.forEach(function(loopItem, index) {
        if (loopItem.id === item.key) {
            match = index;
        }
    });
    return match;
}

function removeIdeafromMember(arg, topicKey) {
    var onChildEvent = function(result) {
        if (result.type === "ChildAdded") {            
            if(result.value.Ideas.IdeaId === arg){
                firebase.remove("/V1/GTopics/"+topicKey+"/Members/"+result.key+"");
            }
        }
    };
    return firebase.addChildEventListener(onChildEvent, "/V1/GTopics/"+topicKey+"/Members").then(
        function () {
          console.log("firebase.addChildEventListener added");
        },
        function (error) {
          console.log("firebase.addChildEventListener error: " + error);
        }
    )   
}

function IdeaListViewModel(items) {
	var viewModel = new ObservableArray(items);
    
	viewModel.indexOf = indexOf;

    viewModel.load = function (topicKey) {
        
        var onChildEvent = function(result) {
        var matches = [];

            if (result.type === "ChildAdded") {            
                viewModel.push({
                    title: result.value.Idea.Title,
                    author: result.value.Idea.author,
                    id: result.key
                });
                console.log("Retrieve Data: "+ JSON.stringify(result.value.Idea));
            }

            else if (result.type === "ChildRemoved") {
                matches.push(result);
                matches.forEach(function(match) {
                    var index = viewModel.indexOf(match);
                    viewModel.splice(index, 1);                                     
                });
            }
        };
        
        return firebase.addChildEventListener(onChildEvent, "/V1/GTopics/"+topicKey+"/Ideas").then(
            function () {
              console.log("firebase.addChildEventListener added");
            },
            function (error) {
              console.log("firebase.addChildEventListener error: " + error);
            }
        )   
      };

    viewModel.empty = function() {
        while (viewModel.length) {
            viewModel.pop();
        }
    };

    viewModel.add = function(Title, topicKey) {
        return firebase.push(
            '/V1/GTopics/'+topicKey+'/Ideas',
            {
                'Idea': {
                   'Title': Title,
                   'author': config.username
               }
            }
        ).then(
            function (result) {
                firebase.push(
                    '/V1/GTopics/'+topicKey+'/Members',
                    {
                        'GUserId':config.key,
                        'Ideas': {'IdeaId': result.key}
                    }
                );
            }
        );
    };

    viewModel.delete = function(index, topicKey) {
        var id = viewModel.getItem(index).id;
        return firebase.remove("/V1/GTopics/"+topicKey+"/Ideas/"+id+"")
            .then(function(){
                console.log(id);
                removeIdeafromMember(id, topicKey);
        });
    };

	return viewModel;
}

module.exports = IdeaListViewModel;