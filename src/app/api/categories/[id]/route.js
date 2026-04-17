import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = {}
    if (body.name !== undefined) data.name = body.name
    if (body.slug !== undefined) data.slug = body.slug
    if (body.description !== undefined) data.description = body.description
    if (body.accent !== undefined) data.accent = body.accent
    if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder

    const category = await prisma.category.update({
      where: { id },
      data,
    })
    return NextResponse.json({ success: true, data: category })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to delete category' }, { status: 500 })
  }
}
