angular.module('firstPage', [])

.config(function($httpProvider) {

	$httpProvider.interceptors.push(function(){

		return {

			response: function(req) {

				console.log("in response");
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

	console.log("in getToken");


    return $http.post("http://grandvision-ifair-server.appropo.info/api/oauth", credentials)
        .success(function (data, status, headers, config) {
       
            sessionStorage.setItem('token', data.access_token);
        })
        .error(function (data, status, headers, config) {
            console.error("in error");
        });



}

	this.getData = function (filter){
 
	return $http({

				maethod: 'POST', 
				url: 'http://grandvision-ifair-server.appropo.info/api/top-articles',
				headers: {'AUTHORIZATION' : 'Bearer ' + sessionStorage.getItem('token')} 

			})

			.success(function(data){

				//console.log(data);

			});

		}


	this.getModelData = function (model){
 
	return $http({

				maethod: 'GET', 
				url: 'http://grandvision-ifair-server.appropo.info/api/article-overview/' + model,
				headers: {'AUTHORIZATION' : 'Bearer ' + sessionStorage.getItem('token')} 

			})

			.success(function(data){

				//console.log(data);

			});

		}

 })

.controller('displayModels', ['$scope', 'myService', function ($scope, myService) { 


		$scope.visible = false ;
		
		
		console.log("in displayModels");
		myService.getToken();

		myService.getData().success(function(data){


		$scope.mainData = data._embedded.top_articles;
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






		/*[

			{model:'Model1', size:'Size S', price:'Price1', logo:'img/glases.jpg', brand:'Brand 1', gender:'Man'},
			{model:'Model3', size:'Size L', price:'Price1', logo:'img/glases.jpg', brand:'Another Brand', gender:'Woman'},
			{model:'Model12', size:'Size M', price:'Price1', logo:'img/glases.jpg', brand:'One more Brand', gender:'Man'},
			{model:'Model4', size:'Size1 XL', price:'Price1', logo:'img/glases.jpg', brand:'Another Brand', gender:'Woman'},
			{model:'Model5', size:'Size XXL', price:'Price1', logo:'img/glases.jpg', brand:'One more Brand', gender:'Man'},
			{model:'Model8', size:'Size XS', price:'Price1', logo:'img/glases.jpg', brand:'Another Brand', gender:'Woman'},
			{model:'Model67', size:'Size M', price:'Price1', logo:'img/glases.jpg', brand:'One more Brand', gender:'Man'},
			{model:'Model76', size:'Size L', price:'Price1', logo:'img/glases.jpg', brand:'Brand 1', gender:'Woman'},
			{model:'Model678', size:'Size XXS', price:'Price1', logo:'img/glases.jpg', brand:'One more Brand', gender:'Man'},
			{model:'Model9', size:'Size XXXL', price:'Price1', logo:'img/glases.jpg', brand:'Another Brand', gender:'Woman'},
			{model:'Model6', size:'Size L', price:'Price1', logo:'img/glases.jpg', brand:'One more Brand', gender:'Man'},
			{model:'Model432', size:'Size M', price:'Price1', logo:'img/glases.jpg', brand:'Brand 1', gender:'Woman'},

		];

		$scope.filtered = $scope.models;

		//Function is filtering models arraz
		$scope.filterModels = function(filter, value) {

			if(!filter || !value) {

				$scope.filtered = $scope.models;
				return;

			}

			$scope.filtered = $scope.models.filter(function(item){

				return item[filter] == value;

			});

		}

		//Function is getting all brands for display.
		$scope.brands = function(){



		}

		//Function is getting gender for display according the data scope.
		$scope.gender = function(){


		}*/

	}]);