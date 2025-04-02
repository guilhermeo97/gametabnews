import { version } from "react";
import DataBase from "../../../../infra/database";

async function status(request, response) {
  const dataBaseName = process.env.POSTGRES_DB;
  const updateAt = new Date().toISOString();
  const databaseVersionResult = await DataBase.query("SHOW server_version;");
  const databaseMaxConnectionsResult = await DataBase.query(
    "SHOW max_connections;",
  );
  const databaseOpenedConnectionsResult = await DataBase.query({
    text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [dataBaseName],
  });
  const databaseVersionResultValue =
    databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionResultValue,
        max_connections: +databaseMaxConnectionsValue,
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
