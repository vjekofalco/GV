angular.module('firstPage', [])

.config(function($httpProvider) {

	$httpProvider.interceptors.push(function(){

		return {  // Returning response from HTTP request

			response: function(req) {

				console.log("HTTP_Response fetch!" + req);
				return req;

			}

		}

	})

})

.service('myService', function ($http){  

	var credentials = {

        username: 'admin', 
        password: 'admin',
        grant_type: 'password',
        client_id: 'ifair-app'
        
        };

this.getToken = function(){ // Getting a token from a server.

	console.log("Getting a TOKEN...");


    return $http.post("http://grandvision-ifair-server.appropo.info/api/oauth", credentials)
        .success(function (data, status, headers, config) {
       
            sessionStorage.setItem('token', data.access_token);

            console.log("Token successfully fetch!");

        })
        .error(function (data, status, headers, config) {

            console.error("Error during token fetching : " + headers);

        });

}

	this.getData = function (){ // Initial server call collecting tom articles.
 
		return $http({

			maethod: 'POST', 
			url: 'http://grandvision-ifair-server.appropo.info/api/top-articles',
			headers: {'AUTHORIZATION' : 'Bearer ' + sessionStorage.getItem('token')} 

		})
		.success(function(data){

			console.log("Successfully Fetch ALL data!");

		});

	}

	this.getModelData = function (model){ // Collecting data for particular model.
 
	return $http({

				maethod: 'GET', 
				url: 'http://grandvision-ifair-server.appropo.info/api/article-overview/' + model,
				headers: {'AUTHORIZATION' : 'Bearer ' + sessionStorage.getItem('token')} 

			})

			.success(function(data){

				console.log("Successfully fetch Model data!");

			});

		}

	this.getFilterData = function (filters){ // Filtering function!
 
	return $http({

				maethod: 'GET', 
				url: 'http://grandvision-ifair-server.appropo.info/api/top-articles?' + filters,
				headers: {'AUTHORIZATION' : 'Bearer ' + sessionStorage.getItem('token')} 

			})

			.success(function(data){

				console.log("Data sucessfully filtered!");

			});

		}

 })

.controller('displayModels', ['$scope', 'myService', function ($scope, myService) { 


		$scope.visible = false ; // Visibility status init!
		var filters = ""; // Variable for storing filter status.
		var lastFiltered; // Storing data from the last filter for the back function.
		
		
		console.log("Starting APP !");

		myService.getToken();

		myService.getData().success(function(data){

			$scope.mainData = data._embedded.top_articles;
			$scope.allData = data;
			console.log(data);

		});

		$scope.getModel = function(model) {

			console.log(model);

			$scope.visible = true; // Changing visibility !

			myService.getModelData(model).success(function(data){

				
				$scope.modelData = data;
				console.log(data);
				

			});

		}

		$scope.filterModels = function (filter, value){

			
			if (filters != "") {

				filters += "&";
				lastFiltered = "&";

			}

			filters += filter + "=" + value
			lastFiltered += filter + "=" + value

			myService.getFilterData(filters).success(function(data){

				$scope.mainData = data._embedded.top_articles;
				$scope.allData = data;

				console.log(data);

			});

		}

		$scope.back = function(){

			filters = filters.substring(0, filters.length - lastFiltered.length);
			console.log(filters);

			myService.getFilterData(filters).success(function(data){

				$scope.mainData = data._embedded.top_articles;
				$scope.allData = data;

			});

		}

}]);
