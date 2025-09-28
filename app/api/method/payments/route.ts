import { type NextRequest, NextResponse } from "next/server"
import { methodAPI } from "@/lib/method-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const holderId = searchParams.get("holder_id")

    if (!holderId) {
      return NextResponse.json({ error: "holder_id is required" }, { status: 400 })
    }

    const payments = await methodAPI.getPayments(holderId)
    return NextResponse.json({ data: payments })
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, destination, amount, description } = body

    if (!source || !destination || !amount) {
      return NextResponse.json({ error: "source, destination, and amount are required" }, { status: 400 })
    }

    const payment = await methodAPI.createPayment(source, destination, amount, description)
    return NextResponse.json({ data: payment })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
