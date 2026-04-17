import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET single product
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: product })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT update product
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, price, image, category, sizes, inStock, featured } = body

    const existing = await prisma.product.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        price: price ? parseFloat(price) : existing.price,
        image: image ?? existing.image,
        category: category ?? existing.category,
        sizes: sizes ?? existing.sizes,
        inStock: inStock ?? existing.inStock,
        featured: featured !== undefined ? featured : existing.featured
      }
    })

    return NextResponse.json({ success: true, data: updated })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE product
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    const existing = await prisma.product.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete related orders first (foreign key constraint)
    await prisma.order.deleteMany({ where: { productId: id } })

    await prisma.product.delete({ where: { id } })

    return NextResponse.json(
      { success: true, message: 'Product deleted successfully' }
    )

  } catch (error) {
    console.error('Delete product error:', error?.message)
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}