import DataBase from "../../../../infra/database";

async function status(request, response) {
  const result = await DataBase.query("SELECT 1 + 1;");
  response.status(200).json("status");
}

export default status;
