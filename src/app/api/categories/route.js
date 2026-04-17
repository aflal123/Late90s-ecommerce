import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json({ success: true, data: categories })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const slug = (body.slug || body.name)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description || '',
        accent: body.accent || '#c8a96e',
        sortOrder: body.sortOrder ?? 0,
      },
    })
    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, message: 'Category slug already exists' }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: 'Failed to create category' }, { status: 500 })
  }
}
