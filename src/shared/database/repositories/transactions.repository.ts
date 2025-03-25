import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTransactionDto: Prisma.TransactionCreateArgs) {
    return await this.prismaService.transaction.create(createTransactionDto);
  }

  async update(updateDto: Prisma.TransactionUpdateArgs) {
    return this.prismaService.transaction.update(updateDto);
  }

  async findMany(findManyDto: Prisma.TransactionFindManyArgs) {
    return await this.prismaService.transaction.findMany(findManyDto);
  }

  async findFirst(findFirstDto: Prisma.TransactionFindFirstArgs) {
    return await this.prismaService.transaction.findFirst(findFirstDto);
  }

  async delete(deleteDto: Prisma.TransactionDeleteArgs) {
    return await this.prismaService.transaction.delete(deleteDto);
  }
}
