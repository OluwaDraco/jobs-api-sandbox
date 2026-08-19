import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.JOBS_TABLE!;

export const handler = async (event: any) => {
    const id = event.pathParameters?.id;
    const res = await doc.send(
        new GetCommand({ TableName: TABLE, Key: { pk: id } }),
    );

    if (!res.Item)
        return {
            statusCode: 404,
            body: JSON.stringify({ error: "not found" }),
        };
    return { statusCode: 200, body: JSON.stringify(res.Item) };
};
