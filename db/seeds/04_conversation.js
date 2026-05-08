/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('Conversation').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  await knex('Conversation').insert([
    { InitiatorID: 6,  RecieverID: 1, AssociatedEventID: 1  }, // Emma → Alice, React App
    { InitiatorID: 8,  RecieverID: 2, AssociatedEventID: 2  }, // Marcus → Bob, Data Analysis
    { InitiatorID: 10, RecieverID: 3, AssociatedEventID: 3  }, // James → Carol, ML Intro
    { InitiatorID: 11, RecieverID: 5, AssociatedEventID: 4  }, // Olivia → David, Pentest
    { InitiatorID: 6,  RecieverID: 1, AssociatedEventID: 5  }, // Emma → Alice, React Hooks
    { InitiatorID: 12, RecieverID: 9, AssociatedEventID: 6  }, // Noah → Sophia, Neural Nets
    { InitiatorID: 8,  RecieverID: 2, AssociatedEventID: 7  }, // Marcus → Bob, Stats
    { InitiatorID: 10, RecieverID: 1, AssociatedEventID: 8  }, // James → Alice, TypeScript
    { InitiatorID: 7,  RecieverID: 2, AssociatedEventID: 11 }, // test → Bob, Git
    { InitiatorID: 11, RecieverID: 5, AssociatedEventID: 9  }, // Olivia → David, Zero Trust
    { InitiatorID: 7,  RecieverID: 1, AssociatedEventID: 19 }, // test → Alice, CSS Grid
    { InitiatorID: 7,  RecieverID: 3, AssociatedEventID: 20 }, // test → Carol, AI Concepts
    { InitiatorID: 7,  RecieverID: 5, AssociatedEventID: 21 }  // test → David, Network Security
  ]);
};
