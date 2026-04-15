import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: orders })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { productId, customerName, customerPhone, size, quantity } = body

    if (!productId || !customerName || !customerPhone || !size || !quantity) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    if (!product.inStock) {
      return NextResponse.json(
        { success: false, message: 'Product is out of stock' },
        { status: 400 }
      )
    }

    const totalPrice = product.price * quantity

    const order = await prisma.order.create({
      data: {
        productId,
        customerName,
        customerPhone,
        size,
        quantity: parseInt(quantity),
        totalPrice,
        status: 'pending'
      },
      include: { product: true }
    })

    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    )

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create order' },
      { status: 500 }
    )
  }
}