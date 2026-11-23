import { NextRequest, NextResponse } from "next/server";
import { APPLICATIONS_STORE } from "@/lib/data/mock-db";
import { TaskCreateSchema } from "@/lib/validations/api-schemas";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = TaskCreateSchema.parse({
      ...body,
      application_id: params.id,
    });

    const app = APPLICATIONS_STORE.find((a) => a.id === params.id);
    if (!app) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Application not found" } },
        { status: 404 }
      );
    }

    const newTask = {
      id: `task-${Date.now()}`,
      application_id: params.id,
      title: validated.title,
      due_date: validated.due_date || new Date().toISOString().split("T")[0],
      priority: validated.priority,
      completed: false,
    };

    app.tasks.push(newTask);

    return NextResponse.json({
      success: true,
      data: newTask,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: err.message, details: err.errors },
      },
      { status: 400 }
    );
  }
}
