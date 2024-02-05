import { RemovalPolicy } from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  ITable,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class TransactionDatabase extends Construct {
  public readonly transactionTable: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.transactionTable = this.createTransactionTable();
  }

  private createTransactionTable(): ITable {
    return new Table(this, "transaction", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: "transaction",
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
  }
}
