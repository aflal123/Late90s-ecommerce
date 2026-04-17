import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure inline to make sure env vars are picked up at runtime
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})


export async function POST(request) {
  try {
    // Check Cloudinary config is present
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Cloudinary not configured — check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET env vars' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert buffer to base64 data URL for Cloudinary
    const mime = file.type || 'image/jpeg'
    const base64 = `data:${mime};base64,${buffer.toString('base64')}`

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'late90s-products',
      resource_type: 'image',
    })

    return NextResponse.json({ success: true, url: result.secure_url })

  } catch (error) {
    console.error('Upload error:', error?.message || error)
    return NextResponse.json(
      { success: false, message: error?.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
