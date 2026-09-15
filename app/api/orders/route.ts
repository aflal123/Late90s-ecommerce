import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateWhatsAppOrderUrl, generateBatchWhatsAppOrderUrl } from '@/lib/whatsapp';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productId,
      customerName,
      customerPhone,
      size,
      quantity = 1,
      address,
      notes,
      items, // optional batch items from cart
    } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Customer name and phone are required' },
        { status: 400 }
      );
    }

    // Upsert customer user record
    try {
      await prisma.user.upsert({
        where: { phone: customerPhone },
        update: { name: customerName },
        create: { phone: customerPhone, name: customerName },
      });
    } catch (uErr) {
      console.warn('User upsert notice:', uErr);
    }

    // Case 1: Single item instant WhatsApp order
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }

      const numQty = parseInt(quantity as any) || 1;
      const totalPrice = product.price * numQty;

      const order = await prisma.order.create({
        data: {
          productId,
          customerName,
          customerPhone,
          size: size || (product.sizes && product.sizes[0]) || 'M',
          quantity: numQty,
          totalPrice,
          status: 'pending',
        },
      });

      const whatsappUrl = generateWhatsAppOrderUrl({
        orderId: order.id,
        productName: product.name,
        size: order.size,
        quantity: order.quantity,
        price: product.price,
        totalPrice: order.totalPrice,
        customerName,
        customerPhone,
        address,
        notes,
      });

      return NextResponse.json({
        success: true,
        order,
        whatsappUrl,
      });
    }

    // Case 2: Multi-item Cart Checkout
    if (items && Array.isArray(items) && items.length > 0) {
      const createdOrders = [];
      let grandTotal = 0;
      const formattedItems = [];

      for (const item of items) {
        const prod = await prisma.product.findUnique({ where: { id: item.productId } });
        if (prod) {
          const itemTotal = prod.price * (item.quantity || 1);
          grandTotal += itemTotal;

          const ord = await prisma.order.create({
            data: {
              productId: prod.id,
              customerName,
              customerPhone,
              size: item.size || 'M',
              quantity: item.quantity || 1,
              totalPrice: itemTotal,
              status: 'pending',
            },
          });
          createdOrders.push(ord);
          formattedItems.push({
            name: prod.name,
            size: item.size || 'M',
            quantity: item.quantity || 1,
            price: prod.price,
          });
        }
      }

      const primaryOrderRef = createdOrders[0]?.id;
      const whatsappUrl = generateBatchWhatsAppOrderUrl(
        formattedItems,
        { name: customerName, phone: customerPhone, address, notes },
        grandTotal,
        primaryOrderRef
      );

      return NextResponse.json({
        success: true,
        orders: createdOrders,
        whatsappUrl,
      });
    }

    return NextResponse.json(
      { success: false, error: 'No product or cart items provided' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}
