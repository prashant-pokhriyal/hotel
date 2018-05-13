(function() {
  'use strict';
  angular
    .module('app')
    .controller('AppCtrl', AppCtrl);

  AppCtrl.$inject = ['appService'];

  function AppCtrl(appService) {
    var vm = this;
    vm.booking = {
      fields : [
        {
            class : 'fa-bed',
            name : 'rooms',
            value : 1,
            min : 1,
            max : 5,
            min_guest : 1,
            max_guest : 4,
            // disabled : vm.booking.fields[0].value < 2 ? true : false,
        },
        {
            class : 'fa-user',
            name : 'adults',
            value : 1,
            min : 1,
        },
        {
            class : 'fa-child',
            name : 'children',
            value : 0,
            min : 0
        },
      ],
    };
    vm.add = add;
    vm.remove = remove;
 // 1 room hai -> min 1 guest -> max 4 guest
 // ++room -> check guest -> total guest < required guest se to increase guest;
    function add(index, name) {
      var field = vm.booking.fields[index];
      $('#hotel-remove-' + field.name).tooltip("destroy");
      $('#hotel-add-' + field.name).tooltip("destroy");
      switch (field.name) {
        case 'rooms' : add_room(field); break;
        case 'adults' : add_guest(field); break;
        case 'children' : add_guest(field); break;
      }
    }

    function add_room(field) {
      if (field.value == field.max) {
        $('#hotel-add-' + field.name).attr('data-original-title', 'Max limit reached')
          .tooltip('show');
        return;
      }
      ++field.value;
      var curr_guest = vm.booking.fields[1].value + vm.booking.fields[2].value;
      var min_guest = field.value * field.min_guest;
      if (curr_guest < min_guest) {
        vm.booking.fields[1].value += min_guest - curr_guest;
      }
    }

    // add_guest -> check karo ki max adults in a room ki limit reach ho gyi hai kya
    // yadi nahi to add kar do otherwise increase mat kro
    function add_guest(field) {
      var max_guest = vm.booking.fields[0].value * vm.booking.fields[0].max_guest;
      console.log(max_guest, curr_guest);
      var curr_guest = vm.booking.fields[1].value + vm.booking.fields[2].value;
      if (curr_guest === max_guest) {
        $('#hotel-add-' + field.name).attr('data-original-title', 'Max limit reached')
          .tooltip('show');
        return;
      }
      ++field.value;
    }
    function remove(index, name) {
      var field = vm.booking.fields[index];
      $('#hotel-remove-' + field.name).tooltip("destroy");
      $('#hotel-add-' + field.name).tooltip("destroy");
      if (field.value === field.min) {
        $('#hotel-remove-' + field.name).attr('data-original-title', 'Min limit reached')
          .tooltip('show');
        return;
      }
      switch (field.name) {
        case 'rooms' : remove_room(field); break;
        case 'adults' : remove_guest(field); break;
        case 'children' : remove_guest(field); break;
      }
    }

    // check karo ki room remove karne k sath sath adult aur children ka
    // constraint check karo. If room reduce karne se accomodation reduce hoti
    // hai to pehle children ko reduce karo, fir adult ko.
    function remove_room(field) {
      --field.value;
      var curr_guest = vm.booking.fields[1].value + vm.booking.fields[2].value;
      var max_guest = field.value * field.max_guest;
      while (curr_guest > max_guest) {
        vm.booking.fields[2].value ? --vm.booking.fields[2].value :
        vm.booking.fields[1].value ? --vm.booking.fields[1].value : vm.booking.fields[1].value;
        curr_guest = vm.booking.fields[1].value + vm.booking.fields[2].value;
      }
    }

    function remove_guest(field) {
      --field.value;
      var curr_guest = vm.booking.fields[1].value + vm.booking.fields[2].value;
      var min_guest = vm.booking.fields[0].value * vm.booking.fields[0].min_guest;
      if (curr_guest < min_guest) {
        --vm.booking.fields[0].value;
        min_guest = vm.booking.fields[0].value * vm.booking.fields[0].min_guest;
      }
    }
  }

})();
