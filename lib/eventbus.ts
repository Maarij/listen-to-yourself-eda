import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { SqsQueue } from "aws-cdk-lib/aws-events-targets";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { IQueue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface TransactionEventBusProps {
  publisherFunction: IFunction;
  targetQueue: IQueue;
}

export class TransactionEventBus extends Construct {
  constructor(scope: Construct, id: string, props: TransactionEventBusProps) {
    super(scope, id);

    const bus = new EventBus(this, "TransactionEventBus", {
      eventBusName: "TransactionEventBus",
    });

    const processTransactionRule = new Rule(this, "ProcessTransactionRule", {
      eventBus: bus,
      enabled: true,
      description: "Do some processing for a transaction that occurred",
      eventPattern: {
        source: ["assets.transaction.process"],
        detailType: ["ProcessBasket"],
      },
      ruleName: "ProcessTransactionRule",
    });

    processTransactionRule.addTarget(new SqsQueue(props.targetQueue));

    bus.grantPutEventsTo(props.publisherFunction);
  }
}
