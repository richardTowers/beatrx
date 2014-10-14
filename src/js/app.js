angular.module('beatrx', ['ui.codemirror'])
	.controller('marbles', function ($scope) {
		'use strict';

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

		$scope.editorOptions = {
			mode: "javascript",
			theme: "blackboard",
			// Thick indent more like...
			smartIndent: false
		};

		$scope.src = 'return first\n' +
			'\t\t.map(function (x) { return { value: x.value.toLowerCase() }; })\n' +
			'\t\t.merge(second);';

		function getResult () {
			try {
				var scheduler = new Rx.TestScheduler(),
					onNext = Rx.ReactiveTest.onNext,
					onCompleted = Rx.ReactiveTest.onCompleted,
					subscribe = Rx.ReactiveTest.subscribe;

				var observables = Object.keys($scope.inputs).map(function (key) {
					return scheduler.createColdObservable(
						$scope.inputs[key].map(function (value) {
							return onNext(value.time, { value: value.value, alt: value.alt });
						}));
				});

				var userDefinedFunction = new Function('first', 'second', $scope.src);

				var res = scheduler.startWithCreate(function () {
					var first = observables[0];
					var second = observables[1];
					return userDefinedFunction(first, second);
				});

				return res.messages.map(function (message) {
					return {
						time: message.time - 200,
						value: message.value.value.value,
						alt: message.value.value.alt
					}
				});
			}
			catch (error) {
				console.error(error);
			}
		}

		$scope.outputs = { result: getResult() };

		$scope.$watch('src', function () {
			$scope.outputs = { result: getResult() };
		});

		$scope.position = function (marble) {
			return (5 + marble.time * 0.9) + '%';
		};
	});