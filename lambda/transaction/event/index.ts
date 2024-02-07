import { EventBridgeEvent } from "aws-lambda";

export const handler = async (event: EventBridgeEvent<any, any>) => {
  console.log(`event lambda picked up ${event}`);
};
