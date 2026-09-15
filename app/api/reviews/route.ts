import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');

    const where = all === 'true' ? {} : { approved: true };

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, rating, comment } = body;

    if (!customerName || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Customer name, rating, and comment are required' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        customerName,
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        comment,
        approved: true, // auto-approve so users see immediate social proof, can be moderated in admin
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to submit review', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, approved } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Review ID required' }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { approved: Boolean(approved) },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to update review', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Review ID required' }, { status: 400 });
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete review', details: error.message },
      { status: 500 }
    );
  }
}
