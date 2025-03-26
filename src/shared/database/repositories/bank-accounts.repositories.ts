import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class BankAccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createBankAccountDto: Prisma.BankAccountCreateArgs) {
    return await this.prismaService.bankAccount.create(createBankAccountDto);
  }

  async update(updateDto: Prisma.BankAccountUpdateArgs) {
    return this.prismaService.bankAccount.update(updateDto);
  }

  async findMany<T extends Prisma.BankAccountFindManyArgs>(
    findManyDto: Prisma.SelectSubset<T, Prisma.BankAccountFindManyArgs>,
  ) {
    return await this.prismaService.bankAccount.findMany(findManyDto);
  }

  async findFirst(findFirstDto: Prisma.BankAccountFindFirstArgs) {
    return await this.prismaService.bankAccount.findFirst(findFirstDto);
  }

  async delete(deleteDto: Prisma.BankAccountDeleteArgs) {
    return await this.prismaService.bankAccount.delete(deleteDto);
  }
}
