// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import FormData from 'form-data'
import axios from 'axios'
import { Readable } from 'stream'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('source') as File

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'ไม่พบไฟล์ที่อัปโหลด' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // แปลง File เป็น Readable stream
    const stream = Readable.from(buffer)

    const forwardForm = new FormData()
    forwardForm.append('source', stream, {
      filename: file.name,
      contentType: file.type,
      knownLength: buffer.length,
    })

    const response = await axios.post('https://pic.in.th/api/1/upload', forwardForm, {
      headers: {
        ...forwardForm.getHeaders(),
        'X-API-Key': 'chv_gy3p_1aea325cdccad12841ae39695535b1231c0d1fb81821632d423d888eac29c99d6a6d9b6f94d9e06d51f4b92fcb87df0a94e70c8bfce7cab11ffb28a998a41a31',
      }
    })

    return NextResponse.json(response.data)
  } catch (err) {
  const error = err as Error
  console.error('Upload error:', error)
  return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
}
}
