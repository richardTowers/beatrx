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

		var res = scheduler.startWithCreate(function () {
			return observables[0]
				.map(function (x) {
					return { value: x.value.toLowerCase() };
				})
				.merge(observables[1]);
		});

		var result = res.messages.map(function (message) {
			return {
				time: message.time - 200,
				value: message.value.value.value,
				alt: message.value.value.alt
			}
		});

		$scope.outputs = { result: result };

		$scope.position = function (marble) {
			return (5 + marble.time * 0.9) + '%';
		};
	});