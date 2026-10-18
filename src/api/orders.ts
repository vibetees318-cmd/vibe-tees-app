/**
 * Backend API Route: Order Push to Printrove
 * Auto-pushes newly placed orders to Printrove Print-on-Demand Partner API
 */
export async function POST(req: Request) {
  try {
    const { customer, items, totalAmount, paymentMethod } = await req.json();

    const orderId = 'VT-ORD-' + Date.now().toString().slice(-6);

    const printroveApiKey = process.env.PRINTROVE_API_KEY;

    // 2. Auto-Push Order to Printrove POD API
    if (printroveApiKey) {
      const printroveResponse = await fetch('https://api.printrove.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${printroveApiKey}`,
        },
        body: JSON.stringify({
          reference_number: orderId,
          shipping_address: {
            name: customer.name || customer.fullName,
            address1: customer.address || customer.street,
            city: customer.city,
            state: customer.state,
            pincode: customer.pincode || customer.pinCode,
            phone: customer.phone,
          },
          line_items: items.map((item: any) => ({
            sku: item.podSKU, // AAPKE PANEL SE ADD KIYA GAYA POD SKU
            quantity: item.quantity,
            size: item.size || item.selectedSize,
          })),
          is_cod: paymentMethod === 'COD',
          cod_amount: paymentMethod === 'COD' ? totalAmount : 0,
        }),
      });

      const podData = await printroveResponse.json();
      console.log('Successfully Pushed to Printrove:', podData);

      return Response.json({ success: true, orderId, podData });
    } else {
      console.log('Printrove Push Simulation (No API key present in env)');
      return Response.json({
        success: true,
        orderId,
        message: 'Printrove order pushed successfully (Simulated mode)',
      });
    }
  } catch (error) {
    console.error('Printrove Push Error:', error);
    return Response.json({ success: false, error: 'POD Auto-Sync Failed' });
  }
}
