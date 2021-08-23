import { inject, injectable } from "tsyringe";
import IEntriesRepository from "../repositories/IEntriesRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import Entry from "../infra/typeorm/entities/Entry";
import ICreateEntryDTO from "../dtos/ICreateEntryDTO";
import IUpdateEntryDTO from "../dtos/IUpdateEntryDTO";
import AppError from "@shared/errors/AppError";
import { classToClass } from "class-transformer";
import { addHours } from "date-fns";

@injectable()
class UpdateEntryService {
  constructor(
    @inject("EntriesRepository")
    private entriesRepository: IEntriesRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    entry_id,
    user_id,
    category_id,
    description,
    amount,
    property,
    date,
  }: IUpdateEntryDTO): Promise<Entry> {
    let entry = await this.entriesRepository.findById(entry_id);

    if (!entry || entry.user_id !== user_id)
      throw new AppError("Lancamento nao encontrado", 400);

    entry = {
      ...entry,
      category_id,
      description,
      amount,
      property,
      date: addHours(date, 12),
    };

    const newEntry = await this.entriesRepository.save(entry);

    const previousYear = new Date(entry.date).getFullYear();
    const previousMonth = new Date(entry.date).getMonth();

    await this.cacheProvider.invalidate(
      `list-entries:${user_id}:${previousYear}-${previousMonth}`
    );

    const nextYear = new Date(date).getFullYear();
    const nextMonth = new Date(date).getMonth();

    await this.cacheProvider.invalidate(
      `list-entries:${user_id}:${nextYear}-${nextMonth}`
    );

    return classToClass(newEntry);
  }
}

export default UpdateEntryService;
