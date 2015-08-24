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

        username: config.username, 
        password: config.password,
        grant_type: 'password',
        client_id: 'ifair-app'

        };

this.getToken = function(){ // Getting a token from a server.

	console.log("Getting a TOKEN...");


    return $http.post(config.tokenURL, credentials)
        .success(function (data, status, headers, config) {
       
            sessionStorage.setItem('token', data.access_token);

            console.log("Token successfully fetch!");

        })
        .error(function (data, status, headers, config) {

            console.error("Error during token fetching : " + headers);

        });

}

	this.getData = function (api, filters){ // Initial server call collecting tom articles.
 
		if(api == true){
			var endpoint = config.dataEAN;
		}
		else{
			var endpoint = config.dataURL;
		}

		return $http({

			maethod: 'POST', 
			url: endpoint + filters,
			headers: {'AUTHORIZATION' : 'Bearer ' + sessionStorage.getItem('token')} 

		})
		.success(function(data){

			console.log("Successfully Fetch ALL data!");

		});

	}


	/*this.getFilterData = function (filters){ // Filtering function!
 
		return $http({

			maethod: 'GET', 
			url: 'http://grandvision-ifair-server.appropo.info/api/top-articles?' + filters,
			headers: {'AUTHORIZATION' : 'Bearer ' + sessionStorage.getItem('token')} 

		})

		.success(function(data){

			console.log("Data sucessfully filtered!");

		});

	}*/

		/*this.getModelData = function (model){ // Collecting data for particular model.
 
		return $http({

			maethod: 'GET', 
			url: 'http://grandvision-ifair-server.appropo.info/api/article-overview/' + model,
			headers: {'AUTHORIZATION' : 'Bearer ' + sessionStorage.getItem('token')} 

		})

		.success(function(data){

			console.log("Successfully fetch Model data!");

		});

	}*/

 })

.controller('displayModels', ['$interval', '$scope', 'myService', function ($interval, $scope, myService) { 


		$scope.EANCheckbox = false ; // Setting the EAN sorting to false on initial load.
		$scope.visible = false ; // Visibility status init!
		var filters = []; // Variable for storing filter status.
		var filtering = ""; // Storing data from the last filter for the back function.
		var i = "";
		
		console.log("Starting APP !");

		myService.getToken(); 

		$interval (function (){ // Calling the server every 5 seconds!

			for(i = 0; i<filters.length; i++){

				filtering += filters[i]['filterName'] + "=" + filters[i]['filterValue'] + "&";
				console.log(filtering);

			}

			myService.getData($scope.EANCheckbox, filtering).success(function(data){

				$scope.makeMainData(data);

				$scope.allData = data;

				filtering = " ";

				console.log(Date());
				console.log("EAN Checkbox state: " + $scope.EANCheckbox);
				console.log(data);

			}).error(function(data, status){

				console.log(status);
				if (status == 403 || status == 401){ // Checking if Token is expired! 

					filtering = " ";

					myService.getToken();

				}

		}); }, 5000)


		$scope.filterModels = function (filter, value){

			filters[filters.length] = { filterName:filter , filterValue:value } ;			

			for(i = 0; i<filters.length; i++){

				filtering += filters[i]['filterName'] + "=" + filters[i]['filterValue'] + "&";
				console.log(filtering);

			}

			myService.getData($scope.EANCheckbox, filtering).success(function(data){

				$scope.makeMainData(data);
				$scope.allData = data;

				console.log(data);

			});

			filtering = " ";
			console.log(filtering);

		}

		$scope.back = function(back){

			for(i = 0; i<filters.length; i++){

				if( filters[i]['filterName'] == back ) {

					filters.splice(i, 1);

				};

			}

			console.log(filters);

			for(i = 0; i<filters.length; i++){

				filtering += filters[i]['filterName'] + "=" + filters[i]['filterValue'] + "&";
				console.log(filtering);

			}

			myService.getData($scope.EANCheckbox, filtering).success(function(data){

				$scope.makeMainData(data);
				$scope.allData = data;

				console.log(data);

			});

			filtering = " ";
			console.log(filtering + "Filter REMOVED");


		}

		$scope.makeMainData = function(data){

			if(data._embedded.top_articles){

				$scope.mainData = data._embedded.top_articles;

				}
				else if(data._embedded.top_models)
				{
					$scope.mainData = new Array;

					for(var i=0; i<data._embedded.top_models.length; i++){
						for(var j=0; j<data._embedded.top_models[i].articles.length; j++){

							//console.log("Article lenght:" + data._embedded.top_models[i].articles.length);
							$scope.mainData[$scope.mainData.length] = data._embedded.top_models[i].articles[j];
							//console.log($scope.mainData);

						}
					}
					console.log("Displaying Model Datas! Scope lenght:" + data._embedded.top_models.length);
					console.log($scope.mainData);
				}

		}

		$scope.EANCheckboxFunc = function(){

			for(i = 0; i<filters.length; i++){

				filtering += filters[i]['filterName'] + "=" + filters[i]['filterValue'] + "&";
				console.log(filtering);

			}

			myService.getData($scope.EANCheckbox, filtering).success(function(data){

				$scope.makeMainData(data);

				$scope.allData = data;

				filtering = " ";

				console.log(Date());
				console.log("EAN Checkbox state: " + $scope.EANCheckbox);
				console.log(data);

			}).error(function(data, status){

				console.log(status);
				if (status == 403 || status == 401){ // Checking if Token is expired! 

					filtering = " ";

					myService.getToken();

				}

			});

		}

		/*$scope.getModel = function(model) {

			console.log(model);

			$scope.visible = true; // Changing visibility !

			myService.getModelData(model).success(function(data){

				
				$scope.modelData = data;
				console.log(data);
				

			});

		}*/

}]);
