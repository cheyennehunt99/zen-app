module.exports = function(sequelize, DataTypes) {
  const Likes = sequelize.define("Likes", {
    reflection: {
      type: DataTypes.STRING(255)
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id"
      }
    },
    quoteId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Quotes",
        key: "id"
      }
    }
  });
  return Likes;
};
