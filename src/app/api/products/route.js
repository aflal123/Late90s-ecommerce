import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: products
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch products'
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        image: body.image,
        category: body.category,
        sizes: body.sizes,
        inStock: body.inStock ?? true
      }
    })

    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create product'
    }, { status: 500 })
  }
}