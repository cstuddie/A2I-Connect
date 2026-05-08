/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('Message').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  const now = new Date();

  await knex('Message').insert([
    // Conv 1 — Emma (6) ↔ Alice (1), React App from Scratch [completed, read]
    { TimeStamp: now, Content: 'Hi Alice! I saw your profile and think you\'d be perfect to lead our React workshop. We have about 8 developers transitioning from Angular.', SenderID: 6, ConversationID: 1, Read: true },
    { TimeStamp: now, Content: 'Hi Emma! That sounds like a great group. Angular-to-React transitions are a fun challenge — I can tailor the session around the mental model shift.', SenderID: 1, ConversationID: 1, Read: true },
    { TimeStamp: now, Content: 'Perfect! Would January 15th work for you? We\'re thinking a half-day session, online.', SenderID: 6, ConversationID: 1, Read: true },
    { TimeStamp: now, Content: 'January 15th works great. I\'ll prepare hands-on exercises so everyone leaves with working code. Looking forward to it!', SenderID: 1, ConversationID: 1, Read: true },

    // Conv 2 — Marcus (8) ↔ Bob (2), Data Analysis with Python [completed, read]
    { TimeStamp: now, Content: 'Hi Bob, our analytics team needs a solid pandas workshop. We\'re mostly working with messy real-world datasets.', SenderID: 8, ConversationID: 2, Read: true },
    { TimeStamp: now, Content: 'That\'s right in my wheelhouse! What\'s the team\'s current experience level — beginner, intermediate?', SenderID: 2, ConversationID: 2, Read: true },
    { TimeStamp: now, Content: 'Intermediate. They know Python basics but get stuck on data cleaning and reshaping.', SenderID: 8, ConversationID: 2, Read: true },
    { TimeStamp: now, Content: 'Got it. I\'ll focus on real-world data cleaning patterns, merges, and groupby workflows. In-person in NYC work for January 22nd?', SenderID: 2, ConversationID: 2, Read: true },

    // Conv 3 — James (10) ↔ Carol (3), ML Intro [completed, read]
    { TimeStamp: now, Content: 'Carol, I\'ve heard great things about your ML talks. Our dev team wants to understand when to actually use machine learning vs simpler approaches.', SenderID: 10, ConversationID: 3, Read: true },
    { TimeStamp: now, Content: 'That\'s a great framing — it\'s one of the most practical questions in applied ML. I have a decision framework I\'ve refined over several workshops.', SenderID: 3, ConversationID: 3, Read: true },
    { TimeStamp: now, Content: 'Sounds exactly right. February 10th, online, about 2 hours?', SenderID: 10, ConversationID: 3, Read: true },

    // Conv 4 — Olivia (11) ↔ David (5), Penetration Testing [completed, read]
    { TimeStamp: now, Content: 'Hi David, we need a penetration testing fundamentals session for our security team — mixed skill levels, some junior devs and some experienced sysadmins.', SenderID: 11, ConversationID: 4, Read: true },
    { TimeStamp: now, Content: 'Great mix — I actually enjoy that combination. I\'ll structure it as foundations followed by a live demo lab that scales to different experience levels.', SenderID: 5, ConversationID: 4, Read: true },
    { TimeStamp: now, Content: 'That works perfectly. February 20th in-person — does that fit your schedule?', SenderID: 11, ConversationID: 4, Read: true },

    // Conv 5 — Emma (6) ↔ Alice (1), React Hooks [completed, read]
    { TimeStamp: now, Content: 'Alice, the React session was fantastic — the team is still talking about it! Would you be up for a follow-up on advanced Hooks?', SenderID: 6, ConversationID: 5, Read: true },
    { TimeStamp: now, Content: 'Absolutely, that team was a pleasure to work with. What depth are you looking for — performance patterns, custom hooks, or both?', SenderID: 1, ConversationID: 5, Read: true },
    { TimeStamp: now, Content: 'Both if possible. They\'ve started building their own hooks but are hitting performance issues with large lists.', SenderID: 6, ConversationID: 5, Read: true },

    // Conv 6 — Noah (12) ↔ Sophia (9), Neural Networks [completed, read]
    { TimeStamp: now, Content: 'Sophia, I\'d love to have you speak on neural networks for our AI study group. The audience has basic ML experience — go as deep as you like on the math.', SenderID: 12, ConversationID: 6, Read: true },
    { TimeStamp: now, Content: 'Perfect audience for a rigorous session. I\'ll cover backprop and gradient descent properly — most resources gloss over the details.', SenderID: 9, ConversationID: 6, Read: true },
    { TimeStamp: now, Content: 'Exactly what we want. March 18th online, ~3 hours?', SenderID: 12, ConversationID: 6, Read: true },

    // Conv 7 — Marcus (8) ↔ Bob (2), Statistical Analysis [completed, read]
    { TimeStamp: now, Content: 'Bob, our leadership team needs a stats refresher — they make data-driven decisions but their fundamentals are rusty.', SenderID: 8, ConversationID: 7, Read: true },
    { TimeStamp: now, Content: 'I can do an executive-level session with real business use cases. Less theory, more intuition and applied examples.', SenderID: 2, ConversationID: 7, Read: true },
    { TimeStamp: now, Content: 'Can you include forecasting examples? They deal with quarterly projections constantly.', SenderID: 8, ConversationID: 7, Read: true },
    { TimeStamp: now, Content: 'Absolutely — I\'ll use retail and financial forecasting examples they\'ll immediately connect with. April 2nd in-person?', SenderID: 2, ConversationID: 7, Read: true },

    // Conv 8 — James (10) ↔ Alice (1), TypeScript [scheduled, unread]
    { TimeStamp: now, Content: 'Hi Alice! Our team is migrating to TypeScript and I think a structured workshop would help us avoid bad patterns from the start.', SenderID: 10, ConversationID: 8, Read: false },
    { TimeStamp: now, Content: 'Great timing to bring in a workshop — TypeScript migrations go much smoother with a solid foundation. Are you starting from scratch or do you have some TS already?', SenderID: 1, ConversationID: 8, Read: false },
    { TimeStamp: now, Content: 'Mostly from scratch. A few utility files have been converted but nothing systematic yet.', SenderID: 10, ConversationID: 8, Read: false },

    // Conv 9 — test (7) ↔ Bob (2), Git [scheduled, unread]
    { TimeStamp: now, Content: 'Hi Bob, I\'m hoping you could run a Git basics session for my team. We keep running into issues with branching and understanding the commit history.', SenderID: 7, ConversationID: 9, Read: false },
    { TimeStamp: now, Content: 'Happy to help! Is the main struggle with branching strategies, merge conflicts, or reading the log/history?', SenderID: 2, ConversationID: 9, Read: false },
    { TimeStamp: now, Content: 'Mostly branching — people create branches off the wrong base and merge conflicts happen constantly. Team is about 6 people.', SenderID: 7, ConversationID: 9, Read: false },
    { TimeStamp: now, Content: 'For a team that size, Git Flow or a simplified trunk-based approach works well. I\'ll put together a hands-on session covering both and let the team decide which fits.', SenderID: 2, ConversationID: 9, Read: false },
    { TimeStamp: now, Content: 'That sounds perfect. June 1st online works for us — looking forward to it!', SenderID: 7, ConversationID: 9, Read: false },

    // Conv 10 — Olivia (11) ↔ David (5), Zero Trust [scheduled, unread]
    { TimeStamp: now, Content: 'David, following up on our penetration testing session — can we do a follow-up focused on Zero Trust architecture?', SenderID: 11, ConversationID: 10, Read: false },
    { TimeStamp: now, Content: 'Great timing — Zero Trust is exactly where the industry is heading. What aspect is most urgent for your org?', SenderID: 5, ConversationID: 10, Read: false },
    { TimeStamp: now, Content: 'Mainly identity verification and least-privilege access. We\'re rethinking our entire access model.', SenderID: 11, ConversationID: 10, Read: false },

    // Conv 11 — test (7) ↔ Alice (1), CSS Grid [completed, unread]
    { TimeStamp: now, Content: 'Hi Alice! I\'ve been struggling with CSS layouts for a project — specifically getting a responsive grid to work consistently across screen sizes.', SenderID: 7, ConversationID: 11, Read: false },
    { TimeStamp: now, Content: 'CSS layout is one of my favorite topics! Are you mostly building two-dimensional layouts, or is this primarily row-based?', SenderID: 1, ConversationID: 11, Read: false },
    { TimeStamp: now, Content: 'It\'s a dashboard with both — cards in a grid and some sidebar/main layouts. Currently using flexbox everywhere and it\'s getting messy.', SenderID: 7, ConversationID: 11, Read: false },
    { TimeStamp: now, Content: 'That\'s the perfect use case to cover both. I\'ll do a comparison session — when to use Grid vs Flexbox, how to combine them, and common responsive patterns.', SenderID: 1, ConversationID: 11, Read: false },
    { TimeStamp: now, Content: 'That\'s exactly what I need. Will you cover browser compatibility too? We need to support some older browsers.', SenderID: 7, ConversationID: 11, Read: false },

    // Conv 12 — test (7) ↔ Carol (3), AI Concepts [completed, unread]
    { TimeStamp: now, Content: 'Hi Carol, I\'m looking for someone to give our team an accessible overview of AI — not too technical, just enough to understand what\'s possible.', SenderID: 7, ConversationID: 12, Read: false },
    { TimeStamp: now, Content: 'I love giving these kinds of sessions! What\'s the audience mix — mostly business folks, developers, or a combination?', SenderID: 3, ConversationID: 12, Read: false },
    { TimeStamp: now, Content: 'Mixed — about half are business stakeholders and half are developers. The devs want more depth but the business side needs approachable language.', SenderID: 7, ConversationID: 12, Read: false },
    { TimeStamp: now, Content: 'Perfect — I\'ll structure it as AI vs ML vs Deep Learning with real use cases, then do a deeper technical track for the devs at the end. About 2.5 hours total.', SenderID: 3, ConversationID: 12, Read: false },
    { TimeStamp: now, Content: 'That structure sounds great. March 1st online works for us!', SenderID: 7, ConversationID: 12, Read: false },

    // Conv 13 — test (7) ↔ David (5), Network Security [scheduled, unread]
    { TimeStamp: now, Content: 'Hi David, I\'m building out the network infrastructure for a small startup and want to make sure we\'re doing security right from the start.', SenderID: 7, ConversationID: 13, Read: false },
    { TimeStamp: now, Content: 'Smart to think about this early — retrofitting security is much harder. Can you describe your current setup? Cloud, on-prem, or hybrid?', SenderID: 5, ConversationID: 13, Read: false },
    { TimeStamp: now, Content: 'Mostly cloud (AWS) with a small on-prem office network. About 10 people. We have basic firewall rules but nothing more sophisticated.', SenderID: 7, ConversationID: 13, Read: false },
    { TimeStamp: now, Content: 'Good baseline to work with. I\'ll tailor the session as an assessment walkthrough — we\'ll go through your setup together and I\'ll show you exactly where to harden. In-person on May 25th?', SenderID: 5, ConversationID: 13, Read: false }
  ]);
};
