angular.module('firstPage', []).controller('displayModels', function($scope){

		
// the HTTP request will replace the array below!
		$scope.models = [

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

	});