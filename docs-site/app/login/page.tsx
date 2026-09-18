/** Preserve the old sign-in URL while routing access through the public developer portal. */

import { redirect } from "next/navigation";

export default function LoginPage() {
  redirect("/?next=%2Fconsole#access");
}
