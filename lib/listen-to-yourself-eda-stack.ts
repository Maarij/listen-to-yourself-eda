import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { TransactionApigateway } from "./apigateway";
import { TransactionDatabase as DemoDatabase } from "./database";
import { TransactionEventBus } from "./eventbus";
import { TransactionMicroservice } from "./microservice";
import { TransactionQueue } from "./queue";

export class ListenToYourselfEdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new DemoDatabase(this, "TransactionDatabase");

    const microservice = new TransactionMicroservice(this, "TransactionMicroservice", {
      transactionTable: database.transactionTable,
    });

    const apigateway = new TransactionApigateway(this, "TransactionApiGateway", {
      transactionMicroservice: microservice.transactionMicroservice,
    });

    const queue = new TransactionQueue(this, "TransactionQueue", {
      consumer: microservice.transactionMicroservice,
    });

    const eventbus = new TransactionEventBus(this, "TransactionEventBus", {
      publisherFunction: microservice.transactionMicroservice,
      targetQueue: queue.transactionQueue,
    });
  }
}
