export interface OrderDetails {
  orderId?: string;
  productName: string;
  size: string;
  quantity: number;
  price: number;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  address?: string;
  notes?: string;
}

export function generateWhatsAppOrderUrl(order: OrderDetails, whatsappNumber?: string): string {
  const phone = whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  // Clean phone number: remove +, -, spaces
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const dateStr = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const messageLines = [
    `🔥 *NEW ORDER - LATE90S ARCHIVE* 🔥`,
    `----------------------------------------`,
    order.orderId ? `📦 *Order Ref:* #${order.orderId.slice(-6).toUpperCase()}` : `📦 *Order:* Web Instant Checkout`,
    `🕒 *Date:* ${dateStr}`,
    `----------------------------------------`,
    `👕 *Product:* ${order.productName}`,
    `📏 *Size:* ${order.size}`,
    `🔢 *Quantity:* ${order.quantity}`,
    `💰 *Price:* ₹${order.price} each`,
    `💵 *Total Amount:* *₹${order.totalPrice}*`,
    `----------------------------------------`,
    `👤 *Customer Info:*`,
    `• *Name:* ${order.customerName}`,
    `• *Phone:* ${order.customerPhone}`,
    order.address ? `• *Delivery Address:* ${order.address}` : '',
    order.notes ? `• *Special Notes:* ${order.notes}` : '',
    `----------------------------------------`,
    `⚡ _Please confirm this order & send payment / delivery updates._`,
  ].filter(Boolean);

  const encodedMessage = encodeURIComponent(messageLines.join('\n'));
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function generateBatchWhatsAppOrderUrl(
  items: Array<{ name: string; size: string; quantity: number; price: number }>,
  customerInfo: { name: string; phone: string; address?: string; notes?: string },
  totalAmount: number,
  orderRef?: string,
  whatsappNumber?: string
): string {
  const phone = whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const dateStr = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsList = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}* (Size: ${item.size}) × ${item.quantity} = ₹${item.price * item.quantity}`
    )
    .join('\n');

  const messageLines = [
    `🔥 *CART ORDER - LATE90S ARCHIVE* 🔥`,
    `----------------------------------------`,
    orderRef ? `📦 *Order Ref:* #${orderRef.slice(-6).toUpperCase()}` : `📦 *Order:* Web Cart Checkout`,
    `🕒 *Date:* ${dateStr}`,
    `----------------------------------------`,
    `🛒 *Items Ordered:*`,
    itemsList,
    `----------------------------------------`,
    `💵 *Grand Total:* *₹${totalAmount}*`,
    `----------------------------------------`,
    `👤 *Customer Info:*`,
    `• *Name:* ${customerInfo.name}`,
    `• *Phone:* ${customerInfo.phone}`,
    customerInfo.address ? `• *Delivery Address:* ${customerInfo.address}` : '',
    customerInfo.notes ? `• *Special Notes:* ${customerInfo.notes}` : '',
    `----------------------------------------`,
    `⚡ _Please confirm this order & share payment details._`,
  ].filter(Boolean);

  const encodedMessage = encodeURIComponent(messageLines.join('\n'));
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
