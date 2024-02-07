import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { TransactionApiMicroservice } from "./api-microservice";
import { TransactionApigateway } from "./apigateway";
import { TransactionDatabase as DemoDatabase } from "./database";
import { TransactionEventMicroservice } from "./event-microservice";
import { TransactionEventBus } from "./eventbus";
import { TransactionQueue } from "./queue";

export class ListenToYourselfEdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new DemoDatabase(this, "TransactionDatabase");

    const apiMicroservice = new TransactionApiMicroservice(
      this,
      "TransactionMicroservice"
    );

    const apigateway = new TransactionApigateway(
      this,
      "TransactionApiGateway",
      {
        transactionApiMicroservice: apiMicroservice.transactionApiMicroservice,
      }
    );

    const eventMicroservice = new TransactionEventMicroservice(
      this,
      "TransactionEventMicroservice",
      {
        database: database.transactionTable,
      }
    );

    const queue = new TransactionQueue(this, "TransactionQueue", {
      consumer: eventMicroservice.transactionEventMicroservice,
    });

    const eventbus = new TransactionEventBus(this, "TransactionEventBus", {
      publisherFunction: apiMicroservice.transactionApiMicroservice,
      targetQueue: queue.transactionQueue,
    });
  }
}
