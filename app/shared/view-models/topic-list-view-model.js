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

function removeTopic(arg) {
    var onChildEvent = function(result) {
        if (result.type === "ChildAdded") {            
            if(result.value.GTopicID === arg){
                firebase.remove("/V1/GUsers/"+config.key+"/UTopics/"+result.key+"");
            }
        }
    };
    return firebase.addChildEventListener(onChildEvent, "/V1/GUsers/"+config.key+"/UTopics").then(
        function () {
          console.log("firebase.addChildEventListener added");
        },
        function (error) {
          console.log("firebase.addChildEventListener error: " + error);
        }
    )   
}

function TopicListViewModel(items) {
	var viewModel = new ObservableArray(items);
    
	viewModel.indexOf = indexOf;

    viewModel.load = function () {
        
        var onChildEvent = function(result) {
        var matches = [];

            if (result.type === "ChildAdded") {            
                viewModel.push({
                    title: result.value.Topic.Title,
                    author: result.value.Topic.author,
                    id: result.key
                });
                console.log("Retrieve Data: "+ JSON.stringify(result.value.Topic));
            }

            else if (result.type === "ChildRemoved") {
                matches.push(result);
                matches.forEach(function(match) {
                    var index = viewModel.indexOf(match);
                    viewModel.splice(index, 1);                                     
                });
            }
        };
        
        return firebase.addChildEventListener(onChildEvent, "/V1/GTopics").then(
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

    viewModel.add = function(Title) {
        return firebase.push(
            '/V1/GTopics',
            {
                'Topic': {
                   'Title': Title,
                   'author': config.username
               }
            }
        ).then(
            function (result) {
                firebase.push(
                    '/V1/GUsers/'+config.key+'/UTopics/',
                    {
                        'GTopicID':result.key
                    }
                );
            }
        );
    };

    viewModel.delete = function(index) {
        var id = viewModel.getItem(index).id;
        return firebase.remove("/V1/GTopics/"+id+"")
            .then(function(){
                console.log(id);
                removeTopic(id);
        });
    };

	return viewModel;
}

module.exports = TopicListViewModel;