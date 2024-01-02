import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class DynamodbExerciseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define DynamoDB table
    const table = new dynamodb.Table(this, 'MusicDB', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });

    // Define lambda functions
    const readLambda = new lambda.Function(this, 'ReadFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'read.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: 'MusicDB',
      }
    });

    table.grantReadWriteData(readLambda);

    // Define API Gateway
    const api = new apigateway.RestApi(this, 'MusicAPI');
    const items = api.root.addResource('items');
    items.addMethod('GET', new apigateway.LambdaIntegration(readLambda));
  }
}
