import { ITable } from "aws-cdk-lib/aws-dynamodb";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";

interface TransactionEventMicroserviceProps {
  database: ITable;
}

export class TransactionEventMicroservice extends Construct {
  public readonly transactionEventMicroservice: NodejsFunction;

  constructor(scope: Construct, id: string, props: TransactionEventMicroserviceProps) {
    super(scope, id);
    this.transactionEventMicroservice = this.createMicroservice(props.database);
  }

  private createMicroservice(transactionTable: ITable): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: transactionTable.tableName,
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const transactionEventMicroservice = new NodejsFunction(
      this,
      "transactionLambdaEventFunction",
      {
        entry: "./lambda/transaction/event/index.ts",
        ...nodeJsFunctionProps,
      }
    );

    return transactionEventMicroservice;
  }
}
