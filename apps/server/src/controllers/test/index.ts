import { client, AdminType } from "@repo/db/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { ADMIN_JWT_PASSWORD } from "../../routes/config";

type TAdminType = "Creator" | "SuperAdmin";
export async function createAdmin(
  number: string,
  name: string,
  type: TAdminType
): Promise<string> {
  const admin = await client.admin.create({
    data: {
      number,
      name,
      verified: true,
      type,
    },
  });

  const token = jwt.sign(
    {
      adminId: admin.id,
    },
    ADMIN_JWT_PASSWORD
  );
  return token;
}
