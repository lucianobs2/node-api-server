import { Injectable } from '@nestjs/common';
import { ValidateBankAccountOwnershipService } from 'src/modules/bank-accounts/services/validate-bank-account-ownership.service';
import { ValidateCategoryOwnershipService } from 'src/modules/categories/services/validate-category-ownership.service';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ValidateTransactionOwnershipService } from './validate-transaction-ownership.service';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { lastDayOfMonth, setHours, startOfMonth } from 'date-fns';
import { TransactionType } from '../entities/transaction';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly validateBankAccountOwnershipService: ValidateBankAccountOwnershipService,
    private readonly validateCategoryOwnershipService: ValidateCategoryOwnershipService,
    private readonly validateTransactionOwnershipService: ValidateTransactionOwnershipService,
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

  async findAllByUserId(
    userId: string,
    filters: {
      year: number;
      month: number;
      bankAccountId?: string;
      type?: TransactionType;
    },
  ) {
    const FIRST_HOUR_OF_DAY_BRAZILIAN_UTC = -3;

    const FIRST_DAY_OF_MONTH = setHours(
      startOfMonth(new Date(Date.UTC(filters.year, filters.month, null))),
      FIRST_HOUR_OF_DAY_BRAZILIAN_UTC,
    );

    const LAST_DAY_OF_MONTH = setHours(
      lastDayOfMonth(new Date(filters.year, filters.month, null)),
      FIRST_HOUR_OF_DAY_BRAZILIAN_UTC,
    );

    return await this.transactionsRepository.findMany({
      where: {
        userId,
        bankAccountId: filters.bankAccountId,
        type: filters.type,
        date: {
          gte: FIRST_DAY_OF_MONTH,
          lte: LAST_DAY_OF_MONTH,
        },
      },
    });
  }

  async update(
    userId: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const { bankAccountId, categoryId, date, name, type, value } =
      updateTransactionDto;

    await this.validateEntitiesOwnership({
      userId,
      bankAccountId,
      categoryId,
      transactionId,
    });

    return await this.transactionsRepository.update({
      where: { id: transactionId },
      data: {
        bankAccountId,
        categoryId,
        date,
        name,
        type,
        value,
      },
    });
  }

  async remove(userId: string, transactionId: string) {
    await this.validateEntitiesOwnership({
      userId,
      transactionId,
    });

    await this.transactionsRepository.delete({
      where: { id: transactionId },
    });

    return null;
  }

  private async validateEntitiesOwnership({
    userId,
    categoryId,
    bankAccountId,
    transactionId,
  }: {
    userId: string;
    categoryId?: string;
    bankAccountId?: string;
    transactionId?: string;
  }) {
    await Promise.all([
      bankAccountId &&
        this.validateBankAccountOwnershipService.validate(
          userId,
          bankAccountId,
        ),
      categoryId &&
        this.validateCategoryOwnershipService.validate(userId, categoryId),
      transactionId &&
        this.validateTransactionOwnershipService.validate(
          userId,
          transactionId,
        ),
    ]);
  }
}
