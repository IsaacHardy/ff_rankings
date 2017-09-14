'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Scores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      teamId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      week1: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week2: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week3: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week4: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week5: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week6: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week7: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week8: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week9: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week10: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week11: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week12: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week13: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week14: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week15: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      week16: {
        type: Sequelize.INTEGER,
        defaultValues: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Scores');
  }
};
