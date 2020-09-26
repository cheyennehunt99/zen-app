'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config-default.json')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

var User = sequelize['import']('user.js');
db[User.name] = User;
var Checklist = sequelize['import']('checklist.js');
db[Checklist.name] = Checklist;
var Quote = sequelize['import']('quote.js');
db[Quote.name] = Quote;
var Likes = sequelize['import']('likes.js');
db[Likes.name] = Likes;

Quote.hasMany(Likes);
Likes.belongsTo(Quote);

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;