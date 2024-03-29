import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";

interface TransactionEvent {
  id: string;
  amount: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("request:", JSON.stringify(event, undefined, 2));

  try {
    switch (event.requestContext.httpMethod) {
      case "GET":
        console.log("GET hit");
        break;
      case "POST":
        console.log("POST hit");

        const queueMessage: TransactionEvent = prepareEvent(event);
        await publishTransactionEvent(queueMessage);

        break;
      default:
        throw new Error(
          `Unsupported route: "${event.requestContext.httpMethod}"`
        );
    }

    return {
      body: JSON.stringify({ message: "Lambda Transaction hit" }),
      statusCode: 200,
      isBase64Encoded: false,
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (e) {
    console.error(e);

    let errorMsg;
    let errorStack;

    if (e instanceof Error) {
      errorMsg = e.message;
      errorStack = e.stack;
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Lambda Transaction error",
        errorMsg,
        errorStack,
      }),
    };
  }
};

const prepareEvent = (event: APIGatewayProxyEvent): TransactionEvent => {
  let id = uuidv4();
  let amount = `Text data ${Math.random()}`;

  return {
    id,
    amount,
  };
};

const publishTransactionEvent = async (event: TransactionEvent) => {
  console.log("publishTransactionEvent: ", event);

  try {
    const params = {
      Entries: [
        {
          Source: process.env.EVENT_SOURCE,
          Detail: JSON.stringify(event),
          DetailType: process.env.EVENT_DETAILTYPE,
          Resources: [],
          EventBusName: process.env.EVENT_BUSNAME,
        },
      ],
    };

    const ebClient = new EventBridgeClient();
    const data = await ebClient.send(new PutEventsCommand(params));

    console.log("Success, event sent; requestId:", data);

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
