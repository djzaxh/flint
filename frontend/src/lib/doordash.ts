// Mock DoorDash API integration
// In a real implementation, this would use the actual DoorDash API

interface DoorDashOrder {
  id: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered";
  estimatedDeliveryTime: string;
  items: {
    id: number;
    name: string;
    restaurant: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  deliveryAddress: string;
}

// Mock function to simulate placing an order through DoorDash
export async function placeDoorDashOrder(
  mealId: number,
  mealName: string,
  restaurant: string,
  price: number,
  deliveryAddress: string = "123 Main St, Anytown, USA"
): Promise<DoorDashOrder> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate a random order ID
  const orderId = `DD-${Math.floor(Math.random() * 1000000)}`;

  // Calculate estimated delivery time (30-45 minutes from now)
  const now = new Date();
  const deliveryTime = new Date(
    now.getTime() + (30 + Math.floor(Math.random() * 15)) * 60000
  );
  const estimatedDeliveryTime = deliveryTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Create a mock order
  const order: DoorDashOrder = {
    id: orderId,
    status: "confirmed",
    estimatedDeliveryTime,
    items: [
      {
        id: mealId,
        name: mealName,
        restaurant,
        price,
        quantity: 1,
      },
    ],
    total: price + 5.99, // Add delivery fee
    deliveryAddress,
  };

  return order;
}

// Mock function to simulate tracking an order
export async function trackDoorDashOrder(
  orderId: string
): Promise<DoorDashOrder> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real implementation, this would fetch the order status from DoorDash
  // For now, we'll just return a mock order with a random status
  const statuses: DoorDashOrder["status"][] = [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
  ];

  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  // Calculate estimated delivery time (30-45 minutes from now)
  const now = new Date();
  const deliveryTime = new Date(
    now.getTime() + (30 + Math.floor(Math.random() * 15)) * 60000
  );
  const estimatedDeliveryTime = deliveryTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    id: orderId,
    status: randomStatus,
    estimatedDeliveryTime,
    items: [
      {
        id: 1,
        name: "Grilled Chicken Bowl",
        restaurant: "Protein Kitchen",
        price: 14.99,
        quantity: 1,
      },
    ],
    total: 20.98, // Price + delivery fee
    deliveryAddress: "123 Main St, Anytown, USA",
  };
}
