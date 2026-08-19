import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.JOBS_TABLE!;

export const handler = async () => {
    const res = await doc.send(
        new QueryCommand({
            TableName: TABLE,
            IndexName: "by-posted",
            KeyConditionExpression: "gsi1pk = :p",
            ExpressionAttributeValues: { ":p": "JOB" },
            ScanIndexForward: false,
            Limit: 20,
        }),
    );

    return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jobs: res.Items ?? [] }),
    };
};
