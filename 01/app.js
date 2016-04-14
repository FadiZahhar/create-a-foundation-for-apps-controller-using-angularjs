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

    // extend F4A default controller to ensure all functionality is preserved
    // for more info see http://foundation.zurb.com/apps/docs/#!/angular
    angular.extend(this, $controller('DefaultController', {$scope: $scope}));

    console.log("custom controller loaded");

  }
  // End custom controller

})();
