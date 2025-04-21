// utils/checkAdminSession.js
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function checkAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 1) {
    redirect("/login");
  }

  return session;
}
