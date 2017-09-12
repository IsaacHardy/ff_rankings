'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Teams', [
        {
          teamName: "Blaino's Little Finger",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Dead Cometh",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "I CAM IN MY PANTS",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Suck on my Hairy Ball Zack",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Team Shepherd",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Laughing Llamas",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Feed Moncrief!",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Blazing Bryants",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "In Rod We Trust",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Cali Fournettecation",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Get your Zeke on",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Zeke-a Virus",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Weak in the Knees",
          ownerId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          teamName: "Monster Meats",
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
