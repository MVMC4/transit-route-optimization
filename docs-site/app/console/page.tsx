/** Authenticated API credential, quota, cost, and activity page. */

import { DeveloperConsole } from "../../components/developer-console";
import { FumadocsShell } from "../../components/fumadocs-shell";

export default function ConsolePage() {
  return <FumadocsShell><article className="console-page"><DeveloperConsole /></article></FumadocsShell>;
}
