import { type NextRequest, NextResponse } from "next/server"
import { methodAPI } from "@/lib/method-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const holderId = searchParams.get("holder_id")

    if (!holderId) {
      return NextResponse.json({ error: "holder_id is required" }, { status: 400 })
    }

    const accounts = await methodAPI.getAccounts(holderId)
    return NextResponse.json({ data: accounts })
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { holder_id, account_type } = body

    if (!holder_id || !account_type) {
      return NextResponse.json({ error: "holder_id and account_type are required" }, { status: 400 })
    }

    // For demo purposes, simulate account connection
    const account = await methodAPI.simulateAccountConnection(holder_id, account_type)
    return NextResponse.json({ data: account })
  } catch (error) {
    console.error("Error creating account connection:", error)
    return NextResponse.json({ error: "Failed to connect account" }, { status: 500 })
  }
}
