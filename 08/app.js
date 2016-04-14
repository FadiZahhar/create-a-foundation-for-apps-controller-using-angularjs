(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
    .controller('TasksController', TasksController)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

  // Add custom controller code here
  function TasksController($scope, $controller) {

    // Extend F4A default controller to ensure all functionality is preserved
    // For more info see http://foundation.zurb.com/apps/docs/#!/angular
    angular.extend(this, $controller('DefaultController', {$scope: $scope}));

    // uncomment these when you want to remove all locally stored tasks and tags
    // localStorage.removeItem("saved_tasks");
    // localStorage.removeItem("all_tags");

    // Add the "tasks" array to $scope
    $scope.tasks = JSON.parse(localStorage.getItem("saved_tasks"));
    if (typeof $scope.tasks === 'undefined' || $scope.tasks === null){
      $scope.tasks = [];
    }

    // Add the "allTags" array to $scope
    // this is used to keep track of all the tags used in the task manager,
    // across all the tasks
    $scope.allTags = JSON.parse(localStorage.getItem("all_tags"));
    if (typeof $scope.allTags === 'undefined' || $scope.allTags === null){
      $scope.allTags = [];
    }

    $scope.CreateTask = function(title, body, tags){

      // Create an empty object to hold the new task data
      var task = {};

      // add the title and body to the object (tags will be handled separately)
      task.title = title;
      task.body = body;

      // set a unique ID for the task from the current timestamp
      task.id = Date.now();

      // Convert comma separated tags into array
      // remove any trailing spaces after commas
      tags = tags.replace(/, /g, ',');
      // split string at commas and add the new array to "tags" in the "task" object
      task.tags = tags.split(',');


      // push the new task into the $scope.tasks array
      $scope.tasks.push(task);

      // add or update local storage with the $scope.tasks array
      localStorage.setItem("saved_tasks", JSON.stringify($scope.tasks));

      // check on the content of "saved_tasks" in local storage
      console.log( JSON.parse(localStorage.getItem("saved_tasks")) );


      // Combine the tag array of this task into into the "allTags" array
      $scope.allTags = $scope.allTags.concat(task.tags);

      // Strip duplicate tags from the "allTags" array
      $scope.allTags = $scope.allTags.filter(function(element, index) {
        return $scope.allTags.indexOf(element) == index;
      });

      // add or update local storage with the $scope.allTags array
      localStorage.setItem("all_tags", JSON.stringify($scope.allTags));

      // check on the content of "all_tags" in local storage
      console.log( JSON.parse(localStorage.getItem("all_tags")) );

    }

    $scope.DeleteTask = function(id){

      // Create a variable to hold the tags used by this task
      var these_tags;

      // delete the task from $scope.tasks
      // filter through all the tasks in $scope.tasks
      $scope.tasks = $scope.tasks.filter(function(element) {
        // if the id of the currently iterated task does not
        // match the id of the task we're trying to delete,
        // return it back into the $scope.tasks array
        if (element.id != id) {
          return element;
        } else {
          // When the targeted task is found, store the tags is uses
          // in the "these_tags" var
          // By not returning this task, it will be deleted from the array
          these_tags = element.tags;
        }
      });

      // Check each of the tags used by the deleted task to see if they are
      // also used on any other task.
      // If the tag is not used anywhere else, delete it from $scope.allTags
      // Start iterating "these_tags"
      for (var tag = 0; tag < these_tags.length; tag++) {

        // Store the tag being checked on this iteration under "check_tag"
        var check_tag = these_tags[tag];

        // Start iterating $scope.tasks
        for (var i = 0; i < $scope.tasks.length; i++) {
          // Store the currently iterated task under "this_task"
          var this_task = $scope.tasks[i];
          // Look for "check_tag" inside "this_task.tags"
          // If it's there, set "tag_on_other" to true
          // If not, set "tag_on_other" to false
          var tag_on_other = ( this_task.tags.indexOf(check_tag) == -1 ) ? false : true;

          // If this tag is not being used on any other tag, filter
          // it out of $scope.allTags to delete it from said array
          if (!tag_on_other){
            $scope.allTags = $scope.allTags.filter(function(element) {
              return element != check_tag;
            });
          }
        }

      }
      
      // Update local storage to:
      // A) Remove any now unused tags from "all_tags"
      // B) Remove the deleted task from "saved_tasks"
      localStorage.setItem("all_tags", JSON.stringify($scope.allTags));
      localStorage.setItem("saved_tasks", JSON.stringify($scope.tasks));

    }

    // Make sure that when tags are edited on a task, the updated comma separated
    // list is processed into an array of tags. Otherwise editing a task's tags
    // will mess them up
    $scope.UpdateTags = function(id){

      // start filtering $scope.tasks till we find the one
      // whose tags are currently being entered
      var findTask = $scope.tasks.filter(function(element) {
        // when the correct task is found...
        if (element.id == id) {
          // ...process its comma separated tags into an array
          var tags = element.tags.replace(/, /g, ',');
          element.tags = tags.split(',');
          // ...then return the modified element back into $scope.tasks
          return element;

        } else {
          // return every other task into the array unchanged
          return element;

        }
      });

    }

    // After ensuring edited tags are processed correctly, we can update
    // tasks when the user has finished editing
    $scope.UpdateTasks = function(){

      // Get all the tags off all the tasks
      // and concatenate them into the $scope.allTags array
      for (var i = 0; i < $scope.tasks.length; i++) {
        $scope.allTags = $scope.allTags.concat($scope.tasks[i].tags);
      }

      // Strip duplicate tags
      $scope.allTags = $scope.allTags.filter(function(element, index) {
        return $scope.allTags.indexOf(element) == index;
      });

      // Update local storage      
      localStorage.setItem("all_tags", JSON.stringify($scope.allTags));
      localStorage.setItem("saved_tasks", JSON.stringify($scope.tasks));

      console.log("Tasks Updated");

    }

  }
  // End custom controller

})();
