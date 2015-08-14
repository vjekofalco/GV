angular.module('firstPage', [])

.config(function($httpProvider) {

	$httpProvider.interceptors.push(function(){

		return {

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

this.getToken = function(){

	console.log("Getting a TOKEN...");


    return $http.post("http://grandvision-ifair-server.appropo.info/api/oauth", credentials)
        .success(function (data, status, headers, config) {
       
            sessionStorage.setItem('token', data.access_token);
            console.log("Token successfully fetch!");
        })
        .error(function (data, status, headers, config) {
            console.error("in error");
        });



}

	this.getData = function (){
 
	return $http({

				maethod: 'POST', 
				url: 'http://grandvision-ifair-server.appropo.info/api/top-articles',
				headers: {'AUTHORIZATION' : 'Bearer ' + sessionStorage.getItem('token')} 

			})

			.success(function(data){

				console.log("Successfully Fetch ALL data!");

			});

		}


	this.getModelData = function (model){
 
	return $http({

				maethod: 'GET', 
				url: 'http://grandvision-ifair-server.appropo.info/api/article-overview/' + model,
				headers: {'AUTHORIZATION' : 'Bearer ' + sessionStorage.getItem('token')} 

			})

			.success(function(data){

				console.log("Successfully fetch Model data!");

			});

		}


	this.getFilterData = function (filter, value){
 
	return $http({

				maethod: 'GET', 
				url: 'http://grandvision-ifair-server.appropo.info/api/top-articles?' + filter + '=' + value,
				headers: {'AUTHORIZATION' : 'Bearer ' + sessionStorage.getItem('token')} 

			})

			.success(function(data){

				console.log("Data sucessfully filtered!");

			});

		}

 })

.controller('displayModels', ['$scope', 'myService', function ($scope, myService) { 


		$scope.visible = false ;
		
		
		console.log("Starting APP !");

		myService.getToken();

		myService.getData().success(function(data){


		$scope.mainData = data._embedded.top_articles;
		$scope.allData = data;
		console.log(data);

		});


		$scope.getModel = function(model) {

			console.log(model);
			$scope.visible = true;

			myService.getModelData(model).success(function(data){

				
				$scope.modelData = data;
				console.log(data);
				

			});

		}


		$scope.filterModels = function (filter, value){

			myService.getFilterData(filter, value).success(function(data){

				$scope.mainData = data._embedded.top_articles;
				//$scope.allData = data;

			})

		}


	}]);