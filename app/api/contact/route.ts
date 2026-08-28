import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, company, email, message } = body

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'First name, last name, email, and message are required.' },
        { status: 400 }
      )
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(String(email))) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        firstName: String(firstName),
        lastName: String(lastName),
        company: company ? String(company) : null,
        email: String(email),
        message: String(message),
      },
    })

    return NextResponse.json(inquiry, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit inquiry.' },
      { status: 500 }
    )
  }
}
