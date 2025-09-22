import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "API documentation for the E-commerce management system",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "649f1b2c34a8ef9876543210" },
            name: { type: "string", example: "Mohamed Ahmed" },
            email: { type: "string", example: "mohamed@example.com" },
          },
        },
        AuthRegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Mohamed Ahmed" },
            email: { type: "string", example: "mohamed@example.com" },
            password: { type: "string", example: "12345678" },
          },
        },
        AuthLoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "mohamed@example.com" },
            password: { type: "string", example: "12345678" },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64f123abc456" },
            name: { type: "string", example: "Nike Air Max" },
            description: {
              type: "string",
              example: "Comfortable running shoes",
            },
            price: { type: "number", example: 129.99 },
            avgRating: { type: "number", example: 4.5 },
            images: {
              type: "array",
              items: {
                type: "string",
                example: "https://example.com/image.jpg",
              },
            },
          },
        },
        CartInput: {
          type: "object",
          required: ["productId", "quantity"],
          properties: {
            productId: { type: "string", example: "64f123abc456" },
            quantity: { type: "integer", example: 2 },
          },
        },
        Cart: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6510e3b1b82a9a1234567890" },
            userId: { type: "string", example: "649f1b2c34a8ef9876543210" },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { $ref: "#/components/schemas/Product" },
                  quantity: { type: "integer", example: 2 },
                },
              },
            },
            totalPrice: { type: "number", example: 259.98 },
          },
        },
        WishlistInput: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "string", example: "64f123abc456" },
          },
        },
        Wishlist: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6520f4c2c82a9a1234567890" },
            userId: { type: "string", example: "649f1b2c34a8ef9876543210" },
            products: {
              type: "array",
              items: { $ref: "#/components/schemas/Product" },
            },
          },
        },
        ReviewInput: {
          type: "object",
          required: ["productId", "rating"],
          properties: {
            productId: { type: "string", example: "64f123abc456" },
            comment: { type: "string", example: "Great product!" },
            rating: { type: "integer", example: 5, minimum: 1, maximum: 5 },
          },
        },
        Review: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6530a5e2d82a9a1234567890" },
            userId: { $ref: "#/components/schemas/User" },
            productId: { type: "string", example: "64f123abc456" },
            comment: { type: "string", example: "Very good quality" },
            rating: { type: "integer", example: 4 },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6500d2f4b83f9c1234567890" },
            userId: { type: "string", example: "649f1b2c34a8ef9876543210" },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { type: "string", example: "64f123abc456" },
                  quantity: { type: "integer", example: 2 },
                },
              },
            },
            total_price: { type: "number", example: 199.99 },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "canceled"],
              example: "pending",
            },
          },
        },
        // ✅ Profile Schemas
        UpdateProfileInput: {
          type: "object",
          properties: {
            name: { type: "string", example: "Mohamed Ahmed" },
            phone: { type: "string", example: "+201234567890" },
          },
        },
        UpdatePasswordInput: {
          type: "object",
          required: ["oldPassword", "newPassword"],
          properties: {
            oldPassword: { type: "string", example: "oldPass123" },
            newPassword: { type: "string", example: "newPass456" },
          },
        },
        ResetPasswordInput: {
          type: "object",
          required: ["otp", "newPassword"],
          properties: {
            otp: { type: "string", example: "123456" },
            newPassword: { type: "string", example: "resetPass123" },
          },
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/modules/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  // واجهة Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // ✅ endpoint يديك JSON مباشرة
  app.get("/api-docs-json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};
