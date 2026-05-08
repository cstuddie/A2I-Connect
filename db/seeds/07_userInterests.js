/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('UserInterests').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  await knex('UserInterests').insert([
    // Alice: Web Development + AI & ML
    { UserID: 1,  InterestID: 1 },
    { UserID: 1,  InterestID: 3 },

    // Bob: Data Science + AI & ML
    { UserID: 2,  InterestID: 2 },
    { UserID: 2,  InterestID: 3 },

    // Carol: AI & ML + Data Science
    { UserID: 3,  InterestID: 3 },
    { UserID: 3,  InterestID: 2 },

    // David: Cybersecurity + Web Development
    { UserID: 5,  InterestID: 4 },
    { UserID: 5,  InterestID: 1 },

    // Emma: Web Development + AI & ML
    { UserID: 6,  InterestID: 1 },
    { UserID: 6,  InterestID: 3 },

    // test: Web Development
    { UserID: 7,  InterestID: 1 },

    // Marcus: Data Science + Cybersecurity
    { UserID: 8,  InterestID: 2 },
    { UserID: 8,  InterestID: 4 },

    // Sophia: AI & ML + Data Science
    { UserID: 9,  InterestID: 3 },
    { UserID: 9,  InterestID: 2 },

    // James: Web Development + Data Science
    { UserID: 10, InterestID: 1 },
    { UserID: 10, InterestID: 2 },

    // Olivia: Cybersecurity + AI & ML
    { UserID: 11, InterestID: 4 },
    { UserID: 11, InterestID: 3 },

    // Noah: Data Science + AI & ML
    { UserID: 12, InterestID: 2 },
    { UserID: 12, InterestID: 3 }
  ]);
};
