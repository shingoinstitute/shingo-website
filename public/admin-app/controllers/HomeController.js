(function(){
  angular.module('app')
  .controller('HomeController', ['$scope', 'events', HomeController]);

  function HomeController($scope, events){
    var vm = this;
    events.get().success(function(data) {
      vm.events = data;
    });
  }
})();
