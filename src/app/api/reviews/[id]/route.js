import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    const existing = await prisma.review.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 })
    }

    await prisma.review.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Review deleted' })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete review' }, { status: 500 })
  }
}
