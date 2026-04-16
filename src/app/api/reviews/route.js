import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, data: reviews })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { customerName, rating, comment } = body

    if (!customerName || !rating || !comment) {
      return NextResponse.json({ success: false, message: 'All fields required' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, message: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: { customerName, rating: parseInt(rating), comment, approved: true }
    })

    return NextResponse.json({ success: true, data: review }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to submit review' }, { status: 500 })
  }
}
