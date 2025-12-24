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
        'X-API-Key': 'chv_eRQ6_bacefdd4fd74890312e4ac0fd3fc0b210ab09922319a634220009aa5d7babccf_78585c04528c1b967f482cd28c0eacf830b9ae2d8f080d0914e68866da545908',
      }
    })

    return NextResponse.json(response.data)
  } catch (err) {
  const error = err as Error
  console.error('Upload error:', error)
  return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
}
}
