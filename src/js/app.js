angular.module('beatrx', [])
	.controller('marbles', function ($scope) {
		$scope.inputs = {
			first: [
				{time: 10, value: 'A'},
				{time: 50, value: 'B'},
				{time: 90, value: 'C'}
			],
			second: [
				{time: 15, value: '1', alt: true},
				{time: 40, value: '2', alt: true},
				{time: 55, value: '3', alt: true}
			]
		};
		$scope.outputs = {
			name: [
				{time: 10, value: 'A'},
				{time: 20, value: 'B'},
				{time: 75, value: 'C'},
				{time: 15, value: '1', alt: true},
				{time: 40, value: '2', alt: true},
				{time: 55, value: '3', alt: true}
			]
		};
		$scope.position = function (marble) {
			return (5 + marble.time * 0.9) + '%';
		};
	});