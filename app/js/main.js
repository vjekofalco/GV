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

})

.controller('displayModels', ['$interval', '$scope', 'myService', function ($interval, $scope, myService) { 


		$scope.navHeadings = {

			"brand": "Brand",
			"gender": "Gender",
			"gv_core": "GV_Core",
			"material": "Material"

		}

		$scope.EANCheckbox = false ; // Setting the EAN sorting to false on initial load.
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

				console.log(Date() + "  EAN Checkbox state: " + $scope.EANCheckbox);
				console.log(data);

			}).error(function(data, status){

				console.log(status);
				if (status == 403 || status == 401){ // Checking if Token is expired! 

					filtering = " ";

					myService.getToken();

				}

			}); 

		}, 5000)


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

		$scope.EANCheckboxfunction = function(){

			//console.log("New checkbox status:" + $scope.EANCheckbox);
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

}]).directive('itemData', function() {

	return {
		restrict: 'E',
		template: '<div class="row">\
                        <div class="col-xs-2 col-lg-2 col-md-2 col-sm-2">\
                            <h2 id="circle"><span> {{$index + 1}} </span></h2>\
                        </div>\
                        <div class="col-xs-6 col-lg-5 col-md-5 col-sm-5">\
                            <h2 class="text-center"> {{x.brand_name}} </h2>\
                        </div>\
                        <div class="col-xs-4 col-lg-5 col-md-5 col-sm-5">\
                            <h2 class="text-center"> {{x.gender}} </h2>\
                        </div>\
                    </div>\
                    <div class="row hidden-xs">\
                        <div class="col-lg-4 col-md-4 col-sm-4 text-center" id="itemDataHolder">\
                            <img ng-src= "{{x.img}}" class="img-thumbnail img-responsive" id="itemPic" />\
                        </div>\
                        <div class="col-lg-4 col-md-4 col-sm-4" id="itemDataHolder">\
                           <h3> <label>Model:</label> {{x.model}} </h3><br>\
                           <h3> <label>Lifecycle:</label> {{x.carry_over}} </h3><br>\
                           <h3> <label>Size:</label> {{x.size}} </h3><br>\
                           <h3> <label>ICo Price:</label> {{x.inter_co_price_eu}}<span class="pull-right">{{x.inter_co_price_latam}}</span></h3>\
                           </div>\
                        <div class="col-lg-4 col-md-4 col-sm-4" id="itemDataHolder">\
                        <h3 ng-show=x.gv_core_range!="NO"> <label>GV Core Range: </label>  &nbsp; <h3 ng-if=x.gv_core_range=="GLOBAL" style="color:red;font-weight: bold;"> {{x.gv_core_range}}<br></h3><h3 ng-if=x.gv_core_range=="REGIONAL" style="font-weight: bold;"> {{x.gv_core_range}}<br></h3> </h3>\
                           <h3> <label>Material group:</label> {{x.material_group}} </h3><br>\
                           <h3> <label>Sub Brand:</label> {{x.sub_brand}} </h3>\
                        </div>\
                    </div>\
                     <div class="row hidden-xs">\
                        <div class="col-lg-4 col-md-4 col-sm-4 text-center" id="volumes">\
                            <h2 class="center"> <label>QTY Model:</label> {{x.total_orders}} </h2>\
                        </div>\
                        <div class="col-lg-4 col-md-4 col-sm-4 text-center" id="volumes">\
                            <h2 class="center"> {{x.moq_model}} </h2>\
                        </div>\
                        <div class="col-lg-4 col-md-4 col-sm-4 text-center" id="QRCodeHolder">\
                            <img src="img/qrcode.jpg" width="100px" class="img-responsive center-block"  />\
                            <h3> <label>Article EAN:</label> {{x.ean}} </h3>\
                        </div>\
                    </div>' 

	};

}).directive('smallScreens', function() {

	return {

		restrict: 'E',
		template: '<div class="row visible-xs">\
                        <div class="col-xs-2">\
                        </div>\
                        <div class="col-xs-8" id="itemDataHolder">\
                            <img ng-src= "{{x.img}}" class="img-thumbnail img-responsive" id="itemPic" />\
                        </div>\
                        <div class="col-xs-2">\
                        </div>\
                    </div>\
                    <div class="row visible-xs">\
                        <div class="col-xs-12 text-center" id="itemDataHolder">\
                           <h3> <label>Model:</label> {{x.model}} </h3><br>\
                           <h3> <label>Lifecycle:</label> {{x.carry_over}} </h3><br>\
                           <h3> <label>Size:</label> {{x.size}} </h3><br>\
                           <h3> <label>ICo Price:</label> {{x.inter_co_price_eu}}  &nbsp;&nbsp; <span>   {{x.inter_co_price_latam}}</span></h3><br>\
                           <h3 ng-show=x.gv_core_range!="NO"> <label>GV Core Range: </label>  &nbsp; <h3 ng-if=x.gv_core_range=="GLOBAL" style="color:red;font-weight: bold;"> {{x.gv_core_range}}<br></h3><h3 ng-if=x.gv_core_range=="REGIONAL" style="font-weight: bold;"> {{x.gv_core_range}}<br></h3> </h3>\
                           <h3> <label>Material group:</label> {{x.material_group}} </h3><br>\
                           <h3> <label>Sub Brand:</label> {{x.sub_brand}} </h3>\
                        </div>\
                    </div>\
                    <div class="row visible-xs">\
                        <div class="col-xs-12 text-center" id="volumes">\
                            <h2> <label>QTY Model:</label> {{x.total_orders}} </h2>\
                        </div>\
                        <div class="col-xs-12 text-center" id="volumes">\
                            <h2 class="center"> {{x.moq_model}} </h2>\
                        </div>\
                        <div class="col-xs-12 text-center">\
                            <img src="img/qrcode.jpg" width="100px" class="img-responsive center-block"  />\
                            <h3> <label>Article EAN:</label> {{x.ean}} </h3>\
                        </div>\
                    </div>'

	}

});
