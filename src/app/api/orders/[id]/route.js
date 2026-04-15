import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET single order
export async function GET(request, { params }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { product: true }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: order })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PATCH update order status
export async function PATCH(request, { params }) {
  try {
    const body = await request.json()
    const { status } = body

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: { product: true }
    })

    return NextResponse.json({ success: true, data: order })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update order status' },
      { status: 500 }
    )
  }
}