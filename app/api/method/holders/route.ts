import { type NextRequest, NextResponse } from "next/server"
import { methodAPI } from "@/lib/method-api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { first_name, last_name, email, phone } = body

    if (!first_name || !last_name || !email) {
      return NextResponse.json({ error: "first_name, last_name, and email are required" }, { status: 400 })
    }

    const holder = await methodAPI.createHolder(first_name, last_name, email, phone || "")
    return NextResponse.json({ data: holder })
  } catch (error) {
    console.error("Error creating holder:", error)
    return NextResponse.json({ error: "Failed to create holder" }, { status: 500 })
  }
}
