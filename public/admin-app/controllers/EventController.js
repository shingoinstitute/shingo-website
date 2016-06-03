(function(){
  angular.module('app')
  .controller('EventController', ['$scope', 'events', '$routeParams', '$location', '$window', EventController]);

  function EventController ($scope, events, $routeParams, $location, $window){
    var vm = this;
    vm.display = false;
    vm.toggleJSON = function($event){
      vm.display = !vm.display;
      if(vm.display){
          $event.currentTarget.className = "fa fa-compress fa-2x"
      } else {
          $event.currentTarget.className = "fa fa-expand fa-2x"
      }
    }
    vm.saveEvent = function(event){
      events.post(event).success(function(data){
        vm.ev = event
        vm.success = "Your event saved successfully!"
      }).error(function(data){
        vm.error = "An error occured while saving..."
      });
    }
    vm.destroy = function(type){
      delete vm[type]
    }
    vm.addRegistration = function(){
      vm.ev.registration.prices.push({});
    }
    vm.removeRegistration = function(id){
      vm.ev.registration.prices.splice(id,1);
    }
    vm.addDay = function(){
      vm.ev.agenda.push({});
    }
    vm.removeDay = function(id){
      vm.ev.agenda.splice(id, 1);
    }
    vm.addSession = function(id){
      if(!vm.ev.agenda[id].sessions){
        vm.ev.agenda[id].sessions = new Array()
      }
      vm.ev.agenda[id].sessions.push({});
    }
    vm.removeSession = function(a_id, id){
      vm.ev.agenda[a_id].sessions.splice(id,1);
    }
    vm.addDetail = function(a_id, s_id){
      if(!vm.ev.agenda[a_id].sessions[s_id].info){
        vm.ev.agenda[a_id].sessions[s_id].info = {
          detail: new Array()
        }
      }
      vm.ev.agenda[a_id].sessions[s_id].info.detail.push({});
    }
    vm.removeDetail = function(a_id, s_id, id){
      vm.ev.agenda[a_id].sessions[s_id].info.detail.splice(id,1);
    }
    vm.move = function(index){
      if(vm.data_length){
        var newIndex = parseInt($routeParams.id) + index;
        var n = parseInt(vm.data_length);
        var i = ((newIndex % n) + n) % n;
        $location.url('events/' + i);
      }
    }
    events.get().success(function(data) {
      vm.data_length = data.length;
      vm.ev = data[$routeParams.id];
    });

    vm.key_buffer = [];
    vm.ctrlDown = false;
    vm.ctrlKey = 91, vm.sKey = 83;

    angular.element($window).bind("keyup", function($event) {
        vm.key_buffer = [];
    });

    angular.element($window).bind("keydown", function($event) {
        if(vm.key_buffer.indexOf($event.keyCode) < 0){
          vm.key_buffer.push($event.keyCode);
        }
        if(vm.key_buffer.indexOf(vm.ctrlKey) >= 0 && vm.key_buffer.indexOf(vm.sKey) >= 0){
          $event.preventDefault();
          vm.saveEvent(vm.ev);
        }
    });

  }
})();
