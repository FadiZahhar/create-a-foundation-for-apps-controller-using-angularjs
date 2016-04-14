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

    // uncomment this when you want to remove all locally stored tasks
    localStorage.removeItem("saved_tasks");

    // uncomment this when you want to remove all locally stored tags
    localStorage.removeItem("all_tags");

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

  }
  // End custom controller

})();
