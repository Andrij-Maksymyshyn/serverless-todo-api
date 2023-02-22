const AWS = require("aws-sdk");
const { v4 } = require("uuid");

const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.createTodo = async (event) => {
  try {
    const timeStamp = new Date().toISOString();
    const eventData = JSON.parse(event.body);

    console.log("EVENT:::", event);

    if (typeof eventData.todo !== "string") {
      console.error("Validation failed. Todo must be a string.");
    }

    if (typeof eventData.checked !== "boolean") {
      console.error("Validation failed. Checked must be a boolean.");
    }

    const params = {
      TableName: TODO_TABLE,
      Item: {
        id: v4(),
        todo: eventData.todo,
        checked: eventData.checked,
        createdAt: timeStamp,
        updatedAt: timeStamp,
      },
    };

    const createdTodo = await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(createdTodo),
    };
  } catch (error) {
    console.error(error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
