/** Authenticated API credential, quota, cost, and activity page. */

import { DeveloperConsole } from "../../components/developer-console";
import { DocsShell } from "../../components/docs-shell";

export default function ConsolePage() {
  return <DocsShell active="console"><article className="console-page"><DeveloperConsole /></article></DocsShell>;
}
