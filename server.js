var app = require('express')(),
    bodyParser = require('body-parser'),
    backend = require('./backend');

// ----- Parse JSON requests

app.use(bodyParser.json());

// ----- Allow CORS

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// ----- The API implementation

var todos = backend();


function createCallback(res, onSuccess) {
  return function callback(err, data) {
    if (err || !data) {
      res.send(500, 'Something bad happened!');
      return;
    }

    onSuccess(data);
  }
}

var id = 0;

function createTodo(req) {
  return {
    title: req.body.title,
    completed: req.body.completed || false,
    id: id++
  };
}

function getCreateTodo(req) {
  return function(data) {
    return createTodo(data);
  };
}

app.get('/api', function(req, res) {
    res.send(true);
});

app.get('/api/todos', function(req, res) {
  todos.get(createCallback(res, function(todos) {
    res.send(todos);
  }));
});

// app.get('/:id', function(req, res) {
//   todos.get(req.params.id, createCallback(res, function(todo) {
//     res.send(createTodo(req, todo));
//   }));
// });

app.post('/api/todos', function(req, res) {
  todos.create(createTodo(req), createCallback(res, function(todo) {
    res.send(todo);
  }));
});

app.put('/api/todos/:id', function(req, res) {
  todos.update(req.params.id, req.body, createCallback(res, function(todo) {
    res.send(todo);
  }));
});

app.delete('/api/todos', function(req, res) {
  todos.clear(createCallback(res, function(todos) {
    res.send(todos);
  }));
});

app.delete('/api/todos/:id', function(req, res) {
  todos.delete(req.params.id, createCallback(res, function(todo) {
    res.send(todo);
  }));
});

app.listen(Number(process.env.PORT || 5000));
console.log('listing on port %s', Number(process.env.PORT || 5000));
