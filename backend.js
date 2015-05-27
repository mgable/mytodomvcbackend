//var pg = require('pg.js');
var _ = require('underscore');

module.exports = function () {
  var todos = [];
  return {
    get: function(callback) {
      callback(false, todos);
    },

    create: function(todo, callback) {
      todos.push(todo);
      callback(false, todo);
    },

   update: function(id, _todo_, callback){
      var todo = _.find(todos, function(todo){
        return todo.id == id;
      });
      // todo.title = _todo_.title;
      // todo.completed = _todo_.completed
      _.extend(todo, _todo_);
      callback(false, todo);
   },

    delete: function(id, callback) {
      todos = _.reject(todos, function(todo){
        return todo.id == id;
      });
      callback(false, todos);
    },

    clear: function(callback) {
      todos = _.reject(todos, function(todo){
        return todo.completed;
      });
      callback(false, todos);
    }
  };
};

