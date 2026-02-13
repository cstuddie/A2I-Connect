const { default: DateTime } = require('tedious/lib/data-types/datetime');
const db = require('../../db/knex');

exports.getAllConversations = async (userID) => {
  const latestMessageSubquery = db('Message as m1')
    .select('m1.ConversationID')
    .max('m1.TimeStamp as LatestTimeStamp')
    .groupBy('m1.ConversationID')
    .as('lm');

  return db('Conversation as c')
    .where(function () {
      this.where('c.InitiatorID', userID)
          .orWhere('c.RecieverID', userID);
    })

    .join(latestMessageSubquery, 'c.ID', 'lm.ConversationID')

    .join('Message as m', function () {
      this.on('m.ConversationID', '=', 'c.ID')
          .andOn('m.TimeStamp', '=', 'lm.LatestTimeStamp');
    })

    .join('User as u', function () {
      this.on(function () {
        this.on('u.ID', '=', 'c.InitiatorID')
            .andOnVal('c.RecieverID', '=', userID);
      })
      .orOn(function () {
        this.on('u.ID', '=', 'c.RecieverID')
            .andOnVal('c.InitiatorID', '=', userID);
      });
    })

    .select(
      'c.ID as ConversationID',
      'm.ID as MessageID',
      'm.Content',
      'm.TimeStamp',
      'm.Read',
      'u.ID as OtherUserID',
      'u.FirstName',
      'u.LastName'
    )
    .orderBy('m.TimeStamp', 'desc');
};

exports.getMessagesForConversation = async (conversationID) => db('Message').where('ConversationID', conversationID).orderBy('TimeStamp', "asc");

exports.sendMessage = async ({ Content, SenderID, ConversationID }) => {
  const [id] = await db("Message").insert({
    Content,
    SenderID,
    ConversationID,
    Read: false
  });

  return db("Message")
    .where({ ID: id })
    .first();
};