import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';

describe('ProductService', () => {
  let service: ProductService;

  const mockPrisma = {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockHttpService = {};

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          ProductService,
          {
            provide: PrismaService,
            useValue: mockPrisma,
          },
          {
            provide: HttpService,
            useValue: mockHttpService,
          },
        ],
      }).compile();
     
    service =
      module.get<ProductService>(
        ProductService,
      );
  });

  it('should return paginated products', async () => {
    mockPrisma.product.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'iPhone 16',
      },
    ]);

    mockPrisma.product.count.mockResolvedValue(
      1,
    );

    const result =
      await service.findAll(1, 10);

    expect(result.meta.total).toBe(1);
    expect(result.data.length).toBe(1);
  });
});