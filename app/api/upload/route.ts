import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    fs.mkdirSync(uploadsDir, { recursive: true })

    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const uniqueName = `${Date.now()}_${originalName}`
    const filePath = path.join(uploadsDir, uniqueName)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    fs.writeFileSync(filePath, buffer)

    return NextResponse.json({
      url: `/uploads/${uniqueName}`,
      name: file.name,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
