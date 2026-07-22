import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;

  // This is our fake "Mock Database"
  const mockPrisma = {
    product: {
      findUnique: jest.fn(),
    },
    cartItem: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Scenario 1: Adding a completely new item to the cart (Success Case)', () => {
    it('should create a new cart item if it does not exist', async () => {
      // Setup the fake database responses
      mockPrisma.product.findUnique.mockResolvedValue({ id: 1, stock: 10 });
      mockPrisma.cartItem.findFirst.mockResolvedValue(null);
      mockPrisma.cartItem.create.mockResolvedValue({ id: 1, userId: 1, productId: 1, quantity: 2 });

      // Run the actual service function
      const result = await service.addToCart(1, { productId: 1, quantity: 2 });

      // Verify what happened
      expect(mockPrisma.cartItem.create).toHaveBeenCalledWith({
        data: { userId: 1, productId: 1, quantity: 2 },
      });
      expect(result).toEqual({ id: 1, userId: 1, productId: 1, quantity: 2 });
    });
  });

  describe('Scenario 2: Adding an item that exceeds stock limits (Failure Case)', () => {
    it('should throw BadRequestException if quantity exceeds available stock', async () => {
      // Tell the fake database we only have 5 laptops in stock
      mockPrisma.product.findUnique.mockResolvedValue({ id: 1, stock: 5 });
      mockPrisma.cartItem.findFirst.mockResolvedValue(null);

      // We expect the app to immediately throw an error when we try to add 10 laptops
      await expect(service.addToCart(1, { productId: 1, quantity: 10 })).rejects.toThrow(
        new BadRequestException('Cannot add more than available stock (5)'),
      );
      
      // And we expect the database was NEVER told to create the item
      expect(mockPrisma.cartItem.create).not.toHaveBeenCalled();
    });
  });

  describe('Scenario 3: Adding an item that already exists in the cart (Success Case)', () => {
    it('should update the quantity of the existing cart item', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 1, stock: 10 });
      mockPrisma.cartItem.findFirst.mockResolvedValue({ id: 1, userId: 1, productId: 1, quantity: 2 });
      mockPrisma.cartItem.update.mockResolvedValue({ id: 1, userId: 1, productId: 1, quantity: 4 });

      // The user adds 2 MORE laptops to the cart
      const result = await service.addToCart(1, { productId: 1, quantity: 2 });

      // Verify that it UPDATED the existing item instead of creating a new one
      expect(mockPrisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { quantity: 4 },
      });
      expect(result).toEqual({ id: 1, userId: 1, productId: 1, quantity: 4 });
    });
  });

  describe('Scenario 4: Updating a cart item quantity beyond stock (Failure Case)', () => {
    it('should throw BadRequestException if new quantity exceeds stock', async () => {
      // The user already has 2 laptops in their cart, and the store only has 5 total
      mockPrisma.cartItem.findFirst.mockResolvedValue({
        id: 1,
        userId: 1,
        productId: 1,
        quantity: 2,
        product: { stock: 5 },
      });

      // User tries to change their cart quantity to 10
      await expect(service.updateCartItem(1, 1, 10)).rejects.toThrow(
        new BadRequestException('Cannot update quantity beyond available stock (5)'),
      );
      
      // Database update was blocked
      expect(mockPrisma.cartItem.update).not.toHaveBeenCalled();
    });
  });
});
