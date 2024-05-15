// -------------------------------- Import Modules ---------------------------------
// External
import { NextRequest, NextResponse } from "next/server";

// Internal
import { isValidPassword } from "./lib/isValidPassword";

// ----------------------------------- Functions -----------------------------------
// Return unathorized if the user admin request is not authenticated
export async function middleware(req: NextRequest) {
  if ((await isAuthenticated(req)) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }
}

// Check if the user request is authenticated
async function isAuthenticated(req: NextRequest) {
  // get the request header
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  // if the header doesn't exist, return false
  if (authHeader == null) return false;

  // get the username and password from the header, the second string is needed
  // username:[some_string] password:[some_string]
  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  // return true if the entered username and password are equal to the admin's username and password
  return (
    username === process.env.ADMIN_USERNAME &&
    (await isValidPassword(
      password,
      process.env.HASHED_ADMIN_PASSWORD as string
    ))
  );
}

// path for the admin
export const config = {
  matcher: "/admin/:path*",
};
