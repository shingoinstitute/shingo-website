(function(){
  angular.module('app')
  .controller('HomeController', ['$scope', 'events', '$location', HomeController]);

  function HomeController($scope, events, $location){
    var vm = this;
    vm.addEvent = function(){
      vm.events.push({name: "New Event"});
      $location.url('events/' + (parseInt(vm.events.length) - 1));
    }
    events.get().success(function(data) {
      vm.events = data;
    });
  }
})();
