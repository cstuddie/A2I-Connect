/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('Event').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  await knex('Event').insert([
    // Completed events
    {
      RequesterID: 6,
      InstructorID: 1,
      Topic: 'Building a React App from Scratch',
      Description: 'A hands-on workshop guiding our dev team through building a full React application from setup to deployment.',
      Date: '2026-01-15',
      EventStatus: 3,
      ExpertiseID: 1,
      DeliveryMethod: 'Online'
    },
    {
      RequesterID: 8,
      InstructorID: 2,
      Topic: 'Data Analysis with Python',
      Description: 'Practical session on pandas, data cleaning, and exploratory analysis for our analytics team.',
      Date: '2026-01-22',
      EventStatus: 3,
      ExpertiseID: 2,
      DeliveryMethod: 'In-person'
    },
    {
      RequesterID: 10,
      InstructorID: 3,
      Topic: 'Introduction to Machine Learning',
      Description: 'An introduction to ML concepts and a framework for deciding when to apply machine learning to business problems.',
      Date: '2026-02-10',
      EventStatus: 3,
      ExpertiseID: 3,
      DeliveryMethod: 'Online'
    },
    {
      RequesterID: 11,
      InstructorID: 5,
      Topic: 'Penetration Testing Basics',
      Description: 'Foundations of penetration testing including recon, exploitation, and reporting for our security team.',
      Date: '2026-02-20',
      EventStatus: 3,
      ExpertiseID: 4,
      DeliveryMethod: 'In-person'
    },
    {
      RequesterID: 6,
      InstructorID: 1,
      Topic: 'React Hooks Deep Dive',
      Description: 'Advanced workshop on custom hooks, useReducer, useMemo, and performance patterns for experienced React developers.',
      Date: '2026-03-05',
      EventStatus: 3,
      ExpertiseID: 1,
      DeliveryMethod: 'Online'
    },
    {
      RequesterID: 12,
      InstructorID: 9,
      Topic: 'Neural Networks Explained',
      Description: 'A rigorous walkthrough of neural network architecture, backpropagation, and gradient descent for our AI study group.',
      Date: '2026-03-18',
      EventStatus: 3,
      ExpertiseID: 3,
      DeliveryMethod: 'Online'
    },
    {
      RequesterID: 8,
      InstructorID: 2,
      Topic: 'Statistical Analysis for Business',
      Description: 'Executive-level statistics refresher covering forecasting, hypothesis testing, and data storytelling with real business examples.',
      Date: '2026-04-02',
      EventStatus: 3,
      ExpertiseID: 2,
      DeliveryMethod: 'In-person'
    },
    // Scheduled events
    {
      RequesterID: 10,
      InstructorID: 1,
      Topic: 'TypeScript Best Practices',
      Description: 'Workshop to help our team migrate an existing JavaScript codebase to TypeScript with confidence.',
      Date: '2026-04-20',
      EventStatus: 2,
      ExpertiseID: 1,
      DeliveryMethod: 'Online'
    },
    {
      RequesterID: 11,
      InstructorID: 5,
      Topic: 'Zero-Trust Security Architecture',
      Description: 'Deep dive into zero-trust principles, identity verification, and practical implementation strategies.',
      Date: '2026-05-15',
      EventStatus: 2,
      ExpertiseID: 4,
      DeliveryMethod: 'Online'
    },
    {
      RequesterID: 12,
      InstructorID: 9,
      Topic: 'AI Ethics in Practice',
      Description: 'Workshop exploring bias, fairness, accountability, and responsible AI deployment for technical and business teams.',
      Date: '2026-05-22',
      EventStatus: 2,
      ExpertiseID: 3,
      DeliveryMethod: 'In-person'
    },
    {
      RequesterID: 7,
      InstructorID: 2,
      Topic: 'Getting Started with Git',
      Description: 'Hands-on Git workshop covering branching strategies, merge conflict resolution, and team workflows.',
      Date: '2026-06-01',
      EventStatus: 2,
      ExpertiseID: 1,
      DeliveryMethod: 'Online'
    },
    // Pending events
    {
      RequesterID: 6,
      InstructorID: null,
      Topic: 'Advanced CSS Techniques',
      Description: 'Looking for a speaker to cover CSS animations, custom properties, and modern layout techniques.',
      Date: '2026-06-10',
      EventStatus: 1,
      ExpertiseID: 1,
      DeliveryMethod: 'Online'
    },
    {
      RequesterID: 8,
      InstructorID: null,
      Topic: 'Machine Learning Model Deployment',
      Description: 'Need guidance on deploying ML models to production — containerization, APIs, and monitoring.',
      Date: '2026-06-15',
      EventStatus: 1,
      ExpertiseID: 3,
      DeliveryMethod: 'Online'
    },
    {
      RequesterID: 10,
      InstructorID: null,
      Topic: 'Building REST APIs with Node.js',
      Description: 'Workshop on designing and building RESTful APIs using Node.js and Express for our backend team.',
      Date: '2026-06-20',
      EventStatus: 1,
      ExpertiseID: 1,
      DeliveryMethod: 'In-person'
    },
    {
      RequesterID: 11,
      InstructorID: null,
      Topic: 'Cybersecurity for Startups',
      Description: 'Practical security fundamentals for a small startup — threat modeling, secure coding, and incident response basics.',
      Date: '2026-07-01',
      EventStatus: 1,
      ExpertiseID: 4,
      DeliveryMethod: 'Online'
    },
    {
      RequesterID: 12,
      InstructorID: null,
      Topic: 'Data Visualization with Python',
      Description: 'Looking for a speaker on matplotlib, seaborn, and Plotly to help our team create better data narratives.',
      Date: '2026-07-08',
      EventStatus: 1,
      ExpertiseID: 2,
      DeliveryMethod: 'Online'
    },
    {
      RequesterID: 7,
      InstructorID: null,
      Topic: 'Web Development Fundamentals',
      Description: 'Seeking a speaker to cover HTML, CSS, and JavaScript basics for a small team new to web development.',
      Date: '2026-07-15',
      EventStatus: 1,
      ExpertiseID: 1,
      DeliveryMethod: 'In-person'
    },
    // Cancelled event
    {
      RequesterID: 1,
      InstructorID: null,
      Topic: 'Frontend Performance Optimization',
      Description: 'Session on bundle splitting, lazy loading, and Core Web Vitals — cancelled due to scheduling conflict.',
      Date: '2026-08-01',
      EventStatus: 4,
      ExpertiseID: 1,
      DeliveryMethod: 'Online'
    },
    // Test user completed events
    {
      RequesterID: 7,
      InstructorID: 1,
      Topic: 'CSS Grid and Flexbox Workshop',
      Description: 'Practical workshop on CSS layout systems — Grid vs Flexbox, responsive patterns, and browser compatibility.',
      Date: '2026-01-10',
      EventStatus: 3,
      ExpertiseID: 1,
      DeliveryMethod: 'Online'
    },
    {
      RequesterID: 7,
      InstructorID: 3,
      Topic: 'Introduction to AI Concepts',
      Description: 'Accessible overview of AI, machine learning, and deep learning for a mixed business and technical audience.',
      Date: '2026-03-01',
      EventStatus: 3,
      ExpertiseID: 3,
      DeliveryMethod: 'Online'
    },
    // Test user scheduled event
    {
      RequesterID: 7,
      InstructorID: 5,
      Topic: 'Network Security Fundamentals',
      Description: 'Session on securing a small startup network — firewalls, VPNs, access controls, and threat monitoring.',
      Date: '2026-05-25',
      EventStatus: 2,
      ExpertiseID: 4,
      DeliveryMethod: 'In-person'
    },
    // Test user pending events
    {
      RequesterID: 7,
      InstructorID: null,
      Topic: 'JavaScript Advanced Patterns',
      Description: 'Looking for a speaker on closures, prototypes, async patterns, and design patterns in modern JavaScript.',
      Date: '2026-07-20',
      EventStatus: 1,
      ExpertiseID: 1,
      DeliveryMethod: 'Online'
    },
    {
      RequesterID: 7,
      InstructorID: null,
      Topic: 'Python for Beginners',
      Description: 'Need a speaker to introduce Python basics to a small team with no prior programming experience.',
      Date: '2026-08-10',
      EventStatus: 1,
      ExpertiseID: 2,
      DeliveryMethod: 'Online'
    }
  ]);
};
