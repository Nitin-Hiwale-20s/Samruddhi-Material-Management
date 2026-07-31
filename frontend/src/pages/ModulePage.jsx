import { useParams } from "react-router-dom";
import DataTable from "../components/DataTable";
import modulesConfig from "../config/modulesConfig";

export default function ModulePage({ moduleKey }) {
  const params = useParams();
  const key = moduleKey || params.moduleKey;
  const config = modulesConfig[key];

  if (!config) return <p>Unknown module: {key}</p>;

  return <DataTable moduleKey={key} config={config} />;
}
