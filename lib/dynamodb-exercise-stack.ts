import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { aws_apigatewayv2 as apigw, aws_apigatewayv2_integrations as apigwIntegrations } from 'aws-cdk-lib';

export class DynamodbExerciseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // dynamodb table
    const table = new cdk.aws_dynamodb.Table(this, 'SongApiTable', {
      partitionKey: { name: 'id', type: cdk.aws_dynamodb.AttributeType.STRING },
      tableName: 'song-items',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // lambda function
    const songLambda = new lambda.Function(this, 'SongApiFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      functionName: 'song-function',
    });

    // grant lambda permissions
    table.grantReadWriteData(songLambda);

    // api gateway
    const api = new apigw.HttpApi(this, 'SongApi', {
      apiName: 'song-api',
    });

    // lambda proxy
    const lambdaIntegration = new apigwIntegrations.HttpLambdaIntegration('LambdaIntegration', songLambda);

    // api gateway routes
    api.addRoutes({
      path: '/songs',
      methods: [apigw.HttpMethod.GET],
      integration: lambdaIntegration,
    });

    api.addRoutes({
      path: '/songs/{id}',
      methods: [apigw.HttpMethod.GET],
      integration: lambdaIntegration,
    });

    api.addRoutes({
      path: '/songs',
      methods: [apigw.HttpMethod.POST],
      integration: lambdaIntegration,
    });

    api.addRoutes({
      path: '/songs/{id}',
      methods: [apigw.HttpMethod.PUT],
      integration: lambdaIntegration,
    });

    api.addRoutes({
      path: '/songs/{id}',
      methods: [apigw.HttpMethod.DELETE],
      integration: lambdaIntegration,
    });

    new cdk.CfnOutput(this, 'APIGatewayEndpoint', {
      exportName: 'APIGatewayEndpoint',
      value: api.apiEndpoint,
      description: 'API Gateway Endpoint',
    });
    
  }
}
