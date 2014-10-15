angular.module('beatrx', ['ui.codemirror'])
	.controller('marbles', function ($scope) {
		'use strict';

		$scope.inputs = {
			first: [
				{time: 10, value: 'A'},
				{time: 20, value: 'B'},
				{time: 30, value: 'C'}
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

		var supportsArrowFunctions = (function () {
			try {
				eval('() => {}');
				return true;
			}
			catch (x) {
				return false;
			}
		})();

		if (supportsArrowFunctions) {
			$scope.src = 'return first\n' +
				'\t\t.map(x => x.toLowerCase())\n' +
				'\t\t.merge(second);';
		}
		else {
			$scope.src = 'return first\n' +
				'\t\t.map(function (x) { return x.toLowerCase(); })\n' +
				'\t\t.merge(second);';
		}
		

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
					var first = observables[0].map(function (x) { return x.value; });
					var second = observables[1].map(function (x) { return x.value; });
					return userDefinedFunction(first, second).map(function (x) {
						return { value: x };
					});
				});

				$scope.error = false;

				return res.messages.map(function (message) {
					return {
						time: message.time - 200,
						value: message.value.value.value,
						alt: message.value.value.alt
					}
				});
			}
			catch (error) {
				$scope.error = {
					message: error.message,
					stack: error.stack
				}
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