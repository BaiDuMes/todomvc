(function (angular) {
    'use strict';  //意思就是使用严格模式

    /**
     * 应用程序的主要的模块
     */
    var myApp = angular.module('myTodoMvc', ['ngRoute']);
    //路由配置
    myApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/:status', {
                controller: 'MainController',
                templateUrl: 'main_tmpl'
            })
            .otherwise({ redirectTo : '/' });
    }]);

    myApp.controller('MainController', ['$scope', '$routeParams','$route', function ($scope, $routeParams,$route) {

        /**
         * 找一个元素的索引
         */
        var findIndex = function (id) {
            var index = -1;
            angular.forEach($scope.todos, function (value, key) {
                // console.log(value+"+"+key);
                if (value.id === id) {
                    index = key;
                    return;
                }
            });
            return index;
        };

        /**
         * 获取ID
         */
        var getId = function () {
            var id = Math.random();
            for (var i = 0; i < $scope.todos.length; i++) {
                if ($scope.todos[i].id === id) {
                    getId();
                    break;
                }
            }
            return id;
        };

        // 文本框需要一个模型
        $scope.text = "";
        //任务列表
        $scope.todos = [

            {
                id: 1,
                text: '学习',
                completed: false
            },
            {
                id: 2,
                text: '睡觉',
                completed: true
            },
            {
                id: 3,
                text: '吃饭',
                completed: false
            }

        ];

        //添加一个任务
        $scope.add = function () {
            if (!$scope.text) return;
            $scope.todos.push(
                {
                    id: getId(),
                    text: $scope.text,
                    completed: false
                }
            );
            $scope.text = '';
        };

        //删除一个任务
        $scope.remove = function (id) {
            var index = findIndex(id);
            $scope.todos.splice(index, 1);
        };

        //清空已经完成的任务
        $scope.clear = function () {
            var result = [];
            for (var i = 0; i < $scope.todos.length; i++) {
                if (!$scope.todos[i].completed) {
                    result.push($scope.todos[i])
                }
            }
            $scope.todos = result;
        };

        //是否有已经完成的，如果有就显示Clear completed
        $scope.existCompleted = function () {
            for (var i = 0; i < $scope.todos.length; i++) {
                if ($scope.todos[i].completed) {
                    return true;
                }
            }
            return false;
        };

        // 当前编辑哪个元素
        $scope.currentEditingId = -1;
        $scope.editing = function (id) {
            $scope.currentEditingId = id;
        };
        $scope.save = function () {
            $scope.currentEditingId = -1;
        };

        //切换状态（全选/取消）
        var now = true;
        $scope.toggleAll = function () {
            for (var i = 0; i < $scope.todos.length; i++) {
                $scope.todos[i].completed = now;
            }
            now = !now;
        };

        //状态筛选
        $scope.selector = {};
        var status = $routeParams.status;
        switch (status) {
            case 'active':
                $scope.selector = {completed: false};
                break;
            case 'completed':
                $scope.selector = {completed: true};
                break;
            default:
                $route.updateParams({status:''});
                $scope.selector = {};
                break;
        }


        //自定义比较服务
        $scope.selectCompare = function (source, target) {
            return source === target;
        }

    }]);

})(angular);
