import { prisma } from "@/lib/prisma";

const SETTINGS_ID = "singleton";
const DEFAULT_PASS_THRESHOLD = 70;

export async function getPassThreshold(): Promise<number> {
  const settings = await prisma.systemSetting.findUnique({ where: { id: SETTINGS_ID } });
  return settings?.passThreshold ?? DEFAULT_PASS_THRESHOLD;
}

export async function updatePassThreshold(value: number) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error("Pass threshold must be a number between 0 and 100.");
  }
  await prisma.systemSetting.upsert({
    where: { id: SETTINGS_ID },
    update: { passThreshold: value },
    create: { id: SETTINGS_ID, passThreshold: value },
  });
}
