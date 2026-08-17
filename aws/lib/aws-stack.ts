import * as cdk from "aws-cdk-lib/core";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const jobsTable = new dynamodb.Table(this, "JobsTable", {
            partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            stream: dynamodb.StreamViewType.NEW_IMAGE,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        jobsTable.addGlobalSecondaryIndex({
            indexName: "by-posted",
            partitionKey: {
                name: "gsi1pk",
                type: dynamodb.AttributeType.STRING,
            },
            sortKey: { name: "posted_at", type: dynamodb.AttributeType.STRING },
        });

        new cdk.CfnOutput(this, "JobsTableName", {
            value: jobsTable.tableName,
        });
    }
}
