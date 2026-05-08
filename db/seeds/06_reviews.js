/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('Reviews').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  await knex('Reviews').insert([
    {
      Date: new Date(),
      Content: 'Alice delivered an incredible workshop. Our team built their first React app during the session — the Angular comparison was exactly the right framing.',
      ReviewerID: 6,
      AssociatedEventID: 1,
      RecieverID: 1
    },
    {
      Date: new Date(),
      Content: 'Bob\'s explanation of pandas was clear and practical. He used real messy datasets which made the techniques immediately applicable.',
      ReviewerID: 8,
      AssociatedEventID: 2,
      RecieverID: 2
    },
    {
      Date: new Date(),
      Content: 'Carol\'s ML decision framework was exactly what our team needed. We now have a clear process for evaluating when to use machine learning vs simpler solutions.',
      ReviewerID: 10,
      AssociatedEventID: 3,
      RecieverID: 3
    },
    {
      Date: new Date(),
      Content: 'David kept a mixed-skill audience engaged throughout the entire session. The live lab portion was particularly effective for both junior and senior team members.',
      ReviewerID: 11,
      AssociatedEventID: 4,
      RecieverID: 5
    },
    {
      Date: new Date(),
      Content: 'Alice\'s Hooks deep dive leveled up our entire frontend team. The custom hooks section and performance optimization patterns were worth every minute.',
      ReviewerID: 6,
      AssociatedEventID: 5,
      RecieverID: 1
    },
    {
      Date: new Date(),
      Content: 'Sophia went deep on backpropagation in a way that finally made it click for everyone. Best technical session our study group has had.',
      ReviewerID: 12,
      AssociatedEventID: 6,
      RecieverID: 9
    },
    {
      Date: new Date(),
      Content: 'The leadership team loved Bob\'s statistical storytelling. The forecasting examples were directly relevant to our business and the session sparked a lot of great discussion.',
      ReviewerID: 8,
      AssociatedEventID: 7,
      RecieverID: 2
    },
    {
      Date: new Date(),
      Content: 'Emma and her team were incredibly prepared and engaged. They came with real problems and Alice\'s tailored approach made the session genuinely useful.',
      ReviewerID: 1,
      AssociatedEventID: 1,
      RecieverID: 6
    },
    {
      Date: new Date(),
      Content: 'Alice broke down Flexbox and Grid in a way that finally clicked for me. The side-by-side comparison approach was brilliant and the browser compatibility section was a bonus.',
      ReviewerID: 7,
      AssociatedEventID: 19,
      RecieverID: 1
    },
    {
      Date: new Date(),
      Content: 'Carol made AI approachable for our whole team — technical and non-technical alike. The structured split between business context and technical depth worked perfectly.',
      ReviewerID: 7,
      AssociatedEventID: 20,
      RecieverID: 3
    },
    {
      Date: new Date(),
      Content: 'Great group to work with. They came prepared with real questions and a concrete project, which made the session much more focused and practical than a generic workshop.',
      ReviewerID: 1,
      AssociatedEventID: 19,
      RecieverID: 7
    }
  ]);
};
