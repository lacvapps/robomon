var app = angular.module("Robokemon", ['firebase', 'ngMaterial', 'ngRoute', 'ngAnimate'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.alwaysWatchTheme(true);

        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('grey');

        $mdThemingProvider.theme('orange')
            .primaryPalette('orange')

        $mdThemingProvider.theme('darkTheme')
            .primaryPalette('grey', {
                'default': '900',
            })
            .accentPalette('red')
            .dark();
    });


app.config(['$routeProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'login.html',
        controller: 'login'
      }).
      when('/profile', {
        templateUrl: 'profile.html',
        controller: 'profile'
      }).
      when('/index', {
        templateUrl: 'profile.html',
        controller: 'profile'
      }).
      when('/friends', {
        templateUrl: 'friends.html',
        controller: 'members'
      }).
      when('/settings', {
        templateUrl: 'settings.html',
        controller: 'accountSetup'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);


app.controller("profile", ["$scope", "$firebaseObject", "$firebaseAuth", "$location", "$rootScope",
  function($scope, $firebaseObject, $firebaseAuth, $location, $rootScope) {
    var ref = new Firebase("https://glowing-fire-4041.firebaseio.com");
    $scope.auth = $firebaseAuth(ref);
    var authData = ref.getAuth();
    var userRef = ref.child("users").child(authData.uid);
    var obj = $firebaseObject(ref);
    //console.log(authData);
    $( document ).ready(function() {
        obj.$loaded().then(function() {
            $scope.auth.$onAuth(function(authData) {
                var userRef = ref.child("users").child(authData.uid);
                userRef.once("value", function(snapshot) {
                    $scope.$apply(function() {
                        $rootScope.data = snapshot.val()
                        $rootScope.dynamicTheme = $scope.data.theme;
                    })
                })
            })
        })
    });
}]);

app.controller("index", ["$scope", "$location", "$rootScope",
  function($scope, $location, $rootScope) {
    var ref = new Firebase("https://glowing-fire-4041.firebaseio.com");
    var authData = ref.getAuth();

    $( document ).ready(function() {
        if (authData) {
            $location.path("/index");
        } else {
            $location.path("/login");
        }
    })


    $scope.go = function(path) {
      $location.path(path);
    };

    $scope.accountSetup = function() {
        $(".accountSetup").toggleClass("hidden");
    };

    $scope.changeTheme = function() {
        $(".changeTheme").toggleClass("hidden");
    };

    $scope.selectTheme = function(option) {
        var ref = new Firebase("https://glowing-fire-4041.firebaseio.com");
        var authData = ref.getAuth();
        var userRef = ref.child("users").child(authData.uid);
        $rootScope.data.theme = option;
        userRef.update({ theme: option });
        $rootScope.dynamicTheme = option;
    };

}]);

app.controller("members", ["$scope", "$rootScope", "$firebaseObject", "$firebaseAuth", "$location",
    function($scope, $rootScope, $firebaseObject, $firebaseAuth, $location) {

        var ref = new Firebase("https://glowing-fire-4041.firebaseio.com");
        $scope.auth = $firebaseAuth(ref);
        var authData = ref.getAuth();
        var members = [];
        var obj = $firebaseObject(ref);

        $( document ).ready(function() {
            obj.$loaded().then(function() {
                $scope.auth.$onAuth(function(authData) {
                    var members = ref.child("users");
                    members.once("value", function(snapshot) {
                        $scope.$apply(function() {
                            $rootScope.data = snapshot.val()
                            console.log($rootScope.data);
                        })
                    })
                })
            })
        });
    }]);



app.controller('ctrl', function($scope, $rootScope){
      $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
        $rootScope.animation = currRoute.animation;
      });
    });

app.controller("accountSetup", ["$scope", "$firebaseObject", "$firebaseAuth", "$location",
      function($scope, $firebaseObject, $firebaseAuth, $location) {

        var ref = new Firebase("https://glowing-fire-4041.firebaseio.com");
        $scope.auth = $firebaseAuth(ref);
        var authData = ref.getAuth();
        var userRef = ref.child("users").child(authData.uid);
        var warning = "";
        //console.log("accountSetup");

        $("#finishButton").click(function() {
            var fName = $scope.user.firstName;
            var lName = $scope.user.lastName;
            var userName = $scope.user.userName;

            var obj = $firebaseObject(userRef);

            if (fName.length > 1 && lName.length > 1 && userName.length > 1) {
                obj.$bindTo($scope, "data").then(function() {
                  //console.log("Success");
                  $scope.data.fName = fName;
                  $scope.data.lName = lName;
                  $scope.data.userName = userName;
                  userRef.update({ fName: fName, lName: lName, userName: userName, setup: "true" });
                  $location.path("/index");
                });
            } else {
                if (fName.length < 1) {
                    $("#warningAlert").removeClass("hidden");
                    $("#warningAlert").fadeIn(500);
                    $scope.warning = "First name cannot be blank";
                    $("#warningAlert").fadeOut(5000);
                    return
                }
                if (lName.length < 1) {
                    $("#warningAlert").removeClass("hidden");
                    $("#warningAlert").fadeIn(500);
                    $scope.warning = "Last name cannot be blank";
                    $("#warningAlert").fadeOut(5000);
                    return
                }
                if (userName.length < 1) {
                    $("#warningAlert").removeClass("hidden");
                    $("#warningAlert").fadeIn(500);
                    $scope.warning = "User Name cannot be blank";
                    $("#warningAlert").fadeOut(5000);
                    return
                }
            }

        })
        var onComplete = function(error) {
          if (error) {
            console.log('Synchronization failed');
          } else {
            console.log('Synchronization succeeded');
          }
        };
    }
]);

$('#registerButton').click(function() {
    window.location.replace("./register.html");
})

app.controller("login", ["$scope", "$firebaseObject", "$firebaseAuth", "$location",
    function($scope, $firebaseObject, $firebaseAuth, $location) {
        $(".mainNav").addClass("hidden");

        var ref = new Firebase("https://glowing-fire-4041.firebaseio.com");
        var obj = $firebaseObject(ref);
        $scope.auth = $firebaseAuth(ref);

        $scope.login = function() {
            var userName = $scope.user.email;
            var password = $scope.user.password;
            var userRef = userRef;

            obj.$loaded().then(function() {
                $scope.auth.$authWithPassword({
                    email : userName,
                    password : password
                    }).then(function(authData) {
                        $scope.auth.$onAuth(function(authData) {
                            var userRef = ref.child("users").child(authData.uid);
                            userRef.once("value", function(snapshot) {
                                $scope.$apply(function() {
                                    $scope.data = snapshot.val()
                                })
                                //console.log($scope.data)
                                $(".mainNav").removeClass("hidden");
                                $location.path("/index");
                            })
                        })
                    }).catch(function(error) {
                      console.error("Authentication failed:", error);
                });
            });
        };
    }
]);

app.controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');

    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };
  });

app.controller('optionCtrl', ["$scope", "$firebaseAuth", "$location",
    function($scope, $firebaseAuth, $location) {
        var vm = this;
        var ref = new Firebase("https://glowing-fire-4041.firebaseio.com");
        var authData = ref.getAuth();

        $scope.logoutClick = function() {
            //console.log(ref.getAuth());
            ref.unauth();
            $location.path("/login");
        };
    }
]);


