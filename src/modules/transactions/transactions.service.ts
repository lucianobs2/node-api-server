import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repository';
import { ValidateBankAccountOwnershipService } from '../bank-accounts/services/validate-bank-account-ownership.service';
import { ValidateCategoryOwnershipService } from '../categories/services/validate-category-ownership.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly validateBankAccountOwnershipService: ValidateBankAccountOwnershipService,
    private readonly validateCategoryOwnershipService: ValidateCategoryOwnershipService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { bankAccountId, categoryId, name, date, type, value } =
      createTransactionDto;

    await this.validateEntitiesOwnership({
      userId,
      categoryId,
      bankAccountId,
    });

    return await this.transactionsRepository.create({
      data: {
        userId,
        bankAccountId,
        categoryId,
        name,
        date,
        type,
        value,
      },
    });
  }

  async findAllByUserId(userId: string) {
    return this.transactionsRepository.findMany({
      where: { userId },
    });
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  private async validateEntitiesOwnership({
    userId,
    categoryId,
    bankAccountId,
  }: {
    userId: string;
    categoryId: string;
    bankAccountId: string;
  }) {
    await Promise.all([
      this.validateBankAccountOwnershipService.validate(userId, bankAccountId),
      this.validateCategoryOwnershipService.validate(userId, categoryId),
    ]);
  }
}
