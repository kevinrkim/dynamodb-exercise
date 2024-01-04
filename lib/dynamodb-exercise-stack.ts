import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class DynamodbExerciseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // setup DynamoDB table
    const songTable = new dynamodb.Table(this, 'SongTable', {
      tableName: 'song-table',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
    });

    // setup rest API
    const songApi = new apigateway.RestApi(this, 'SongApi', {
      restApiName: 'Song Service',
      description: 'This service serves songs.',
      deploy: true
    });

    // setup Lambda functions
    const createSongLambda = new lambda.Function(this, 'CreateSongLambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.createHandler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/create-song')),
      environment: {
        SONG_TABLE_NAME: songTable.tableName
      }
    });

    const getSongLambda = new lambda.Function(this, 'GetSongLambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.getHandler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/get-song')),
      environment: {
        SONG_TABLE_NAME: songTable.tableName
      }
    });

    const updateSongLambda = new lambda.Function(this, 'UpdateSongLambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.updateHandler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/update-song')),
      environment: {
        SONG_TABLE_NAME: songTable.tableName
      }
    });

    const deleteSongLambda = new lambda.Function(this, 'DeleteSongLambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.deleteHandler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/delete-song')),
      environment: {
        SONG_TABLE_NAME: songTable.tableName
      }
    });

    const allSongsLambda = new lambda.Function(this, 'AllSongsLambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.allHandler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../functions/all-songs')),
      environment: {
        SONG_TABLE_NAME: songTable.tableName
      }
    });

    // connect Lambda functions to API Gateway
    const songServiceResource = songApi.root.addResource('song');

    songServiceResource.addMethod('POST', new apigateway.LambdaIntegration(createSongLambda), {
      apiKeyRequired: false
    });

    songServiceResource.addMethod('GET', new apigateway.LambdaIntegration(allSongsLambda), {
      apiKeyRequired: false
    });

    const singleSongResource = songServiceResource.addResource('{id}');

    singleSongResource.addMethod('GET', new apigateway.LambdaIntegration(getSongLambda), {
      apiKeyRequired: false
    });

    singleSongResource.addMethod('PUT', new apigateway.LambdaIntegration(updateSongLambda), {
      apiKeyRequired: false
    });

    singleSongResource.addMethod('DELETE', new apigateway.LambdaIntegration(deleteSongLambda), {
      apiKeyRequired: false
    });

    // grant permissions
    songTable.grantReadWriteData(createSongLambda);
    songTable.grantReadWriteData(getSongLambda);
    songTable.grantReadWriteData(updateSongLambda);
    songTable.grantReadWriteData(deleteSongLambda);
    songTable.grantReadWriteData(allSongsLambda);

  }
}
