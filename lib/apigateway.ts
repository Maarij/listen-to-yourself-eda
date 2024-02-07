import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface TransactionApiGatewayProps {
  transactionApiMicroservice: IFunction;
}

export class TransactionApigateway extends Construct {
  constructor(scope: Construct, id: string, props: TransactionApiGatewayProps) {
    super(scope, id);
    this.createTransactionApi(props.transactionApiMicroservice);
  }

  private createTransactionApi(transactionApiMicroservice: IFunction) {
    const apigw = new LambdaRestApi(this, "transactionApi", {
      restApiName: "Transaction Service",
      handler: transactionApiMicroservice,
      proxy: false,
    });

    const transaction = apigw.root.addResource("transaction");
    transaction.addMethod("GET");
    transaction.addMethod("POST");

    const singleTransaction = transaction.addResource("{id}");
    singleTransaction.addMethod("GET");
    singleTransaction.addMethod("PUT");

    return apigw;
  }
}
