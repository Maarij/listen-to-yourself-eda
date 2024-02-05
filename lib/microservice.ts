import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface TransactionMicroserviceProps {
  transactionTable: ITable;
}

export class TransactionMicroservice extends Construct {
  public readonly transactionMicroservice: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    props: TransactionMicroserviceProps
  ) {
    super(scope, id);
    this.transactionMicroservice = this.createTransactionMicroservice(
      props.transactionTable
    );
  }

  createTransactionMicroservice(transactionTable: ITable): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        PRIMARY_KEY: "id",
        DYNAMODB_TABLE_NAME: transactionTable.tableName,
        EVENT_SOURCE: "assets.transaction.process",
        EVENT_DETAILTYPE: "ProcessTransaction",
        EVENT_BUSNAME: "TransactionEventBus",
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const transactionMicroservice = new NodejsFunction(
      this,
      "transactionLambdaFunction",
      {
        entry: "./lambda/transaction/index.ts",
        ...nodeJsFunctionProps,
      }
    );

    transactionTable.grantReadWriteData(transactionMicroservice);

    return transactionMicroservice;
  }
}
