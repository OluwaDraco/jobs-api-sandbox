import * as cdk from "aws-cdk-lib/core";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as lambdaNode from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigw from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { HttpIamAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";

export class JobsApiSandboxStack extends cdk.Stack {
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
        const fn = (name: string, entry: string) =>
            new lambdaNode.NodejsFunction(this, name, {
                entry: `src/handlers/${entry}.ts`,
                environment: { JOBS_TABLE: jobsTable.tableName },
            });

        const list = fn("ListJobs", "listJobs");
        const get = fn("GetJob", "getJob");
        const create = fn("CreateJob", "createJob");

        jobsTable.grantReadData(list);
        jobsTable.grantReadData(get);
        jobsTable.grantWriteData(create);

        const api = new apigw.HttpApi(this, "JobsApi");

        api.addRoutes({
            path: "/jobs",
            methods: [apigw.HttpMethod.GET],
            integration: new HttpLambdaIntegration("ListInt", list),
            authorizer: new HttpIamAuthorizer(),
        });

        new cdk.CfnOutput(this, "JobsTableName", {
            value: jobsTable.tableName,
        });
    }
}
