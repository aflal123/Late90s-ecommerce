import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featuredOnly = searchParams.get('featured') === 'true'

    const where = {}
    if (category) where.category = category
    if (featuredOnly) where.featured = true

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
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
        inStock: body.inStock ?? true,
        featured: body.featured ?? false
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