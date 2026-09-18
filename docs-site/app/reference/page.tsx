/** Keep the reference root useful while the endpoint catalog lives on dedicated pages. */

import { redirect } from "next/navigation";

export default function ReferenceIndex() {
  redirect("/reference/routes/list");
}
