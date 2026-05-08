const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('UserInterests').truncate().catch(() => {});
  await knex('User').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  const hashedPassword = await bcrypt.hash('password123', 10);

  await knex('User').insert([
    {
      Email: 'alice@example.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'Alice',
      LastName: 'Johnson',
      ExpertiseID: 1,
      Bio: 'Front-end developer with 5 years of experience building React applications.',
      Rating: 4.5,
      Status: 1,
      Affiliation: 'Tech Co.',
      IsAdmin: false
    },
    {
      Email: 'bob@example.com',
      Password: hashedPassword,
      Role: 2,
      FirstName: 'Bob',
      LastName: 'Smith',
      ExpertiseID: 2,
      Bio: 'Data scientist who loves Python and R, specializing in predictive modeling.',
      Rating: 4.7,
      Status: 1,
      Affiliation: 'Data Inc.',
      IsAdmin: false
    },
    {
      Email: 'carol@example.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'Carol',
      LastName: 'Williams',
      ExpertiseID: 3,
      Bio: 'Machine learning enthusiast with a background in research and applied AI.',
      Rating: 4.8,
      Status: 1,
      Affiliation: 'AI Labs',
      IsAdmin: false
    },
    {
      Email: 'admin@a2iconnect.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'Admin',
      LastName: 'User',
      ExpertiseID: null,
      Bio: 'System administrator.',
      Rating: null,
      Status: 1,
      Affiliation: 'A2I Connect',
      IsAdmin: true
    },
    {
      Email: 'david@example.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'David',
      LastName: 'Chen',
      ExpertiseID: 4,
      Bio: 'Cybersecurity professional with expertise in penetration testing and network defense.',
      Rating: 4.6,
      Status: 1,
      Affiliation: 'SecureNet',
      IsAdmin: false
    },
    {
      Email: 'emma@example.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'Emma',
      LastName: 'Rodriguez',
      ExpertiseID: 1,
      Bio: 'Startup founder passionate about developer education and web technology.',
      Rating: null,
      Status: 1,
      Affiliation: 'Startup Hub',
      IsAdmin: false
    },
    // Test user — ID 7 (7th insert after TRUNCATE resets auto_increment)
    {
      Email: 'test@email.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'test',
      LastName: 'testerton',
      ExpertiseID: 1,
      Bio: 'Bio',
      Rating: null,
      Status: 1,
      Affiliation: 'affiliate',
      IsAdmin: false,
      created_at: new Date('2026-02-03 11:35:10'),
      updated_at: new Date('2026-02-03 11:38:13')
    },
    {
      Email: 'marcus@example.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'Marcus',
      LastName: 'Lee',
      ExpertiseID: 2,
      Bio: 'Analytics team lead focused on data-driven decision making for business strategy.',
      Rating: null,
      Status: 1,
      Affiliation: 'Analytics Co.',
      IsAdmin: false
    },
    {
      Email: 'sophia@example.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'Sophia',
      LastName: 'Turner',
      ExpertiseID: 3,
      Bio: 'Deep learning researcher with publications in computer vision and NLP.',
      Rating: 4.9,
      Status: 1,
      Affiliation: 'Deep Mind Labs',
      IsAdmin: false
    },
    {
      Email: 'james@example.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'James',
      LastName: 'Wright',
      ExpertiseID: 1,
      Bio: 'Full-stack developer and engineering manager running workshops for growing dev teams.',
      Rating: null,
      Status: 1,
      Affiliation: 'DevHouse',
      IsAdmin: false
    },
    {
      Email: 'olivia@example.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'Olivia',
      LastName: 'Martinez',
      ExpertiseID: 4,
      Bio: 'Security operations lead building awareness programs across engineering organizations.',
      Rating: null,
      Status: 1,
      Affiliation: 'CyberShield',
      IsAdmin: false
    },
    {
      Email: 'noah@example.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'Noah',
      LastName: 'Thompson',
      ExpertiseID: 2,
      Bio: 'Data engineer specializing in pipeline architecture and business intelligence.',
      Rating: 4.4,
      Status: 1,
      Affiliation: 'DataWorks',
      IsAdmin: false
    },
    {
      Email: 'testadmin@email.com',
      Password: hashedPassword,
      Role: 1,
      FirstName: 'test',
      LastName: 'admin',
      ExpertiseID: null,
      Bio: 'Test admin account.',
      Rating: null,
      Status: 1,
      Affiliation: 'A2I Connect',
      IsAdmin: true
    }
  ]);
};
