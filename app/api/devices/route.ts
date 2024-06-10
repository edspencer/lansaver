import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

import { ZodError } from "zod";
import { createDevice } from "@/app/models/device";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log(body);

    const data = {
      type: body.type,
      hostname: body.hostname,
      credentials: body.credentials,
    } as Prisma.DeviceCreateInput;
    const device = await createDevice(data);

    revalidatePath("/devices");

    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create device" }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { type, hostname, credentials } = body;

//     if (!type || !hostname || !credentials) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const newDevice = await prisma.device.create({
//       data: {
//         type,
//         hostname,
//         credentials,
//       },
//     });

//     return NextResponse.json(newDevice, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to create device" }, { status: 500 });
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const device = await prisma.device.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!device) {
        return NextResponse.json({ error: "Device not found" }, { status: 404 });
      }

      return NextResponse.json(device, { status: 200 });
    } else {
      const devices = await prisma.device.findMany();

      return NextResponse.json(devices, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, type, hostname, credentials } = body;

    if (!id || !type || !hostname || !credentials) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedDevice = await prisma.device.update({
      where: { id: parseInt(id, 10) },
      data: {
        type,
        hostname,
        credentials,
      },
    });

    return NextResponse.json(updatedDevice, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update device" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }

    await prisma.device.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: "Device deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete device" }, { status: 500 });
  }
}
