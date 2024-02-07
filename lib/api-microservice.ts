import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class TransactionApiMicroservice extends Construct {
  public readonly transactionApiMicroservice: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.transactionApiMicroservice = this.createMicroservice();
  }

  private createMicroservice(): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        EVENT_SOURCE: "transaction.process",
        EVENT_DETAILTYPE: "ProcessTransaction",
        EVENT_BUSNAME: "TransactionEventBus",
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const transactionApiMicroservice = new NodejsFunction(
      this,
      "transactionLambdaApiFunction",
      {
        entry: "./lambda/transaction/api/index.ts",
        ...nodeJsFunctionProps,
      }
    );

    return transactionApiMicroservice;
  }
}
