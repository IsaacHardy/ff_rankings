'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Teams', [
        {
          teamName: "Team 1",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team 2",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team 3",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team 4",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team 5",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team 6",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team 7",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team 8",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team 9",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team 10",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team 11",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team 12",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team 13",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team 14",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Teams', null, {});
  }
};
