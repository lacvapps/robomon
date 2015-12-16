        var app = angular.module("Robokemon", ["firebase"]);

        $("#editProfile").click(function() {
            window.location.replace("./account-setup.html");
        });

        var app = angular.module("Robokemon", ["firebase"]);
        var userRef = userRef;

        app.controller("profile", ["$scope", "$firebaseObject", "$firebaseAuth",
          function($scope, $firebaseObject, $firebaseAuth) {

            var ref = new Firebase("https://glowing-fire-4041.firebaseio.com");
            $scope.auth = $firebaseAuth(ref);
            var obj = $firebaseObject(ref);

            obj.$loaded().then(function() {
                $scope.auth.$onAuth(function(authData) {
                    var userRef = ref.child("users").child(authData.uid);
                    userRef.once("value", function(snapshot) {
                        $scope.$apply(function() {
                            $scope.data = snapshot.val()
                        })
                    })
                })
            })
        }]);

        app.controller("accountSetup", ["$scope", "$firebaseObject", "$firebaseAuth",
              function($scope, $firebaseObject, $firebaseAuth) {

                var ref = new Firebase("https://glowing-fire-4041.firebaseio.com");
                $scope.auth = $firebaseAuth(ref);
                var authData = $scope.auth.$getAuth();
                var userRef = ref.child("users").child(authData.uid);
                var warning = "";

                $("#finishButton").click(function() {
                    var fName = $("#fName").val();
                    var lName = $("#lName").val();
                    var userName = $("#userName").val();

                    var obj = $firebaseObject(userRef);

                    if (fName.length > 1 && lName.length > 1 && userName.length > 1) {
                        obj.$bindTo($scope, "data").then(function() {
                          //console.log("Success");
                          $scope.data.fName = fName;
                          $scope.data.lName = lName;
                          $scope.data.userName = userName;
                          userRef.update({ fName: fName, lName: lName, userName: userName, setup: "true" });
                          window.location.replace("./index.html");
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
        app.controller("login", ["$scope", "$firebaseObject", "$firebaseAuth",
              function($scope, $firebaseObject, $firebaseAuth) {

                var ref = new Firebase("https://glowing-fire-4041.firebaseio.com");
                var obj = $firebaseObject(ref);
                $scope.auth = $firebaseAuth(ref);

                $('#loginButton').click(function() {
                    var userName = $('#userName').val();
                    var password = $('#password').val();
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
                                    })
                                    window.location.replace("./index.html");
                                })
                            }).catch(function(error) {
                              console.error("Authentication failed:", error);
                            });
                        });
                    });
                }]);


