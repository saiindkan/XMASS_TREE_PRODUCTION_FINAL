import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      cartId?: number | null;  // Add cartId here
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    cartId?: number | null;  // Add cartId here
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    cartId?: number | null;  // Add cartId here if needed
  }
}