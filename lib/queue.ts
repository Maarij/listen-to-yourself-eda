import { Duration } from "aws-cdk-lib";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { IQueue, Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface TransactionQueueProps {
  consumer: IFunction;
}

export class TransactionQueue extends Construct {
  public readonly transactionQueue: IQueue;

  constructor(scope: Construct, id: string, props: TransactionQueueProps) {
    super(scope, id);

    this.transactionQueue = new Queue(this, "TransactionQueue", {
      queueName: "TransactionQueue",
      visibilityTimeout: Duration.seconds(30),
    });

    props.consumer.addEventSource(
      new SqsEventSource(this.transactionQueue, {
        batchSize: 1,
      })
    );
  }
}
